import React from "react";
import type { PortfolioMetrics } from "../types";


export default function MetricsCards({ data }: { data: PortfolioMetrics }) {
  const pct = (x: number) => (x*100).toFixed(2) + "%";
  const num = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid grid-4">
      <div className="card"><div className="muted">Total Value</div><div style={{ fontSize: 20, fontWeight: 700 }}>${num(data.total_value)}</div></div>
      <div className="card"><div className="muted">Exp. Return (annual)</div><div style={{ fontSize: 20, fontWeight: 700 }}>{pct(data.exp_return_annual)}</div></div>
      <div className="card"><div className="muted">Volatility (annual)</div><div style={{ fontSize: 20, fontWeight: 700 }}>{pct(data.volatility_annual)}</div></div>
      <div className="card"><div className="muted">Sharpe</div><div style={{ fontSize: 20, fontWeight: 700 }}>{data.sharpe_annual.toFixed(2)}</div></div>
      <div className="card" style={{ gridColumn: "span 2" }}><div className="muted">Max Drawdown</div><div style={{ fontSize: 20, fontWeight: 700 }}>{pct(data.max_drawdown)}</div></div>
      <div className="muted" style={{ gridColumn: "span 2", alignSelf: "center" }}>Window: {data.start_date} → {data.end_date}</div>
    </div>
  );
}
