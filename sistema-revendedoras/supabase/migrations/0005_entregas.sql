create table entregas (
  id uuid primary key default gen_random_uuid(),
  revendedora_id uuid not null references revendedoras(id),
  mostruario_id uuid not null references mostruarios(id),
  data_entrega date not null default (now() at time zone 'America/Sao_Paulo')::date,
  prazo_dias_aplicado int not null,
  data_conferencia_prevista date not null,
  responsavel text,
  observacoes text,
  quantidade_pecas_entrega int not null check (quantidade_pecas_entrega > 0),
  valor_total_entrega numeric(10,2) not null check (valor_total_entrega >= 0),
  quantidade_pecas_atual int not null,
  valor_atual numeric(10,2) not null,
  excecao_autorizada boolean not null default false,
  status text not null default 'Aberta' check (status in ('Aberta','Encerrada')),
  data_encerramento date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Um mostruário só pode estar em UMA entrega aberta por vez
create unique index uq_entregas_mostruario_aberta on entregas (mostruario_id) where status = 'Aberta';

create index idx_entregas_revendedora on entregas (revendedora_id);
create index idx_entregas_mostruario on entregas (mostruario_id);
create index idx_entregas_status on entregas (status);
create index idx_entregas_data_conferencia_prevista on entregas (data_conferencia_prevista) where status = 'Aberta';

create trigger trg_entregas_updated_at
  before update on entregas for each row execute function set_updated_at();
