from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, func
from typing import Optional
from datetime import datetime
from app.db.database import get_db
from app.models import Transaction
from app.schemas.transaction import PaginatedTransactionResponse, TransactionResponse
import math

router = APIRouter()

@router.get("", response_model=PaginatedTransactionResponse)
def get_transactions(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by merchant name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    start_date: Optional[datetime] = Query(None, description="Filter by start date"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date"),
    min_amount: Optional[float] = Query(None, description="Filter by minimum amount"),
    max_amount: Optional[float] = Query(None, description="Filter by maximum amount"),
    sort_by: str = Query("transaction_timestamp", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc or desc)")
):
    query = db.query(Transaction)
    
    # 1. Filtering
    if search:
        query = query.filter(Transaction.merchant.ilike(f"%{search}%"))
    if category:
        if category.lower() == "uncategorized":
            query = query.filter(Transaction.category.is_(None))
        else:
            query = query.filter(Transaction.category == category)
    if status:
        query = query.filter(Transaction.status == status.upper())
    if start_date:
        query = query.filter(Transaction.transaction_timestamp >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_timestamp <= end_date)
    if min_amount is not None:
        query = query.filter(Transaction.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Transaction.amount <= max_amount)
        
    # 2. Total Count (before pagination)
    total = query.count()
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    
    # 3. Sorting
    valid_sort_fields = {
        "transaction_timestamp": Transaction.transaction_timestamp,
        "amount": Transaction.amount,
        "merchant": Transaction.merchant,
        "category": Transaction.category,
        "status": Transaction.status
    }
    
    if sort_by not in valid_sort_fields:
        sort_by = "transaction_timestamp"
        
    sort_column = valid_sort_fields[sort_by]
    
    if sort_order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    # 4. Pagination
    offset = (page - 1) * page_size
    transactions = query.offset(offset).limit(page_size).all()
    
    return PaginatedTransactionResponse(
        transactions=transactions,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages
    )

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction_detail(
    transaction_id: str,
    db: Session = Depends(get_db)
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction
