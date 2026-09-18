import { MostruarioForm } from "@/components/mostruarios/MostruarioForm";
import { VoltarLink } from "@/components/layout/VoltarLink";
import { criarMostruario } from "../actions";

export default function NovoMostruarioPage() {
  return (
    <div>
      <VoltarLink href="/mostruarios" label="Mostruários" />
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Novo mostruário</h1>
      <MostruarioForm action={criarMostruario} submitLabel="Criar" />
    </div>
  );
}
