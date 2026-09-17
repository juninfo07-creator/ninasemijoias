create view v_conferencias_saldo as
select
  c.id as conferencia_id,
  c.entrega_id,
  c.valor_empresa,
  c.data_realizada,
  row_number() over (partition by c.entrega_id order by c.data_realizada desc, c.created_at desc) = 1 as mais_recente,
  coalesce(sum(p.valor_pago) filter (where p.status = 'Ativo'), 0) as valor_pago,
  c.valor_empresa - coalesce(sum(p.valor_pago) filter (where p.status = 'Ativo'), 0) as valor_pendente,
  case
    when coalesce(sum(p.valor_pago) filter (where p.status = 'Ativo'), 0) <= 0 then 'Pendente'
    when coalesce(sum(p.valor_pago) filter (where p.status = 'Ativo'), 0) < c.valor_empresa then 'Parcial'
    else 'Pago'
  end as status_pagamento
from conferencias c
left join pagamentos p on p.conferencia_id = c.id
where c.status = 'Ativa'
group by c.id;
