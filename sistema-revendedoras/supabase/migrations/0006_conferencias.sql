create table conferencias (
  id uuid primary key default gen_random_uuid(),
  entrega_id uuid not null references entregas(id),
  tipo text not null check (tipo in ('Parcial','Final')),
  data_realizada date not null default (now() at time zone 'America/Sao_Paulo')::date,

  -- movimentação de peças nesta conferência
  pecas_vendidas int not null default 0 check (pecas_vendidas >= 0),
  pecas_devolvidas int not null default 0 check (pecas_devolvidas >= 0),
  pecas_repostas int not null default 0 check (pecas_repostas >= 0), -- só usado em tipo='Parcial'

  -- financeiro desta conferência
  valor_vendido numeric(10,2) not null default 0 check (valor_vendido >= 0),
  descontos numeric(10,2) not null default 0 check (descontos >= 0),
  acrescimos numeric(10,2) not null default 0 check (acrescimos >= 0),
  valor_reposicao numeric(10,2) not null default 0 check (valor_reposicao >= 0),

  -- saldo com a revendedora após este evento (calculado pela aplicação)
  quantidade_pecas_apos int not null,
  valor_atual_apos numeric(10,2) not null,

  -- percentuais copiados de configuracoes NO MOMENTO do cálculo
  percentual_revendedora_aplicado numeric(5,2) not null,
  percentual_empresa_aplicado numeric(5,2) not null,
  percentual_proprietaria_aplicado numeric(5,2) not null,
  percentual_socia_aplicado numeric(5,2) not null,

  -- valores calculados
  valor_comissao_revendedora numeric(10,2) not null,
  valor_empresa numeric(10,2) not null,
  valor_proprietaria numeric(10,2) not null,
  valor_socia numeric(10,2) not null,

  -- só preenchido quando tipo='Parcial'
  proxima_conferencia_prevista date,

  status text not null default 'Ativa' check (status in ('Ativa','Cancelada')),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_parcial_tem_proxima check (
    (tipo = 'Parcial' and proxima_conferencia_prevista is not null)
    or (tipo = 'Final' and proxima_conferencia_prevista is null)
  )
);

create index idx_conferencias_entrega on conferencias (entrega_id);
create index idx_conferencias_data on conferencias (data_realizada);
create index idx_conferencias_status on conferencias (status);

create trigger trg_conferencias_updated_at
  before update on conferencias for each row execute function set_updated_at();
