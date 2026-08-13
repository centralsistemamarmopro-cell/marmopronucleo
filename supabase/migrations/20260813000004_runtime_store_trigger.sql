create or replace function public.set_runtime_state_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists runtime_states_updated_at on public.runtime_states;
create trigger runtime_states_updated_at before update on public.runtime_states for each row execute function public.set_runtime_state_updated_at();
