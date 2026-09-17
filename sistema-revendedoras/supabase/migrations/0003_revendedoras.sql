create table revendedoras (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  cpf text,
  telefone text,
  whatsapp text,
  email text,
  endereco text,
  cidade text,
  bairro text,
  data_cadastro date not null default (now() at time zone 'America/Sao_Paulo')::date,
  status text not null default 'Ativa' check (status in ('Ativa','Inativa')),
  observacoes text,
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index uq_revendedoras_cpf on revendedoras (cpf) where cpf is not null;
create index idx_revendedoras_status on revendedoras (status);

create trigger trg_revendedoras_updated_at
  before update on revendedoras for each row execute function set_updated_at();
