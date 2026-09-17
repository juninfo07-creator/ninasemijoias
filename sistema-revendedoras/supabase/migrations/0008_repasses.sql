create table repasses (
  id uuid primary key default gen_random_uuid(),
  valor numeric(10,2) not null check (valor > 0),
  data date not null default (now() at time zone 'America/Sao_Paulo')::date,
  forma_pagamento text not null check (forma_pagamento in ('PIX','Dinheiro','Transferência','Cartão','Outro')),
  observacao text,
  status text not null default 'Ativo' check (status in ('Ativo','Cancelado')),
  created_at timestamptz not null default now()
);
