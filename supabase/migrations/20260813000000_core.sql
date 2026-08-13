create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text,
  role text not null default 'member' check (role in ('owner','admin','manager','agent','member')),
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  source text,
  stage text not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  channel text not null default 'web',
  status text not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer','agent','human','system')),
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  channel text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_org_stage_idx on public.leads(organization_id, stage);
create index if not exists conversations_org_status_idx on public.conversations(organization_id, status);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.campaigns enable row level security;
alter table public.audit_events enable row level security;

create or replace function public.current_org_id() returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create policy if not exists organizations_member_select on public.organizations for select using (id = public.current_org_id());
create policy if not exists profiles_org_select on public.profiles for select using (organization_id = public.current_org_id());
create policy if not exists leads_org_all on public.leads for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy if not exists conversations_org_all on public.conversations for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy if not exists messages_org_all on public.messages for all using (conversation_id in (select id from public.conversations where organization_id = public.current_org_id())) with check (conversation_id in (select id from public.conversations where organization_id = public.current_org_id()));
create policy if not exists campaigns_org_all on public.campaigns for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy if not exists audit_org_select on public.audit_events for select using (organization_id = public.current_org_id());
