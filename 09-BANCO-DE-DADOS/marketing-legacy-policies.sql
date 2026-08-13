-- Políticas para tabelas legadas que passam a ser acessadas pelo Marketing.
create policy campaigns_company on campaigns for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));
create policy leads_company on leads for all to authenticated using (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id')) with check (company_id::text = ((select auth.jwt()) -> 'app_metadata' ->> 'company_id'));
