alter table configuracoes
  drop constraint chk_soma_revendedora_empresa,
  drop column percentual_revendedora,
  drop column percentual_empresa,
  add column limite_faixa_comissao numeric(10,2) not null default 1000.00,
  add column percentual_revendedora_abaixo numeric(5,2) not null default 30.00
    check (percentual_revendedora_abaixo >= 0 and percentual_revendedora_abaixo <= 100),
  add column percentual_revendedora_acima numeric(5,2) not null default 40.00
    check (percentual_revendedora_acima >= 0 and percentual_revendedora_acima <= 100);
