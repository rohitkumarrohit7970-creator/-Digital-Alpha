from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models import Transaction, User
from app.schemas.analytics import MonthlyAnalyticsResponse, CategoryAnalyticsResponse, DashboardSummaryResponse

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_spending = db.query(func.sum(Transaction.amount)).filter(Transaction.status == "SUCCESS").scalar() or 0.0
    successful_payments = db.query(func.count(Transaction.id)).filter(Transaction.status == "SUCCESS").scalar() or 0
    pending_payments = db.query(func.count(Transaction.id)).filter(Transaction.status == "PENDING").scalar() or 0
    
    user = db.query(User).first()
    reward_coins = user.coin_balance if user else 0
    
    return DashboardSummaryResponse(
        total_spending=total_spending,
        successful_payments=successful_payments,
        pending_payments=pending_payments,
        reward_coins=reward_coins
    )

@router.get("/monthly", response_model=MonthlyAnalyticsResponse)
def get_monthly_analytics(db: Session = Depends(get_db)):
    # Group by month (YYYY-MM)
    month_expr = func.to_char(Transaction.transaction_timestamp, 'YYYY-MM')
    
    results = (
        db.query(
            month_expr.label("month"),
            func.sum(Transaction.amount).label("total_amount"),
            func.count(Transaction.id).label("transaction_count")
        )
        .group_by(month_expr)
        .order_by(month_expr.desc())
        .all()
    )
    
    data = []
    for row in results:
        data.append({
            "month": row.month,
            "total_amount": row.total_amount or 0.0,
            "transaction_count": row.transaction_count
        })
        
    return MonthlyAnalyticsResponse(data=data)

@router.get("/categories", response_model=CategoryAnalyticsResponse)
def get_category_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(
            Transaction.category.label("category"),
            func.sum(Transaction.amount).label("total_amount"),
            func.count(Transaction.id).label("transaction_count")
        )
        .group_by(Transaction.category)
        .order_by(func.sum(Transaction.amount).desc())
        .all()
    )
    
    data = []
    for row in results:
        data.append({
            "category": row.category,
            "total_amount": row.total_amount or 0.0,
            "transaction_count": row.transaction_count
        })
        
    return CategoryAnalyticsResponse(data=data)
