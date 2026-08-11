from app.db.database import SessionLocal
from app.models import Transaction, User, Reward
db = SessionLocal()
tx_count = db.query(Transaction).count()
user = db.query(User).first()
rewards = db.query(Reward).count()
print(f"Transactions: {tx_count}")
print(f"User Balance: {user.coin_balance}")
print(f"Rewards: {rewards}")
