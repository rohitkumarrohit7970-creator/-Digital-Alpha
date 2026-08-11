import os
import json
import math
from datetime import datetime, timezone
import dateutil.parser
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models import User, Transaction, Reward

# Initialize DB tables
Base.metadata.create_all(bind=engine)

def normalize_timestamp(ts):
    """
    Robust timestamp normalization.
    Handles Unix epochs (ms and s) and various string date formats.
    """
    if ts is None:
        return None
        
    try:
        # Handle numeric timestamps (Unix epochs)
        if isinstance(ts, (int, float)):
            # If timestamp is very large, it's likely in milliseconds
            if ts > 1e11:  
                ts = ts / 1000.0
            dt = datetime.fromtimestamp(ts, tz=timezone.utc)
            return dt
            
        # Handle string timestamps
        if isinstance(ts, str):
            # dateutil.parser handles ISO 8601, YYYY-MM-DD, MM/DD/YYYY elegantly
            dt = dateutil.parser.parse(ts)
            if dt.tzinfo is None:
                # Assume UTC if no timezone is provided
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
            
    except Exception as e:
        print(f"Failed to parse timestamp: {ts}, error: {e}")
        return None
        
    return None

def normalize_amount(amt):
    try:
        return float(amt)
    except (ValueError, TypeError):
        return 0.0

def seed_data():
    db: Session = SessionLocal()
    try:
        print("Starting seed process...")

        # 1. Create a Demo User
        demo_user_id = "USER_001"
        user = db.query(User).filter(User.id == demo_user_id).first()
        if not user:
            user = User(
                id=demo_user_id,
                name="Demo User",
                email="demo@digitalalpha.test",
                coin_balance=0
            )
            db.add(user)
            db.commit()
            print("Created Demo User.")

        # 2. Create 5 sample Rewards
        rewards_data = [
            {"id": "REW001", "name": "₹500 Amazon Voucher", "description": "Gift card for Amazon.in", "coin_cost": 500, "reward_type": "gift_card", "value": "500"},
            {"id": "REW002", "name": "1 Month Spotify Premium", "description": "Ad-free music streaming", "coin_cost": 150, "reward_type": "subscription", "value": "119"},
            {"id": "REW003", "name": "BookMyShow ₹250 Off", "description": "Discount on movie tickets", "coin_cost": 250, "reward_type": "discount", "value": "250"},
            {"id": "REW004", "name": "Swiggy ₹100 Coupon", "description": "Food delivery discount", "coin_cost": 100, "reward_type": "discount", "value": "100"},
            {"id": "REW005", "name": "MakeMyTrip Flight Voucher", "description": "Discount on domestic flights", "coin_cost": 1000, "reward_type": "voucher", "value": "1000"}
        ]
        
        for r_data in rewards_data:
            existing = db.query(Reward).filter(Reward.id == r_data["id"]).first()
            if not existing:
                db.add(Reward(**r_data))
        db.commit()
        print("Created sample Rewards.")

        # 3. Load Transactions efficiently
        data_path = os.path.join(os.path.dirname(__file__), '../../transactions.json')
        if not os.path.exists(data_path):
            print(f"Error: transactions.json not found at {data_path}")
            return
            
        with open(data_path, 'r') as f:
            transactions_raw = json.load(f)

        print(f"Found {len(transactions_raw)} transactions in JSON.")

        # Get existing transaction IDs to avoid duplicates (idempotency)
        existing_tx_ids = set(row[0] for row in db.query(Transaction.id).all())
        seen_json_ids = set()
        
        new_transactions = []
        total_coins_earned = 0
        
        for row in transactions_raw:
            tx_id = row.get("id")
            if tx_id in existing_tx_ids or tx_id in seen_json_ids:
                continue
            
            seen_json_ids.add(tx_id)
                
            amount = normalize_amount(row.get("amount", 0))
            status = row.get("status", "").upper()
            
            # Handle null/empty categories
            category = row.get("category")
            if not category or category.strip() == "":
                category = None
                
            tx = Transaction(
                id=tx_id,
                user_id=demo_user_id,
                merchant=row.get("merchant", "Unknown"),
                category=category,
                amount=amount,
                currency=row.get("currency", "INR"),
                status=status,
                payment_method=row.get("payment_method", "Unknown"),
                transaction_timestamp=normalize_timestamp(row.get("timestamp")) or datetime.now(timezone.utc)
            )
            new_transactions.append(tx)
            
            # 4. Calculate Coins
            # Only positive, successful transactions earn coins
            if status == "SUCCESS" and amount > 0:
                coins = math.floor(amount / 100)
                # Apply the per-transaction cap (e.g. 500)
                coins = min(coins, 500)
                total_coins_earned += coins

        if new_transactions:
            print(f"Inserting {len(new_transactions)} new transactions...")
            # Chunking inserts for performance
            chunk_size = 2000
            for i in range(0, len(new_transactions), chunk_size):
                db.bulk_save_objects(new_transactions[i:i+chunk_size])
                db.commit()
                
            # Update user coin balance
            user = db.query(User).filter(User.id == demo_user_id).first()
            user.coin_balance += total_coins_earned
            db.commit()
            print(f"Awarded {total_coins_earned} coins to user.")
            
        else:
            print("No new transactions to insert. Database is up to date.")

        print("Seed completed successfully!")
        
    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
