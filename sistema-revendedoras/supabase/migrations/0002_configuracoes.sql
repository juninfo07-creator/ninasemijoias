create table configuracoes (
  id smallint primary key default 1 check (id = 1),
  percentual_revendedora numeric(5,2) not null default 40.00,
  percentual_empresa numeric(5,2) not null default 60.00,
  percentual_proprietaria numeric(5,2) not null default 50.00, -- % da fatia empresa
  percentual_socia numeric(5,2) not null default 50.00,        -- % da fatia empresa
  prazo_padrao_dias int not null default 60,
  nome_empresa text,
  cnpj_empresa text,
  telefone_empresa text,
  endereco_empresa text,
  updated_at timestamptz not null default now(),
  constraint chk_soma_revendedora_empresa check (percentual_revendedora + percentual_empresa = 100),
  constraint chk_soma_proprietaria_socia check (percentual_proprietaria + percentual_socia = 100)
);

create trigger trg_configuracoes_updated_at
  before update on configuracoes for each row execute function set_updated_at();

insert into configuracoes (id) values (1) on conflict (id) do nothing;
