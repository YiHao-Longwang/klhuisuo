create table if not exists reservations (
  id bigserial primary key,
  reservation_ref text not null unique,
  status text not null default 'pending',
  locale text not null default 'en',
  customer_name text not null,
  customer_phone text not null,
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
);

create index if not exists reservations_created_at_idx on reservations (created_at desc);
create index if not exists reservations_status_idx on reservations (status);
