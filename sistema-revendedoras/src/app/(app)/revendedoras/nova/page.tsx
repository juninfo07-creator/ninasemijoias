import { RevendedoraForm } from "@/components/revendedoras/RevendedoraForm";
import { criarRevendedora } from "../actions";

export default function NovaRevendedoraPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Nova revendedora</h1>
      <RevendedoraForm action={criarRevendedora} submitLabel="Criar" />
    </div>
  );
}
