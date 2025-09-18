export interface Holding {
  ticker: string;
  quantity: number;
  buy_price: number;
}

export interface PortfolioIn {
  currency: string;
  benchmark: string;
  holdings: Holding[];
}

export interface PortfolioMetrics {
  start_date: string;
  end_date: string;
  total_value: number;
  exp_return_annual: number;
  volatility_annual: number;
  sharpe_annual: number;
  max_drawdown: number;
  sector_exposure: Record<string, number>;
  per_ticker: TickerMetric[];
}

export interface TickerMetric {
  ticker: string;
  value: number;
  weight: number;
  exp_return: number;
  volatility: number;
  sharpe: number;
}

export interface InsightReport {
  summary: string;
  risks: string[];
  opportunities: string[];
  diversification_gaps: string[];
  suggested_actions: string[];
  evidence: string[];
}
