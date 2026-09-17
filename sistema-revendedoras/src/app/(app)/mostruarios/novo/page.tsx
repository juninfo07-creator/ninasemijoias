import { MostruarioForm } from "@/components/mostruarios/MostruarioForm";
import { criarMostruario } from "../actions";

export default function NovoMostruarioPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Novo mostruário</h1>
      <MostruarioForm action={criarMostruario} submitLabel="Criar" />
    </div>
  );
}
