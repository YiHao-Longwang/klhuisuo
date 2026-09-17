import { neon } from "@neondatabase/serverless";

type ClickPayload = {
  channel?: string;
  source?: string;
  path?: string;
  href?: string;
  label?: string;
};

const CURRENT_SITE = "klhuisuo";
const DEFAULT_SOURCE = "main";
const UNIQUE_IP_START = "2026-09-07T09:24:16.000Z";

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

async function adminToken() {
  const cfEnv = await runtimeEnv();
  return process.env.ADMIN_TOKEN || cfEnv.ADMIN_TOKEN || "";
}

async function ensureTable(sql: ReturnType<typeof neon>) {
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
  await sql`create index if not exists contact_clicks_created_at_idx on contact_clicks (created_at desc)`;
  await sql`create index if not exists contact_clicks_channel_idx on contact_clicks (channel)`;
  await sql`create index if not exists contact_clicks_site_idx on contact_clicks (site)`;
  await sql`create index if not exists contact_clicks_source_idx on contact_clicks (source)`;
  await sql`create index if not exists contact_clicks_ip_hash_idx on contact_clicks (ip_hash)`;
  await sql`create index if not exists contact_clicks_unique_lookup_idx on contact_clicks (site, source, ip_hash, created_at)`;
}

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function clean(value: unknown, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanChannel(value: unknown) {
  const channel = clean(value, 20).toLowerCase();
  return channel === "whatsapp" || channel === "telegram" || channel === "wechat" ? channel : "";
}

function channelFilter(value: unknown) {
  return cleanChannel(value) || "all";
}

function siteFilter(value: unknown) {
  const site = clean(value, 40).toLowerCase();
  return site === "klhuisuo" || site === "onespa" || site === "unknown" ? site : "all";
}

function sourceForPath(path: string) {
  return /^\/jishi-tiaoxuan(?:\/|$)/.test(path) ? "jishi_tiaoxuan" : DEFAULT_SOURCE;
}

function cleanSource(value: unknown, path = "") {
  const source = clean(value, 40).toLowerCase();
  if (source === "main" || source === "baiqu" || source === "jishi_tiaoxuan") return source;
  return sourceForPath(path);
}

function sourceFilter(value: unknown) {
  const source = clean(value, 40).toLowerCase();
  return source === "main" || source === "baiqu" || source === "jishi_tiaoxuan" || source === "unknown" ? source : "all";
}

function intParam(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function isIgnoredPath(path: string) {
  return /^\/(?:admin|codex-healthcheck)(?:\/|$)/.test(path);
}

function requestIp(request: Request) {
  const forwarded =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for") ||
    "";
  return clean(forwarded.split(",")[0], 80);
}

async function hashIp(ip: string) {
  if (!ip) return "";
  const salt = process.env.CLICK_IP_SALT || "klyihao-contact-clicks-v1";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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

function localPeriodWindow(periodValue: unknown, dayValue?: string | null) {
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

function localDayKey(startIso: string, offsetDays: number) {
  const utcMs = new Date(startIso).getTime() + offsetDays * DAY_MS;
  return new Date(utcMs + MALAYSIA_OFFSET_MS).toISOString().slice(0, 10);
}

async function clickHistory(sql: ReturnType<typeof neon>, url: URL) {
  const channel = channelFilter(url.searchParams.get("channel"));
  const site = siteFilter(url.searchParams.get("site"));
  const source = sourceFilter(url.searchParams.get("source"));
  const limit = intParam(url.searchParams.get("limit"), 25, 10, 100);
  const offset = intParam(url.searchParams.get("offset"), 0, 0, 100000);

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

async function clickSeries(sql: ReturnType<typeof neon>, url: URL) {
  const channel = channelFilter(url.searchParams.get("channel"));
  const site = siteFilter(url.searchParams.get("site"));
  const source = sourceFilter(url.searchParams.get("source"));
  const { period, days, startIso } = localPeriodWindow(url.searchParams.get("period"), url.searchParams.get("days"));
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

  const byDay = new Map<string, { day: string; whatsapp: number; telegram: number; wechat: number; total: number }>();
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

export async function GET(request: Request) {
  const token = await adminToken();
  const url = new URL(request.url);
  if (token && url.searchParams.get("token") !== token) {
    return errorResponse("Unauthorized", 401);
  }

  const urlValue = await databaseUrl();
  if (!urlValue) return errorResponse("DATABASE_URL is not configured.", 503);

  const sql = neon(urlValue);
  await ensureTable(sql);
  const view = clean(url.searchParams.get("view"), 20).toLowerCase();
  if (view === "history") return Response.json(await clickHistory(sql, url));
  if (view === "series") return Response.json(await clickSeries(sql, url));

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

  return Response.json({ summary, recent });
}

export async function POST(request: Request) {
  const urlValue = await databaseUrl();
  if (!urlValue) return errorResponse("DATABASE_URL is not configured.", 503);

  let payload: ClickPayload;
  try {
    payload = (await request.json()) as ClickPayload;
  } catch {
    return errorResponse("Invalid JSON body.");
  }

  const channel = cleanChannel(payload.channel);
  if (!channel) return errorResponse("Invalid contact channel.");
  const path = clean(payload.path, 180);
  if (isIgnoredPath(path)) return Response.json({ ok: true, ignored: true }, { status: 202 });
  const source = cleanSource(payload.source, path);
  const ipHash = await hashIp(requestIp(request));

  const sql = neon(urlValue);
  await ensureTable(sql);
  if (ipHash) {
    const [existing] = await sql`
      select id, channel
      from contact_clicks
      where created_at >= ${UNIQUE_IP_START}
        and nullif(ip_hash, '') = ${ipHash}
        and coalesce(nullif(site, ''), ${CURRENT_SITE}) = ${CURRENT_SITE}
        and coalesce(nullif(source, ''), ${source}) = ${source}
      order by created_at asc, id asc
      limit 1
    `;
    if (existing) return Response.json({ ok: true, duplicate: true, first_channel: existing.channel });
  }
  await sql`
    insert into contact_clicks (channel, site, source, path, href, label, ip_hash)
    values (${channel}, ${CURRENT_SITE}, ${source}, ${path || null}, ${clean(payload.href, 300) || null}, ${clean(payload.label, 120) || null}, ${ipHash || null})
  `;

  return Response.json({ ok: true }, { status: 201 });
}
