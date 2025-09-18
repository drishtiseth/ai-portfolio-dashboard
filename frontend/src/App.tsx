import React, { useState } from "react";
import PortfolioForm from "./components/PortfolioForm";
import MetricsCards from "./components/MetricsCards";
import SectorPie from "./components/SectorPie";
import InsightsCard from "./components/InsightsCard";
import api from "./api";
import type { PortfolioMetrics, InsightReport } from "./types";

function App() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [insights, setInsights] = useState<InsightReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResult = async (m: PortfolioMetrics) => {
    setMetrics(m);
    setLoading(true);
    try {
      const { data } = await api.post<InsightReport>("/portfolio/insights", m);
      setInsights(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Portfolio Dashboard</h1>

      <PortfolioForm onResult={handleResult} onLoading={setLoading} />

      {loading && <p>⏳ Analyzing…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {metrics && (
        <>
          <MetricsCards data={metrics} />
          <SectorPie data={metrics.sector_exposure} />
        </>
      )}

      {insights && <InsightsCard insights={insights} />}
    </div>
  );
}

export default App;
