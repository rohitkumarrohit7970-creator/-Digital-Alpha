from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class TransactionBase(BaseModel):
    id: str
    user_id: str
    merchant: str
    category: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_method: str
    transaction_timestamp: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TransactionResponse(TransactionBase):
    pass

class PaginatedTransactionResponse(BaseModel):
    transactions: List[TransactionResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
