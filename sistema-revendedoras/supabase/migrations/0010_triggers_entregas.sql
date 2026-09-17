-- Bloqueia nova entrega se o mostruário não estiver Disponível, ou se a revendedora
-- tiver entrega Aberta com conferência atrasada ou pagamento pendente (sem exceção).
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

  select exists (
    select 1
    from entregas e
    left join v_conferencias_saldo s on s.entrega_id = e.id and s.mais_recente
    where e.revendedora_id = new.revendedora_id
      and e.status = 'Aberta'
      and (
        e.data_conferencia_prevista < v_hoje
        or (s.conferencia_id is not null and s.status_pagamento <> 'Pago')
      )
  ) into v_pendente;

  if v_pendente and not new.excecao_autorizada then
    raise exception 'Revendedora % possui conferência/pagamento pendente. Use excecao_autorizada para liberar.', new.revendedora_id;
  end if;

  return new;
end;
$$;

create trigger trg_check_nova_entrega
  before insert on entregas for each row execute function fn_check_nova_entrega();

-- Aplica os efeitos de uma conferência (Parcial ou Final) sobre a entrega e o mostruário.
create or replace function fn_apply_conferencia()
returns trigger language plpgsql as $$
declare
  v_entrega entregas%rowtype;
begin
  select * into v_entrega from entregas where id = new.entrega_id for update;

  if v_entrega.status = 'Encerrada' then
    raise exception 'Entrega % já está encerrada, não é possível registrar nova conferência.', new.entrega_id;
  end if;

  if new.tipo = 'Final' then
    update entregas
      set status = 'Encerrada',
          data_encerramento = new.data_realizada,
          quantidade_pecas_atual = new.quantidade_pecas_apos,
          valor_atual = new.valor_atual_apos
      where id = new.entrega_id;

    update mostruarios set status = 'Disponível' where id = v_entrega.mostruario_id;
  else
    update entregas
      set data_conferencia_prevista = new.proxima_conferencia_prevista,
          quantidade_pecas_atual = new.quantidade_pecas_apos,
          valor_atual = new.valor_atual_apos
      where id = new.entrega_id;
  end if;

  return new;
end;
$$;

create trigger trg_apply_conferencia
  after insert on conferencias for each row execute function fn_apply_conferencia();
