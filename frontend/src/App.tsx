import { useState } from "react";
import type { PortfolioMetrics } from "./types";

import PortfolioForm from "./components/PortfolioForm";
import MetricsCards from "./components/MetricsCards";
import SectorPie from "./components/SectorPie";
import "./index.css";

export default function App() {
  const [data, setData] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <h1 className="h1">AI Portfolio Risk &amp; Insights</h1>

      <PortfolioForm
        onResult={(d) => {
          console.log("[App] got metrics:", d);
          setData(d);
        }}
        onLoading={(b) => {
          console.log("[App] loading =", b);
          setLoading(b);
        }}
      />

      {loading && <div className="card">Analyzing…</div>}

      {/* Only render metrics UI when data exists */}
      {data ? (
        <div className="grid" style={{ gap: 16, marginTop: 16 }}>
          {/* Summary cards — safe, uses only fields on data */}
          <MetricsCards data={data} />

          {/* Sector pie — guard against missing/empty exposure */}
          <div className="card">
            <h3>Sector Exposure</h3>
            <SectorPie data={data.sector_exposure ?? {}} />
          </div>

          {/* Per-ticker table — guard with ?., default to [] */}
          <div className="card">
            <h3>Per-Ticker Stats</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ticker</th><th>Weight</th><th>μ (ann)</th><th>σ (ann)</th>
                    <th>Sharpe</th><th>β</th><th>MDD</th><th>Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.per_ticker ?? []).map((t) => (
                    <tr key={t.ticker}>
                      <td><b>{t.ticker}</b></td>
                      <td>{((t?.weight ?? 0) * 100).toFixed(2)}%</td>
                      <td>{((t?.mean_return ?? 0) * 100).toFixed(2)}%</td>
                      <td>{((t?.volatility ?? 0) * 100).toFixed(2)}%</td>
                      <td>{(t?.sharpe ?? 0).toFixed(2)}</td>
                      <td>{t?.beta !== null && t?.beta !== undefined ? t.beta.toFixed(2) : "—"}</td>
                      <td>{((t?.max_drawdown ?? 0) * 100).toFixed(2)}%</td>
                      <td>{t?.sector ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          Enter holdings and click <b>Analyze</b>.
        </div>
      )}
    </div>
  );
}
