create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  conferencia_id uuid not null references conferencias(id),
  valor_pago numeric(10,2) not null check (valor_pago > 0),
  data date not null default (now() at time zone 'America/Sao_Paulo')::date,
  forma_pagamento text not null check (forma_pagamento in ('PIX','Dinheiro','Transferência','Cartão','Outro')),
  observacao text,
  status text not null default 'Ativo' check (status in ('Ativo','Cancelado')),
  created_at timestamptz not null default now()
);

create index idx_pagamentos_conferencia on pagamentos (conferencia_id);
