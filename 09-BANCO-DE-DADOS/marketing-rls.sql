-- RLS do módulo Marketing. company_id deve estar em auth.app_metadata.
create policy marketing_segments_company on marketing_segments for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));
create policy campaign_contents_company on campaign_contents for all to authenticated using (exists (select 1 from campaigns c where c.id = campaign_id and c.company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'))) with check (exists (select 1 from campaigns c where c.id = campaign_id and c.company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')));
create policy campaign_events_company on campaign_events for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));
create policy marketing_automations_company on marketing_automations for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));
create policy marketing_consents_company on marketing_consents for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));

-- Ative RLS nas tabelas legadas antes de expô-las pela Data API e crie políticas equivalentes ao modelo de empresa.
alter table campaigns enable row level security;
alter table leads enable row level security;
