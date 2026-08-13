alter table public.leads add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.campaigns add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

create index if not exists leads_organization_idx on public.leads(organization_id);
create index if not exists campaigns_organization_idx on public.campaigns(organization_id);

alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.campaigns enable row level security;
alter table public.profiles enable row level security;

create or replace function public.member_of_org(target_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members om
    where om.organization_id = target_org and om.user_id = auth.uid()
  )
$$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='leads' and policyname='leads_org_member_all') then
    create policy leads_org_member_all on public.leads for all using (organization_id is not null and public.member_of_org(organization_id)) with check (organization_id is not null and public.member_of_org(organization_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='conversations' and policyname='conversations_org_member_all') then
    create policy conversations_org_member_all on public.conversations for all using (public.member_of_org(organization_id)) with check (public.member_of_org(organization_id));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='messages_org_member_all') then
    create policy messages_org_member_all on public.messages for all using (exists (select 1 from public.conversations c where c.id=conversation_id and public.member_of_org(c.organization_id))) with check (exists (select 1 from public.conversations c where c.id=conversation_id and public.member_of_org(c.organization_id)));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='campaigns' and policyname='campaigns_org_member_all') then
    create policy campaigns_org_member_all on public.campaigns for all using (organization_id is not null and public.member_of_org(organization_id)) with check (organization_id is not null and public.member_of_org(organization_id));
  end if;
end $$;
