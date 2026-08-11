from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.db.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    merchant = Column(String, nullable=False)
    category = Column(String, nullable=True) # Will store NULL, show as Uncategorized in UI
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    status = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    transaction_timestamp = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Create indexes for common transaction queries
    __table_args__ = (
        Index('ix_transactions_user_id', 'user_id'),
        Index('ix_transactions_transaction_timestamp', 'transaction_timestamp'),
        Index('ix_transactions_category', 'category'),
        Index('ix_transactions_status', 'status'),
        Index('ix_transactions_merchant', 'merchant'),
        Index('ix_transactions_amount', 'amount'),
    )
