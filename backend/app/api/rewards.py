from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import uuid

from app.db.database import get_db
from app.models import Reward, User, Redemption
from app.schemas.reward import RewardResponse, BalanceResponse, RedemptionSuccessResponse

router = APIRouter()

# Fixed user ID for this assignment
DEMO_USER_ID = "USER_001"

@router.get("", response_model=List[RewardResponse])
def get_rewards(db: Session = Depends(get_db)):
    """Fetch all rewards."""
    return db.query(Reward).all()

@router.get("/balance", response_model=BalanceResponse)
def get_balance(db: Session = Depends(get_db)):
    """Fetch the real user's current coin balance."""
    user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return BalanceResponse(coin_balance=user.coin_balance)

@router.post("/{reward_id}/redeem", response_model=RedemptionSuccessResponse, status_code=status.HTTP_201_CREATED)
def redeem_reward(reward_id: str, db: Session = Depends(get_db)):
    """
    Safely redeem a reward. 
    Uses row-level locking (with_for_update) to prevent race conditions (double-spending).
    """
    try:
        # 1 & 2. Verify reward exists and is active
        reward = db.query(Reward).filter(Reward.id == reward_id).first()
        if not reward:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward not found")
        if not reward.active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reward is no longer active")

        # 3. Verify user exists and lock the row to prevent race conditions
        user = db.query(User).filter(User.id == DEMO_USER_ID).with_for_update().first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        # 4. Verify balance is sufficient
        if user.coin_balance < reward.coin_cost:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Insufficient coin balance")
            
        # 5. Deduct coins
        user.coin_balance -= reward.coin_cost
        
        # 6. Create redemption record
        redemption = Redemption(
            id=f"RED{uuid.uuid4().hex[:10].upper()}",
            user_id=user.id,
            reward_id=reward.id,
            coins_spent=reward.coin_cost,
            status="SUCCESS"
        )
        db.add(redemption)
        
        # 7. Commit atomically
        db.commit()
        db.refresh(redemption)
        
        return RedemptionSuccessResponse(
            message="Reward successfully redeemed!",
            redemption=redemption,
            new_balance=user.coin_balance
        )
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Redemption failed due to server error: {str(e)}")
