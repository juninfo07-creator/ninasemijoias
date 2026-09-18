-- fn_check_nova_entrega ainda usava v_conferencias_saldo.mais_recente, removida na 0015.
-- Além disso, como toda conferência agora encerra a entrega, "pagamento pendente" nunca
-- está numa entrega Aberta — precisa olhar as conferências da revendedora (de qualquer
-- entrega dela, aberta ou já encerrada) com pagamento pendente/parcial.
create or replace function fn_check_nova_entrega()
returns trigger language plpgsql as $$
declare
  v_hoje date := (now() at time zone 'America/Sao_Paulo')::date;
  v_mostruario_status text;
  v_pendente boolean;
begin
  select status into v_mostruario_status from mostruarios where id = new.mostruario_id;
  if v_mostruario_status <> 'Disponível' then
    raise exception 'Mostruário % não está Disponível (status atual: %)', new.mostruario_id, v_mostruario_status;
  end if;

  select
    exists (
      select 1
      from entregas e
      where e.revendedora_id = new.revendedora_id
        and e.status = 'Aberta'
        and e.data_conferencia_prevista < v_hoje
    )
    or exists (
      select 1
      from conferencias c
      join entregas e on e.id = c.entrega_id
      join v_conferencias_saldo s on s.conferencia_id = c.id
      where e.revendedora_id = new.revendedora_id
        and s.status_pagamento <> 'Pago'
    )
  into v_pendente;

  if v_pendente and not new.excecao_autorizada then
    raise exception 'Revendedora % possui conferência atrasada ou pagamento pendente. Use excecao_autorizada para liberar.', new.revendedora_id;
  end if;

  return new;
end;
$$;
