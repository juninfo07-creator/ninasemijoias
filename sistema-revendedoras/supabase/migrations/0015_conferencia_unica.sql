alter table conferencias
  drop constraint chk_parcial_tem_proxima,
  drop column tipo,
  drop column proxima_conferencia_prevista,
  drop column valor_reposicao,
  drop column valor_atual_apos;

alter table entregas
  drop column valor_atual;

-- Toda conferência agora sempre encerra a entrega e libera o mostruário.
create or replace function fn_apply_conferencia()
returns trigger language plpgsql as $$
declare
  v_entrega entregas%rowtype;
begin
  select * into v_entrega from entregas where id = new.entrega_id for update;

  if v_entrega.status = 'Encerrada' then
    raise exception 'Entrega % já está encerrada, não é possível registrar nova conferência.', new.entrega_id;
  end if;

  update entregas
    set status = 'Encerrada',
        data_encerramento = new.data_realizada
    where id = new.entrega_id;

  update mostruarios set status = 'Disponível' where id = v_entrega.mostruario_id;

  return new;
end;
$$;

-- Agora é 1:1 entrega<->conferência, não precisa mais de "mais_recente".
-- create or replace não permite remover coluna de view, precisa dropar antes.
drop view v_conferencias_saldo;

create view v_conferencias_saldo as
select
  c.id as conferencia_id,
  c.entrega_id,
  c.valor_empresa,
  c.data_realizada,
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
