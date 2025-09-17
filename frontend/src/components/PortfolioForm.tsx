import React, { useState } from "react";
import api from "../api";
import type { Holding, PortfolioIn, PortfolioMetrics } from "../types";


type Props = { onResult: (d: PortfolioMetrics) => void; onLoading?: (b: boolean) => void };

const seed: Holding[] = [
  { ticker: "AAPL", quantity: 10, buy_price: 160 },
  { ticker: "MSFT", quantity: 5, buy_price: 330 },
  { ticker: "NVDA", quantity: 2, buy_price: 900 },
];

export default function PortfolioForm({ onResult, onLoading }: Props) {
  const [currency, setCurrency] = useState("USD");
  const [benchmark, setBenchmark] = useState("SPY");
  const [holdings, setHoldings] = useState<Holding[]>(seed);
  const [error, setError] = useState<string | null>(null);

  const update = (i: number, key: keyof Holding, val: string) => {
    const next = holdings.slice();
    if (key === "quantity") next[i][key] = Number(val);
    else if (key === "buy_price") next[i][key] = val ? Number(val) : undefined;
    else next[i][key] = val.toUpperCase();
    setHoldings(next);
  };

  const addRow = () => setHoldings([...holdings, { ticker: "", quantity: 0 }]);
  const removeRow = (i: number) => setHoldings(holdings.filter((_, idx) => idx !== i));

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  onLoading?.(true);
  const payload: PortfolioIn = { currency, benchmark, holdings };
  try {
    const { data } = await api.post<PortfolioMetrics>("/portfolio/analyze", payload);
    onResult(data);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const e = err as { response?: { data?: { detail?: string } }; message?: string };
      setError(String(e.response?.data?.detail ?? e.message ?? "Request failed"));
    } else {
      setError("Request failed");
    }
  } finally {
    onLoading?.(false);
  }
};



  return (
    <form onSubmit={submit} className="card grid" style={{ gap: 16 }}>
      <div className="row">
        <label>
          <div>Currency</div>
          <input className="input" value={currency} onChange={e=>setCurrency(e.target.value)} />
        </label>
        <label>
          <div>Benchmark</div>
          <input className="input" value={benchmark} onChange={e=>setBenchmark(e.target.value.toUpperCase())} />
        </label>
        <button type="button" className="btn secondary" onClick={addRow}>+ Add</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="row" style={{ borderBottom: "1px solid #eee", padding: 8, fontWeight: 600 }}>
          <div style={{ width: 180 }}>Ticker</div>
          <div style={{ width: 160 }}>Quantity</div>
          <div style={{ width: 180 }}>Buy Price (opt)</div>
          <div>Action</div>
        </div>

        {holdings.map((h, i) => (
          <div key={i} className="row" style={{ borderBottom: "1px solid #f1f1f1", padding: 8 }}>
            <input className="input" style={{ width: 180 }} value={h.ticker} onChange={e=>update(i,"ticker",e.target.value)} />
            <input className="input" style={{ width: 160 }} type="number" step="any" value={h.quantity} onChange={e=>update(i,"quantity",e.target.value)} />
            <input className="input" style={{ width: 180 }} type="number" step="any" value={h.buy_price ?? ""} onChange={e=>update(i,"buy_price",e.target.value)} />
            <button type="button" className="btn secondary" onClick={()=>removeRow(i)}>Remove</button>
          </div>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      <button className="btn" type="submit">Analyze</button>
    </form>
  );
}

