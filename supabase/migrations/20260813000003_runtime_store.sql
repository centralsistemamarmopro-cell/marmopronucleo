create table if not exists public.runtime_states (
  id uuid primary key default gen_random_uuid(),
  scope text not null unique,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.runtime_states enable row level security;
-- API uses the server-side service-role key for this transitional runtime store.
-- No client policy is intentionally granted.
