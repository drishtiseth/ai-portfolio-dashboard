from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from allmodels import PortfolioMetrics  # reuse your existing schema


class EvidenceItem(BaseModel):
    id: str
    label: str
    value: str


class Action(BaseModel):
    title: str
    rationale: str
    impact: Dict[str, float] = Field(
        default_factory=dict,
        description='KPIs deltas, e.g. {"sharpe_delta": 0.12, "vol_delta": -0.03}',
    )


class InsightReport(BaseModel):
    summary: str
    risks: List[str]
    opportunities: List[str]
    diversification_gaps: List[str]
    watchlist: List[str]
    actions: List[Action]
    evidence: List[EvidenceItem]


# We’ll POST the same shape as your /portfolio/analyze output
class InsightsIn(PortfolioMetrics):
    pass
