create sequence mostruarios_codigo_seq;

create table mostruarios (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique default ('M' || lpad(nextval('mostruarios_codigo_seq')::text, 4, '0')),
  nome text not null,
  tamanho text,
  quantidade_pecas int not null check (quantidade_pecas > 0),
  valor_total numeric(10,2) not null check (valor_total >= 0),
  status text not null default 'Disponível'
    check (status in ('Disponível','Com revendedora','Em conferência','Finalizado','Em manutenção/perda')),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mostruarios_status on mostruarios (status);

create trigger trg_mostruarios_updated_at
  before update on mostruarios for each row execute function set_updated_at();
