import { createServer } from "node:http";
import { createHash } from "node:crypto";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { neon } from "@neondatabase/serverless";
import { Server } from "socket.io";

dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 4000);
const DATABASE_URL = process.env.DATABASE_URL || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const CLICK_IP_SALT = process.env.CLICK_IP_SALT || "klyihao-contact-clicks-v1";
const CONTACT_CLICK_SITE = "klhuisuo";
const CONTACT_CLICK_DEFAULT_SOURCE = "main";
const CONTACT_CLICK_SITE_SPLIT_START = "2026-09-03T17:42:00.000Z";
const UNIQUE_IP_START = "2026-09-07T09:24:16.000Z";

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
    en: "Solo 12-Hour Pass + Free 30-min Massage",
    cn: "单人 12 小时门票 + 送 30 分钟按摩",
    unit: "/ person",
    weekday: 169,
    weekend: 199,
    kind: "spa-tiered",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  daytime: {
    en: "Daytime Massage Package",
    cn: "日间按摩配套",
    unit: "/ person",
    single: 199,
    kind: "spa-daily",
    leadHours: 0,
    hours: [9, 17],
    fee: { sc: 0.1, sst: 0.08 },
  },
  scrub: {
    en: "Yangzhou Body Scrub Package",
    cn: "扬州搓澡配套",
    unit: "/ person",
    weekday: 199,
    weekend: 239,
    kind: "spa-tiered",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  "allday-sm": {
    en: "All-Day Scrub & Massage Package",
    cn: "沐净舒养套餐",
    unit: "/ person",
    single: 379,
    kind: "spa-daily",
    leadHours: 0,
    fee: { sc: 0.1, sst: 0.08 },
  },
  "daytime-duo": {
    en: "Daytime Duo Package",
    cn: "日间双人套餐",
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
};

function db() {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  return neon(DATABASE_URL);
}

function cents(value) {
  return Math.round(value * 100);
}

function errorResponse(res, message, status = 400) {
  return res.status(status).json({ error: message });
}

function isWeekendOrHoliday(date) {
  const day = new Date(`${date}T12:00:00+08:00`).getDay();
  return day === 5 || day === 6 || holidays.has(date);
}

function selectedDateTime(date, time) {
  return new Date(`${date}T${time}:00+08:00`);
}

function tierFor(product, date) {
  return "single" in product ? "single" : isWeekendOrHoliday(date) ? "weekend" : "weekday";
}

function priceFor(product, date) {
  if ("single" in product) return product.single;
  return product[isWeekendOrHoliday(date) ? "weekend" : "weekday"];
}

function validateSlot(product, date, time) {
  const [hour] = time.split(":").map(Number);
  if (product.hours) {
    const [start, end] = product.hours;
    if (hour < start || hour > end) throw new Error("Selected time is outside this package's booking hours.");
  }

  const earliest = new Date();
  earliest.setHours(earliest.getHours() + product.leadHours);
  if (selectedDateTime(date, time) < earliest) {
    throw new Error(`This package must be booked at least ${product.leadHours} hour(s) ahead.`);
  }
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function makeRef() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `OS${stamp}${suffix}`;
}

function normalizeStatus(status) {
  return ["pending", "confirmed", "completed", "cancelled", "no_show"].includes(status)
    ? status
    : "";
}

function verifyAdmin(req) {
  if (!ADMIN_TOKEN) return true;
  return (
    req.query.token === ADMIN_TOKEN ||
    req.get("x-admin-token") === ADMIN_TOKEN ||
    req.body?.token === ADMIN_TOKEN
  );
}

function calculate(items) {
  const normalized = items.map((item) => {
    const product = products[item.code];
    if (!product) throw new Error("Unknown package selected.");
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

  return {
    items: normalized,
    subtotal: normalized.reduce((sum, item) => sum + item.subtotal, 0),
    serviceCharge: normalized.reduce((sum, item) => sum + item.serviceCharge, 0),
    sst: normalized.reduce((sum, item) => sum + item.sst, 0),
    total: normalized.reduce((sum, item) => sum + item.total, 0),
  };
}

async function ensureTable(sql) {
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

async function listReservations(sql) {
  return sql`
    select reservation_ref, status, locale, customer_name, customer_phone,
      customer_telegram, customer_email, customer_notes, visit_date, items, subtotal_cents,
      service_charge_cents, sst_cents, total_cents, payment_status,
      payment_timing, reminder_sent_at, created_at
    from reservations
    order by created_at desc
    limit 50
  `;
}

async function ensureContactClicksTable(sql) {
  await sql`
    create table if not exists contact_clicks (
      id bigserial primary key,
      channel text not null check (channel in ('whatsapp', 'telegram', 'wechat')),
      site text,
      source text,
      path text,
      href text,
      label text,
      ip_hash text,
      created_at timestamptz not null default now()
    )
  `;
  await sql`alter table contact_clicks add column if not exists site text`;
  await sql`alter table contact_clicks add column if not exists source text`;
  await sql`alter table contact_clicks add column if not exists ip_hash text`;
  await sql`alter table contact_clicks drop constraint if exists contact_clicks_channel_check`;
  await sql`alter table contact_clicks add constraint contact_clicks_channel_check check (channel in ('whatsapp', 'telegram', 'wechat'))`;
  await sql`
    update contact_clicks
    set source = 'jishi_tiaoxuan'
    where (source is null or source = '') and path ~ '^/jishi-tiaoxuan(/|$)'
  `;
  await sql`
    update contact_clicks
    set source = 'baiqu'
    where (source is null or source = '') and path ~ '^/(cn/)?baiqu(/|$)'
  `;
  await sql`
    update contact_clicks
    set site = case
      when source = 'baiqu' or path ~ '^/(cn/)?baiqu(/|$)' then 'onespa'
      when source = 'main' then 'klhuisuo'
      else site
    end
    where (site is null or site = '')
      and created_at >= ${CONTACT_CLICK_SITE_SPLIT_START}
      and (source in ('baiqu', 'main') or path ~ '^/(cn/)?baiqu(/|$)')
  `;
  await sql`create index if not exists contact_clicks_created_at_idx on contact_clicks (created_at desc)`;
  await sql`create index if not exists contact_clicks_channel_idx on contact_clicks (channel)`;
  await sql`create index if not exists contact_clicks_site_idx on contact_clicks (site)`;
  await sql`create index if not exists contact_clicks_source_idx on contact_clicks (source)`;
  await sql`create index if not exists contact_clicks_ip_hash_idx on contact_clicks (ip_hash)`;
  await sql`create index if not exists contact_clicks_unique_lookup_idx on contact_clicks (site, source, ip_hash, created_at)`;
}

function clean(value, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanChannel(value) {
  const channel = clean(value, 20).toLowerCase();
  return channel === "whatsapp" || channel === "telegram" || channel === "wechat" ? channel : "";
}

function channelFilter(value) {
  return cleanChannel(value) || "all";
}

function siteFilter(value) {
  const site = clean(value, 40).toLowerCase();
  return site === "klhuisuo" || site === "onespa" || site === "unknown" ? site : "all";
}

function sourceForPath(path) {
  if (/^\/jishi-tiaoxuan(?:\/|$)/.test(path)) return "jishi_tiaoxuan";
  if (/^\/(?:cn\/)?baiqu(?:\/|$)/.test(path)) return "baiqu";
  return CONTACT_CLICK_DEFAULT_SOURCE;
}

function cleanSource(value, path = "") {
  const source = clean(value, 40).toLowerCase();
  if (source === "jishi_tiaoxuan" || source === "baiqu" || source === "main") return source;
  return sourceForPath(path);
}

function sourceFilter(value) {
  const source = clean(value, 40).toLowerCase();
  return source === "jishi_tiaoxuan" || source === "baiqu" || source === "main" || source === "unknown"
    ? source
    : "all";
}

function intParam(value, fallback, min, max) {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function isIgnoredClickPath(path) {
  return /^\/(?:admin|codex-healthcheck)(?:\/|$)/.test(path);
}

function requestIp(req) {
  const forwarded = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"];
  const headerValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return clean(String(headerValue || "").split(",")[0] || req.ip || req.socket?.remoteAddress || "", 80);
}

function hashIp(ip) {
  if (!ip) return "";
  return createHash("sha256").update(`${CLICK_IP_SALT}:${ip}`).digest("hex");
}

const MALAYSIA_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function localTodayStartMs() {
  const klNow = new Date(Date.now() + MALAYSIA_OFFSET_MS);
  klNow.setUTCHours(0, 0, 0, 0);
  return klNow.getTime();
}

function localMonthStartMs() {
  const klNow = new Date(Date.now() + MALAYSIA_OFFSET_MS);
  return Date.UTC(klNow.getUTCFullYear(), klNow.getUTCMonth(), 1);
}

function localPeriodWindow(periodValue, dayValue) {
  const period = clean(periodValue, 20).toLowerCase();
  const todayMs = localTodayStartMs();
  const day = new Date(todayMs).getUTCDay();
  const daysSinceMonday = (day + 6) % 7;

  if (period === "day") {
    return {
      period: "day",
      days: 1,
      startIso: new Date(todayMs - MALAYSIA_OFFSET_MS).toISOString(),
    };
  }

  if (period === "week") {
    const startLocalMs = todayMs - daysSinceMonday * DAY_MS;
    return {
      period: "week",
      days: daysSinceMonday + 1,
      startIso: new Date(startLocalMs - MALAYSIA_OFFSET_MS).toISOString(),
    };
  }

  if (period === "month") {
    const startLocalMs = localMonthStartMs();
    return {
      period: "month",
      days: Math.floor((todayMs - startLocalMs) / DAY_MS) + 1,
      startIso: new Date(startLocalMs - MALAYSIA_OFFSET_MS).toISOString(),
    };
  }

  const days = intParam(dayValue ?? null, 30, 7, 90);
  return {
    period: "days",
    days,
    startIso: new Date(todayMs - MALAYSIA_OFFSET_MS - (days - 1) * DAY_MS).toISOString(),
  };
}

function localDayKey(startIso, offsetDays) {
  const utcMs = new Date(startIso).getTime() + offsetDays * DAY_MS;
  return new Date(utcMs + MALAYSIA_OFFSET_MS).toISOString().slice(0, 10);
}

async function contactClickStats(sql) {
  const todayIso = localPeriodWindow("day").startIso;
  const weekIso = localPeriodWindow("week").startIso;
  const monthIso = localPeriodWindow("month").startIso;
  const summary = await sql`
    with normalized as (
      select
        id,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(site, ''), 'unknown') end as site,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(source, ''), 'unknown') end as source,
        channel,
        ip_hash,
        created_at,
        nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} as is_old
      from contact_clicks
    ),
    first_clicks as (
      select id, site, source, channel, ip_hash, created_at, is_old
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
        where not is_old
      ) ranked
      where ip_rank = 1

      union all

      select id, site, source, channel, ip_hash, created_at, is_old
      from normalized
      where is_old
    )
    select
      site,
      source,
      channel,
      count(*)::int as total,
      count(*) filter (where created_at >= ${todayIso})::int as today,
      count(*) filter (where created_at >= ${weekIso})::int as this_week,
      count(*) filter (where created_at >= ${monthIso})::int as this_month
    from first_clicks
    group by site, source, channel
    order by site, source, channel
  `;
  const recent = await sql`
    with normalized as (
      select
        id,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(site, ''), 'unknown') end as site,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(source, ''), 'unknown') end as source,
        channel,
        ip_hash,
        path,
        label,
        created_at,
        nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} as is_old
      from contact_clicks
    ),
    first_clicks as (
      select site, source, channel, path, label, created_at
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
        where not is_old
      ) ranked
      where ip_rank = 1

      union all

      select site, source, channel, path, label, created_at
      from normalized
      where is_old
    )
    select site, source, channel, path, label, created_at
    from first_clicks
    order by created_at desc
    limit 20
  `;
  return { summary, recent };
}

async function contactClickHistory(sql, query) {
  const channel = channelFilter(query.channel);
  const site = siteFilter(query.site);
  const source = sourceFilter(query.source);
  const limit = intParam(query.limit, 25, 10, 100);
  const offset = intParam(query.offset, 0, 0, 100000);

  const [count] = await sql`
    with normalized as (
      select
        id,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(site, ''), 'unknown') end as site,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(source, ''), 'unknown') end as source,
        channel,
        ip_hash,
        created_at,
        nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} as is_old
      from contact_clicks
    ),
    first_clicks as (
      select id, site, source, channel, ip_hash, created_at, is_old
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
        where not is_old
      ) ranked
      where ip_rank = 1

      union all

      select id, site, source, channel, ip_hash, created_at, is_old
      from normalized
      where is_old
    )
    select
      count(*) filter (where not is_old)::int as total,
      count(*)::int as record_total
    from first_clicks
    where (${channel} = 'all' or channel = ${channel})
      and (${site} = 'all' or site = ${site})
      and (${source} = 'all' or source = ${source})
  `;
  const clicks = await sql`
    with normalized as (
      select
        id,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(site, ''), 'unknown') end as site,
        case when nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} then 'unknown' else coalesce(nullif(source, ''), 'unknown') end as source,
        channel,
        ip_hash,
        path,
        href,
        label,
        created_at,
        nullif(ip_hash, '') is null or created_at < ${UNIQUE_IP_START} as is_old
      from contact_clicks
    ),
    first_clicks as (
      select id, site, source, channel, path, href, label, created_at
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
        where not is_old
      ) ranked
      where ip_rank = 1

      union all

      select id, site, source, channel, path, href, label, created_at
      from normalized
      where is_old
    )
    select id, site, source, channel, path, href, label, created_at
    from first_clicks
    where (${channel} = 'all' or channel = ${channel})
      and (${site} = 'all' or site = ${site})
      and (${source} = 'all' or source = ${source})
    order by created_at desc
    limit ${limit}
    offset ${offset}
  `;
  return { clicks, total: count?.total ?? 0, record_total: count?.record_total ?? 0, limit, offset };
}

async function contactClickSeries(sql, query) {
  const channel = channelFilter(query.channel);
  const site = siteFilter(query.site);
  const source = sourceFilter(query.source);
  const { period, days, startIso } = localPeriodWindow(query.period, query.days);
  const rows = await sql`
    with normalized as (
      select
        id,
        coalesce(nullif(site, ''), 'unknown') as site,
        coalesce(nullif(source, ''), 'unknown') as source,
        channel,
        ip_hash,
        created_at
      from contact_clicks
      where created_at >= ${UNIQUE_IP_START}
        and nullif(ip_hash, '') is not null
    ),
    first_clicks as (
      select site, source, channel, ip_hash, created_at
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
      ) ranked
      where ip_rank = 1
    )
    select
      to_char(created_at at time zone 'Asia/Kuala_Lumpur', 'YYYY-MM-DD') as day,
      channel,
      count(*)::int as count
    from first_clicks
    where created_at >= ${startIso}
      and (${channel} = 'all' or channel = ${channel})
      and (${site} = 'all' or site = ${site})
      and (${source} = 'all' or source = ${source})
    group by day, channel
    order by day asc
  `;
  const dailyGroups = await sql`
    with normalized as (
      select
        id,
        coalesce(nullif(site, ''), 'unknown') as site,
        coalesce(nullif(source, ''), 'unknown') as source,
        channel,
        ip_hash,
        created_at
      from contact_clicks
      where created_at >= ${UNIQUE_IP_START}
        and nullif(ip_hash, '') is not null
    ),
    first_clicks as (
      select site, source, channel, ip_hash, created_at
      from (
        select
          normalized.*,
          row_number() over (partition by site, source, ip_hash order by created_at asc, id asc) as ip_rank
        from normalized
      ) ranked
      where ip_rank = 1
    )
    select
      to_char(created_at at time zone 'Asia/Kuala_Lumpur', 'YYYY-MM-DD') as day,
      site,
      source,
      count(*) filter (where channel = 'whatsapp')::int as whatsapp,
      count(*) filter (where channel = 'telegram')::int as telegram,
      count(*) filter (where channel = 'wechat')::int as wechat,
      count(*)::int as total
    from first_clicks
    where created_at >= ${startIso}
      and (${channel} = 'all' or channel = ${channel})
      and (${site} = 'all' or site = ${site})
      and (${source} = 'all' or source = ${source})
    group by day, site, source
    order by day desc, total desc, site asc, source asc
  `;

  const byDay = new Map();
  for (let index = 0; index < days; index += 1) {
    const day = localDayKey(startIso, index);
    byDay.set(day, { day, whatsapp: 0, telegram: 0, wechat: 0, total: 0 });
  }

  rows.forEach((row) => {
    const item = byDay.get(String(row.day));
    if (!item) return;
    if (row.channel === "whatsapp") item.whatsapp = Number(row.count || 0);
    if (row.channel === "telegram") item.telegram = Number(row.count || 0);
    if (row.channel === "wechat") item.wechat = Number(row.count || 0);
    item.total = item.whatsapp + item.telegram + item.wechat;
  });

  return { series: Array.from(byDay.values()), daily_groups: dailyGroups, days, period };
}

async function contactClickResponse(sql, query) {
  const view = clean(query.view, 20).toLowerCase();
  if (view === "history") return contactClickHistory(sql, query);
  if (view === "series") return contactClickSeries(sql, query);
  return contactClickStats(sql);
}

async function notifyTelegram(reservation) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const first = Array.isArray(reservation.items) ? reservation.items[0] : null;
  const text = [
    "New One Spa reservation",
    `Ref: ${reservation.reservation_ref}`,
    `Name: ${reservation.customer_name}`,
    reservation.customer_phone ? `WhatsApp: ${reservation.customer_phone}` : "",
    reservation.customer_telegram ? `Telegram: ${reservation.customer_telegram}` : "",
    first ? `Visit: ${first.date} ${first.time}` : "",
    `Total: RM${(Number(reservation.total_cents || 0) / 100).toFixed(2)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) {
    console.warn("Telegram notification failed:", await response.text());
  }
}

const app = express();
const allowedOrigin = FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN.split(",").map((item) => item.trim());

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigin, credentials: true },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!ADMIN_TOKEN || token === ADMIN_TOKEN) return next();
  return next(new Error("Unauthorized"));
});

io.on("connection", (socket) => {
  socket.join("admins");
  socket.emit("admin:ready", { ok: true });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/reservations", async (req, res) => {
  if (!verifyAdmin(req)) return errorResponse(res, "Unauthorized", 401);
  try {
    const sql = db();
    await ensureTable(sql);
    res.json({ reservations: await listReservations(sql) });
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : "Could not load reservations.", 500);
  }
});

app.get("/api/contact-clicks", async (req, res) => {
  if (!verifyAdmin(req)) return errorResponse(res, "Unauthorized", 401);
  try {
    const sql = db();
    await ensureContactClicksTable(sql);
    res.json(await contactClickResponse(sql, req.query));
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : "Could not load contact click stats.", 500);
  }
});

app.post("/api/contact-clicks", async (req, res) => {
  const channel = cleanChannel(req.body?.channel);
  if (!channel) return errorResponse(res, "Invalid contact channel.");
  const path = clean(req.body?.path, 180);
  if (isIgnoredClickPath(path)) return res.status(202).json({ ok: true, ignored: true });
  const source = cleanSource(req.body?.source, path);
  const ipHash = hashIp(requestIp(req));

  try {
    const sql = db();
    await ensureContactClicksTable(sql);
    if (ipHash) {
      const [existing] = await sql`
        select id, channel
        from contact_clicks
        where created_at >= ${UNIQUE_IP_START}
          and nullif(ip_hash, '') = ${ipHash}
          and coalesce(nullif(site, ''), ${CONTACT_CLICK_SITE}) = ${CONTACT_CLICK_SITE}
          and coalesce(nullif(source, ''), ${source}) = ${source}
        order by created_at asc, id asc
        limit 1
      `;
      if (existing) return res.status(200).json({ ok: true, duplicate: true, first_channel: existing.channel });
    }
    await sql`
      insert into contact_clicks (channel, site, source, path, href, label, ip_hash)
      values (${channel}, ${CONTACT_CLICK_SITE}, ${source}, ${path || null}, ${clean(req.body?.href, 300) || null}, ${clean(req.body?.label, 120) || null}, ${ipHash || null})
    `;
    res.status(201).json({ ok: true });
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : "Could not save contact click.", 500);
  }
});

app.post("/api/reservations", async (req, res) => {
  const payload = req.body || {};
  const customer = payload.customer || {};
  const name = String(customer.name || "").trim();
  const phone = String(customer.phone || "").trim();
  const telegram = String(customer.telegram || "").trim();

  if (!name) return errorResponse(res, "Customer name is required.");
  if (!phone && !telegram) return errorResponse(res, "Please provide WhatsApp phone or Telegram username.");
  if (!Array.isArray(payload.items) || !payload.items.length) return errorResponse(res, "Cart is empty.");

  let totals;
  try {
    totals = calculate(payload.items);
  } catch (error) {
    return errorResponse(res, error instanceof Error ? error.message : "Invalid reservation.");
  }

  try {
    const sql = db();
    await ensureTable(sql);
    const ref = makeRef();
    const [reservation] = await sql`
      insert into reservations (
        reservation_ref, locale, customer_name, customer_phone, customer_telegram, customer_email,
        customer_notes, visit_date, items, subtotal_cents, service_charge_cents,
        sst_cents, total_cents
      )
      values (
        ${ref}, ${payload.locale || "en"}, ${name}, ${phone || null}, ${telegram || null}, ${String(customer.email || "").trim() || null},
        ${String(customer.notes || "").trim() || null}, ${totals.items[0].date}, ${JSON.stringify(totals.items)}::jsonb,
        ${cents(totals.subtotal)}, ${cents(totals.serviceCharge)}, ${cents(totals.sst)},
        ${cents(totals.total)}
      )
      returning reservation_ref, status, locale, customer_name, customer_phone,
        customer_telegram, customer_email, customer_notes, visit_date, items, subtotal_cents,
        service_charge_cents, sst_cents, total_cents, payment_status,
        payment_timing, reminder_sent_at, created_at
    `;

    io.to("admins").emit("reservation:created", reservation);
    notifyTelegram(reservation).catch((error) => console.warn("Telegram notification error:", error));

    res.status(201).json({
      reservation,
      totals,
      payment: "pay_after_treatment",
      message:
        payload.locale === "cn"
          ? "预约已记录。客服会尽快跟进。"
          : "Reservation recorded. Our team will follow up soon.",
    });
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : "Could not save reservation.", 500);
  }
});

app.patch("/api/reservations", async (req, res) => {
  if (!verifyAdmin(req)) return errorResponse(res, "Unauthorized", 401);

  const reservationRef = String(req.body?.reservationRef || "").trim();
  const status = normalizeStatus(String(req.body?.status || ""));
  if (!reservationRef) return errorResponse(res, "Reservation reference is required.");
  if (!status) return errorResponse(res, "Invalid status.");

  try {
    const sql = db();
    await ensureTable(sql);
    const [reservation] = await sql`
      update reservations
      set status = ${status}
      where reservation_ref = ${reservationRef}
      returning reservation_ref, status
    `;

    if (!reservation) return errorResponse(res, "Reservation not found.", 404);
    io.to("admins").emit("reservation:updated", reservation);
    res.json({ reservation });
  } catch (error) {
    errorResponse(res, error instanceof Error ? error.message : "Could not update reservation.", 500);
  }
});

httpServer.listen(PORT, () => {
  console.log(`One Spa reservation websocket backend running on http://localhost:${PORT}`);
});
