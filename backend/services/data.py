import pandas as pd
import yfinance as yf
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# ---------- helpers ----------

def _select_price_table(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize yfinance output into a 2D table of prices (columns = tickers).
    Handles single ticker, multi-index columns, and both Close/Adj Close.
    """
    if df is None or df.empty:
        return pd.DataFrame()

    # Multi-ticker usually returns MultiIndex (field, ticker)
    if isinstance(df.columns, pd.MultiIndex):
        lvl0 = df.columns.get_level_values(0)
        if "Close" in set(lvl0):
            out = df["Close"]
        elif "Adj Close" in set(lvl0):
            out = df["Adj Close"]
        else:
            raise ValueError("Yahoo response missing Close/Adj Close columns")
        if isinstance(out, pd.Series):
            out = out.to_frame()
        return out

    # Single-index columns (single ticker)
    cols = set(map(str, df.columns))
    if "Close" in cols:
        out = df[["Close"]]
    elif "Adj Close" in cols:
        out = df[["Adj Close"]]
    else:
        # some shapes return the series directly
        if isinstance(df, pd.Series):
            out = df.to_frame(name="Close")
        else:
            raise ValueError("Yahoo response missing Close/Adj Close columns (single-index)")
    return out

# ---------- public API ----------

def fetch_prices(tickers: List[str], period_years: int = 3) -> pd.DataFrame:
    """
    Download adjusted close prices for tickers over the given period.
    We request auto_adjust=True and then safely select Close.
    """
    try:
        period = f"{period_years}y"
        raw = yf.download(
            tickers,
            period=period,
            interval="1d",
            auto_adjust=True,   # avoids Adj Close surprises
            progress=False,
            group_by="column",  # consistent layout
        )
        prices = _select_price_table(raw)
        if isinstance(prices, pd.Series):
            prices = prices.to_frame()

        # If a single ticker, ensure column name is the ticker symbol
        if prices.shape[1] == 1 and len(tickers) == 1:
            prices.columns = [tickers[0]]

        prices = prices.dropna(how="all")
        if prices.empty:
            logger.warning(f"No price data fetched for {tickers}")
        return prices
    except Exception as e:
        logger.error(f"Failed to fetch prices for {tickers}: {e}")
        raise

def last_prices(prices: pd.DataFrame) -> Dict[str, float]:
    """Return last available price for each ticker."""
    if prices is None or prices.empty:
        return {}
    last_row = prices.ffill().iloc[-1]   # forward fill then last
    return {str(col): float(last_row[col]) for col in prices.columns}

def fetch_sectors(tickers: List[str]) -> Dict[str, str]:
    """Fetch sector per ticker (best-effort via yfinance)."""
    sectors: Dict[str, str] = {}
    for t in tickers:
        try:
            info = yf.Ticker(t).info or {}
            sectors[t] = info.get("sector", "Unknown") or "Unknown"
        except Exception as e:
            logger.warning(f"Could not fetch sector for {t}: {e}")
            sectors[t] = "Unknown"
    return sectors

def fetch_benchmark_series(benchmark: str, period_years: int = 3) -> pd.Series:
    """Adjusted close series for benchmark; used for beta calculation."""
    try:
        df = yf.download(
            benchmark,
            period=f"{period_years}y",
            interval="1d",
            auto_adjust=True,
            progress=False,
            group_by="column",
        )
        # df may be Series (single ticker) or DataFrame with Close
        if isinstance(df, pd.DataFrame):
            s = _select_price_table(df)
            if isinstance(s, pd.DataFrame):
                # pick the first column as a Series
                s = s.iloc[:, 0]
        else:
            s = df
        return s.dropna()
    except Exception as e:
        logger.error(f"Failed to fetch benchmark {benchmark}: {e}")
        raise
