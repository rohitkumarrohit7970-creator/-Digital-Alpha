from pydantic import BaseModel
from typing import List, Optional

class MonthlyAnalytics(BaseModel):
    month: str # e.g. "2025-10"
    total_amount: float
    transaction_count: int

class CategoryAnalytics(BaseModel):
    category: Optional[str]
    total_amount: float
    transaction_count: int

class MonthlyAnalyticsResponse(BaseModel):
    data: List[MonthlyAnalytics]

class CategoryAnalyticsResponse(BaseModel):
    data: List[CategoryAnalytics]

class DashboardSummaryResponse(BaseModel):
    total_spending: float
    successful_payments: int
    pending_payments: int
    reward_coins: int
