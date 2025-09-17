import numpy as np
import pandas as pd
from typing import Dict, Tuple

def compute_weights(qty: Dict[str, float], last: Dict[str, float]) -> Dict[str, float]:
    values = {t: qty[t] * last[t] for t in qty}
    total = sum(values.values()) or 1.0
    return {t: v / total for t, v in values.items()}

def annualized_stats(price_df: pd.DataFrame, weights: Dict[str, float]) -> Tuple[float, float]:
    rets = price_df.pct_change().dropna()
    mu_ann = rets.mean() * 252
    cov_ann = rets.cov() * 252
    w = np.array([weights[t] for t in price_df.columns])
    port_ret = float((w * mu_ann.values).sum())
    port_vol = float(np.sqrt(w @ cov_ann.values @ w))
    return port_ret, port_vol

def max_drawdown_series(ret_series: pd.Series) -> float:
    cum = (1 + ret_series.dropna()).cumprod()
    peaks = cum.cummax()
    dd = cum / peaks - 1.0
    return float(dd.min())

def portfolio_drawdown(price_df: pd.DataFrame, weights: Dict[str, float]) -> float:
    rets = price_df.pct_change().dropna()
    w = np.array([weights[t] for t in rets.columns])
    port_ret_series = rets.dot(w)
    return max_drawdown_series(port_ret_series)

def simple_beta(stock_ret: pd.Series, bench_ret: pd.Series) -> float:
    aligned = pd.concat([stock_ret, bench_ret], axis=1).dropna()
    if aligned.shape[0] < 10:
        return float("nan")
    cov = np.cov(aligned.iloc[:, 0], aligned.iloc[:, 1])[0, 1]
    var = np.var(aligned.iloc[:, 1])
    if var == 0:
        return float("nan")
    return float(cov / var)
