from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class RewardBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    coin_cost: int
    reward_type: str
    value: str
    active: bool

    model_config = ConfigDict(from_attributes=True)

class RewardResponse(RewardBase):
    pass

class BalanceResponse(BaseModel):
    coin_balance: int

class RedemptionResponse(BaseModel):
    id: str
    user_id: str
    reward_id: str
    coins_spent: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RedemptionSuccessResponse(BaseModel):
    message: str
    redemption: RedemptionResponse
    new_balance: int
