export type Holding = { ticker: string; quantity: number; buy_price?: number | null };

export type PortfolioIn = {
  currency: string;
  benchmark: string;
  holdings: Holding[];
};

export type TickerMetric = {
  ticker: string;
  weight: number;
  mean_return: number;
  volatility: number;
  sharpe: number;
  beta?: number | null;
  max_drawdown: number;
  sector: string;
};

export type PortfolioMetrics = {
  start_date: string;
  end_date: string;
  total_value: number;
  exp_return_annual: number;
  volatility_annual: number;
  sharpe_annual: number;
  max_drawdown: number;
  sector_exposure: Record<string, number>;
  per_ticker: TickerMetric[];
};
