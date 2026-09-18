import { RankingClient } from "@/components/ranking/RankingClient";

export default function RankingPage() {
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-neutral-900">Ranking de revendedoras</h1>
      <p className="mb-6 text-sm text-neutral-500">Ordenado por valor vendido no período.</p>
      <RankingClient />
    </div>
  );
}
