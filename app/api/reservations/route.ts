import { neon } from "@neondatabase/serverless";

type CartItem = {
  code?: string;
  name?: string;
  locale?: "en" | "cn";
  date?: string;
  time?: string;
  qty?: number;
};

type CustomerPayload = {
  name?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  notes?: string;
};

const holidays = new Set([
  "2026-01-01",
  "2026-02-01",
  "2026-02-02",
  "2026-02-03",
  "2026-02-17",
  "2026-02-18",
  "2026-03-07",
  "2026-03-20",
  "2026-03-21",
  "2026-03-22",
  "2026-03-23",
  "2026-05-01",
  "2026-05-27",
  "2026-05-31",
  "2026-06-01",
  "2026-06-17",
  "2026-08-25",
  "2026-08-31",
  "2026-09-16",
  "2026-11-08",
  "2026-11-09",
  "2026-12-25",
]);

const products = {
  solo: {
    en: "12-Hour Entry",
    cn: "12 小时普通入场",
    unit: "/ person",
    weekday: 169,
    weekend: 199,
    kind: "spa-tiered",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  daytime: {
    en: "Daytime Entry",
    cn: "日间普通入场",
    unit: "/ person",
    single: 199,
    kind: "spa-daily",
    leadHours: 0,
    hours: [9, 17],
    fee: { sc: 0.1, sst: 0.08 },
  },
  scrub: {
    en: "Body Scrub Add-On",
    cn: "古法搓背加项",
    unit: "/ person",
    weekday: 199,
    weekend: 239,
    kind: "spa-tiered",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  "allday-sm": {
    en: "Body Care Add-Ons",
    cn: "身体护理加项",
    unit: "/ person",
    single: 379,
    kind: "spa-daily",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  "daytime-duo": {
    en: "Two-Guest Booking",
    cn: "双人普通预约",
    unit: "/ 2 people",
    single: 379,
    kind: "spa-daily",
    leadHours: 0,
    hours: [9, 17],
    fee: { sc: 0.1, sst: 0.08 },
  },
  kids: {
    en: "Kids Ticket",
    cn: "儿童票",
    unit: "/ child",
    weekday: 58,
    weekend: 88,
    kind: "spa-tiered",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  "outcall-classic": {
    en: "Classic 2-Hour Home Massage",
    cn: "经典 2 小时上门按摩",
    unit: "/ 2-hour session",
    single: 699,
    kind: "home",
    leadHours: 3,
    hours: [9, 22],
    fee: { sc: 0, sst: 0.08 },
  },
  "outcall-anytime": {
    en: "Anytime Hourly Home Massage (2h)",
    cn: "随时 2 小时上门按摩",
    unit: "/ 2-hour session",
    single: 798,
    kind: "home",
    leadHours: 3,
    fee: { sc: 0, sst: 0.08 },
  },
  "outcall-fourhands": {
    en: "Four-Hands Premium · 2h",
    cn: "四手尊宠 · 2 小时",
    unit: "/ 2-hour session",
    single: 1699,
    kind: "home",
    leadHours: 3,
    hours: [9, 22],
    fee: { sc: 0, sst: 0.08 },
  },
} as const;

async function runtimeEnv() {
  try {
    return ((await import("cloudflare:workers")) as { env?: Record<string, string> }).env ?? {};
  } catch {
    return {};
  }
}

async function databaseUrl() {
  const cfEnv = await runtimeEnv();
  return process.env.DATABASE_URL || cfEnv.DATABASE_URL || "";
}

function isWeekendOrHoliday(date: string) {
  const day = new Date(`${date}T12:00:00+08:00`).getDay();
  return day === 5 || day === 6 || holidays.has(date);
}

function selectedDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+08:00`);
}

function tierFor(product: (typeof products)[keyof typeof products], date: string) {
  return "single" in product ? "single" : isWeekendOrHoliday(date) ? "weekend" : "weekday";
}

function priceFor(product: (typeof products)[keyof typeof products], date: string) {
  if ("single" in product) return product.single;
  return product[isWeekendOrHoliday(date) ? "weekend" : "weekday"];
}

function validateSlot(product: (typeof products)[keyof typeof products], date: string, time: string) {
  const [hour] = time.split(":").map(Number);
  if ("hours" in product) {
    const [start, end] = product.hours;
    if (hour < start || hour > end) throw new Error("Selected time is outside this selection.s booking hours.");
  }

  const earliest = new Date();
  earliest.setHours(earliest.getHours() + product.leadHours);
  if (selectedDateTime(date, time) < earliest) {
    throw new Error(`This selection must be booked at least ${product.leadHours} hour(s) ahead.`);
  }
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function cents(value: number) {
  return Math.round(value * 100);
}

function makeRef() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `OS${stamp}${suffix}`;
}

function calculate(items: CartItem[]) {
  const normalized = items.map((item) => {
    const product = products[item.code as keyof typeof products];
    if (!product) throw new Error("Unknown selection.");
    if (!item.date || !validDate(item.date)) throw new Error("Visit date is required.");
    if (!item.time || !/^\d{2}:\d{2}$/.test(item.time)) throw new Error("Visit time is required.");

    validateSlot(product, item.date, item.time);

    const qty = Math.max(1, Math.min(20, Math.floor(Number(item.qty) || 1)));
    const tier = tierFor(product, item.date);
    const price = priceFor(product, item.date);
    const lineSubtotal = price * qty;
    const sc = Math.round(lineSubtotal * product.fee.sc * 100) / 100;
    const sst = Math.round((lineSubtotal + sc) * product.fee.sst * 100) / 100;
    const total = lineSubtotal + sc + sst;

    return {
      code: item.code,
      name: item.locale === "cn" ? product.cn : product.en,
      nameEn: product.en,
      nameCn: product.cn,
      unit: product.unit,
      date: item.date,
      time: item.time,
      qty,
      tier,
      pricingKind: product.kind,
      leadHours: product.leadHours,
      price,
      subtotal: lineSubtotal,
      serviceCharge: sc,
      sst,
      total,
    };
  });

  const subtotal = normalized.reduce((sum, item) => sum + item.subtotal, 0);
  const serviceCharge = normalized.reduce((sum, item) => sum + item.serviceCharge, 0);
  const sst = normalized.reduce((sum, item) => sum + item.sst, 0);
  const total = normalized.reduce((sum, item) => sum + item.total, 0);

  return { items: normalized, subtotal, serviceCharge, sst, total };
}

function normalizeStatus(status: string) {
  return ["pending", "confirmed", "completed", "cancelled", "no_show"].includes(status)
    ? status
    : "";
}

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    create table if not exists reservations (
      id bigserial primary key,
      reservation_ref text not null unique,
      status text not null default 'pending',
      locale text not null default 'en',
      customer_name text not null,
      customer_phone text,
      customer_telegram text,
      customer_email text,
      customer_notes text,
      visit_date date not null,
      items jsonb not null,
      subtotal_cents integer not null,
      service_charge_cents integer not null,
      sst_cents integer not null,
      total_cents integer not null,
      payment_status text not null default 'pay_after_treatment',
      payment_timing text not null default 'after_treatment',
      reminder_sent_at timestamptz,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table reservations alter column customer_phone drop not null`;
  await sql`alter table reservations add column if not exists customer_telegram text`;
  await sql`alter table reservations add column if not exists reminder_sent_at timestamptz`;
  await sql`create index if not exists reservations_created_at_idx on reservations (created_at desc)`;
  await sql`create index if not exists reservations_status_idx on reservations (status)`;
}

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cfEnv = await runtimeEnv();
  const token = process.env.ADMIN_TOKEN || cfEnv.ADMIN_TOKEN || "";
  if (token && url.searchParams.get("token") !== token) {
    return errorResponse("Unauthorized", 401);
  }

  const urlValue = await databaseUrl();
  if (!urlValue) return errorResponse("DATABASE_URL is not configured.", 503);

  const sql = neon(urlValue);
  await ensureTable(sql);
  const rows = await sql`
      select reservation_ref, status, locale, customer_name, customer_phone,
        customer_telegram, customer_email, customer_notes, visit_date, items, subtotal_cents,
        service_charge_cents, sst_cents, total_cents, payment_status,
        payment_timing, reminder_sent_at, created_at
      from reservations
      order by created_at desc
      limit 50
    `;
  return Response.json({ reservations: rows });
}

export async function POST(request: Request) {
  const urlValue = await databaseUrl();
  if (!urlValue) return errorResponse("DATABASE_URL is not configured.", 503);

  let payload: {
    locale?: "en" | "cn";
    customer?: CustomerPayload;
    items?: CartItem[];
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  const customer = payload.customer ?? {};
  const name = customer.name?.trim() ?? "";
  const phone = customer.phone?.trim() ?? "";
  const telegram = customer.telegram?.trim() ?? "";
  if (!name) return errorResponse("Customer name is required.");
  if (!phone && !telegram) return errorResponse("Please provide WhatsApp phone or Telegram username.");
  if (!payload.items?.length) return errorResponse("Cart is empty.");

  let totals: ReturnType<typeof calculate>;
  try {
    totals = calculate(payload.items);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Invalid reservation.");
  }

  const ref = makeRef();
  const visitDate = totals.items[0].date;
  const sql = neon(urlValue);

  try {
    await ensureTable(sql);
    const [reservation] = await sql`
      insert into reservations (
        reservation_ref, locale, customer_name, customer_phone, customer_telegram, customer_email,
        customer_notes, visit_date, items, subtotal_cents, service_charge_cents,
        sst_cents, total_cents
      )
      values (
        ${ref}, ${payload.locale ?? "en"}, ${name}, ${phone || null}, ${telegram || null}, ${customer.email?.trim() || null},
        ${customer.notes?.trim() || null}, ${visitDate}, ${JSON.stringify(totals.items)}::jsonb,
        ${cents(totals.subtotal)}, ${cents(totals.serviceCharge)}, ${cents(totals.sst)},
        ${cents(totals.total)}
      )
      returning reservation_ref, status, total_cents, payment_status, created_at
    `;

    return Response.json(
      {
        reservation,
        totals,
        payment: "pay_after_treatment",
        message:
          payload.locale === "cn"
            ? "预约已记录。客服会尽快跟进。"
            : "Reservation recorded. Our team will follow up soon.",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Could not save reservation.", 500);
  }
}

export async function PATCH(request: Request) {
  const cfEnv = await runtimeEnv();
  const token = process.env.ADMIN_TOKEN || cfEnv.ADMIN_TOKEN || "";
  if (token && request.headers.get("x-admin-token") !== token) {
    return errorResponse("Unauthorized", 401);
  }

  const urlValue = await databaseUrl();
  if (!urlValue) return errorResponse("DATABASE_URL is not configured.", 503);

  let payload: { reservationRef?: string; status?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  const reservationRef = payload.reservationRef?.trim() ?? "";
  const status = normalizeStatus(payload.status ?? "");
  if (!reservationRef) return errorResponse("Reservation reference is required.");
  if (!status) return errorResponse("Invalid status.");

  const sql = neon(urlValue);
  await ensureTable(sql);
  const [reservation] = await sql`
    update reservations
    set status = ${status}
    where reservation_ref = ${reservationRef}
    returning reservation_ref, status
  `;

  if (!reservation) return errorResponse("Reservation not found.", 404);
  return Response.json({ reservation });
}
