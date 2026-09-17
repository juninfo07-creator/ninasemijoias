alter table configuracoes enable row level security;
alter table revendedoras enable row level security;
alter table mostruarios enable row level security;
alter table entregas enable row level security;
alter table conferencias enable row level security;
alter table pagamentos enable row level security;
alter table repasses enable row level security;

create policy "authenticated_full_access" on configuracoes
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on revendedoras
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on mostruarios
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on entregas
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on conferencias
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on pagamentos
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on repasses
  for all to authenticated using (true) with check (true);
