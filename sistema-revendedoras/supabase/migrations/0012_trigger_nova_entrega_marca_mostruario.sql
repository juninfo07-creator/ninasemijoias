-- Marca o mostruário como "Com revendedora" ao criar uma entrega.
-- (Complementa fn_apply_conferencia, que já libera o mostruário na conferência Final.)
create or replace function fn_apply_nova_entrega()
returns trigger language plpgsql as $$
begin
  update mostruarios set status = 'Com revendedora' where id = new.mostruario_id;
  return new;
end;
$$;

create trigger trg_apply_nova_entrega
  after insert on entregas for each row execute function fn_apply_nova_entrega();
