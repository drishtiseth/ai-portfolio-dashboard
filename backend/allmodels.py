# allmodels.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date

class Holding(BaseModel):
    ticker: str = Field(..., pattern=r"^[A-Z.\-]+$")   # e.g. AAPL, BRK.B, RDS-A
    quantity: float = Field(..., gt=0)
    buy_price: Optional[float] = Field(None, gt=0)

class PortfolioIn(BaseModel):
    currency: str = "USD"
    benchmark: str = "SPY"
    holdings: List[Holding]

class TickerMetric(BaseModel):
    ticker: str
    weight: float
    mean_return: float
    volatility: float
    sharpe: float
    beta: Optional[float] = None
    max_drawdown: float
    sector: str

class PortfolioMetrics(BaseModel):
    start_date: date
    end_date: date
    total_value: float
    exp_return_annual: float
    volatility_annual: float
    sharpe_annual: float
    max_drawdown: float
    sector_exposure: Dict[str, float]
    per_ticker: List[TickerMetric]
