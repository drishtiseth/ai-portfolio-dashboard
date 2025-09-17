import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from allmodels import PortfolioIn, PortfolioMetrics, TickerMetric
from services.data import fetch_prices, fetch_sectors, fetch_benchmark_series, last_prices
from services.risk import compute_weights, annualized_stats, portfolio_drawdown, simple_beta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("portfolio-api")

app = FastAPI(title="AI Portfolio Risk & Insights API")

# Allow frontend (Vite default port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.post("/portfolio/analyze", response_model=PortfolioMetrics)
def analyze(p: PortfolioIn):
    try:
        tickers = [h.ticker.upper() for h in p.holdings]
        qty = {h.ticker.upper(): h.quantity for h in p.holdings}

        logger.info(f"Analyzing portfolio: tickers={tickers}, benchmark={p.benchmark}")

        prices = fetch_prices(tickers, period_years=3)
        if prices.empty:
            raise HTTPException(400, "Could not fetch prices for given tickers")

        last = last_prices(prices)
        weights = compute_weights(qty, last)
        total_value = sum(qty[t] * last[t] for t in qty)

        port_ret, port_vol = annualized_stats(prices, weights)
        sharpe = (port_vol and port_ret / port_vol) or 0.0
        mdd = portfolio_drawdown(prices, weights)

        sectors = fetch_sectors(tickers)
        sector_exposure = {}
        for t, w in weights.items():
            sec = sectors.get(t, "Unknown")
            sector_exposure[sec] = sector_exposure.get(sec, 0.0) + w

        rets = prices.pct_change().dropna()
        bench = fetch_benchmark_series(p.benchmark, period_years=3).pct_change().dropna()

        per = []
        for t in prices.columns:
            r = rets[t]
            mean_ret = float(r.mean() * 252)
            vol = float(r.std() * (252 ** 0.5))
            sh = (vol and mean_ret / vol) or 0.0
            beta = simple_beta(r, bench)
            ticker_mdd = float((1 + r).cumprod().div((1 + r).cumprod().cummax()).sub(1).min())
            per.append(
                TickerMetric(
                    ticker=t,
                    weight=float(weights.get(t, 0.0)),
                    mean_return=mean_ret,
                    volatility=vol,
                    sharpe=sh,
                    beta=beta,
                    max_drawdown=ticker_mdd,
                    sector=sectors.get(t, "Unknown"),
                )
            )

        return PortfolioMetrics(
            start_date=prices.index[0].date(),
            end_date=prices.index[-1].date(),
            total_value=float(total_value),
            exp_return_annual=float(port_ret),
            volatility_annual=float(port_vol),
            sharpe_annual=float(sharpe),
            max_drawdown=float(mdd),
            sector_exposure={k: float(v) for k, v in sector_exposure.items()},
            per_ticker=per,
        )

    except Exception as e:
        logger.exception("Error during portfolio analysis")
        raise HTTPException(status_code=500, detail=str(e))
