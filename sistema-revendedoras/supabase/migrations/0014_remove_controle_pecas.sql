alter table mostruarios
  drop column quantidade_pecas;

alter table entregas
  drop column quantidade_pecas_entrega,
  drop column quantidade_pecas_atual;

alter table conferencias
  drop column pecas_vendidas,
  drop column pecas_devolvidas,
  drop column pecas_repostas,
  drop column quantidade_pecas_apos,
  add column valor_devolvido numeric(10,2) not null default 0 check (valor_devolvido >= 0);

-- Sem contagem de peças, a entrega não mantém mais quantidade_pecas_atual.
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
          valor_atual = new.valor_atual_apos
      where id = new.entrega_id;

    update mostruarios set status = 'Disponível' where id = v_entrega.mostruario_id;
  else
    update entregas
      set data_conferencia_prevista = new.proxima_conferencia_prevista,
          valor_atual = new.valor_atual_apos
      where id = new.entrega_id;
  end if;

  return new;
end;
$$;
