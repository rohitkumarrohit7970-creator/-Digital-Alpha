import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import get_db, Base
from app.models import User, Reward

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Setup seed data
    user = User(id="USER_001", name="Test User", email="test@example.com", coin_balance=500)
    
    reward1 = Reward(id="REW1", name="Active Aff", coin_cost=100, reward_type="discount", value="100", active=True)
    reward2 = Reward(id="REW2", name="Active Unaff", coin_cost=1000, reward_type="discount", value="100", active=True)
    reward3 = Reward(id="REW3", name="Inactive", coin_cost=100, reward_type="discount", value="100", active=False)
    
    db.add_all([user, reward1, reward2, reward3])
    db.commit()
    db.close()
    yield

def test_successful_redemption():
    response = client.post("/api/rewards/REW1/redeem")
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Reward successfully redeemed!"
    assert data["new_balance"] == 400

def test_insufficient_balance():
    response = client.post("/api/rewards/REW2/redeem")
    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient coin balance"
    
    # Ensure balance was not deducted
    bal_res = client.get("/api/rewards/balance")
    assert bal_res.json()["coin_balance"] == 500

def test_nonexistent_reward():
    response = client.post("/api/rewards/NON_EXISTENT/redeem")
    assert response.status_code == 404
    assert response.json()["detail"] == "Reward not found"

def test_inactive_reward():
    response = client.post("/api/rewards/REW3/redeem")
    assert response.status_code == 400
    assert response.json()["detail"] == "Reward is no longer active"

def test_transactions_pagination():
    response = client.get("/api/transactions?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "transactions" in data
    assert "total_pages" in data

def test_transactions_filtering():
    response = client.get("/api/transactions?status=SUCCESS")
    assert response.status_code == 200
    data = response.json()
    for tx in data["transactions"]:
        assert tx["status"] == "SUCCESS"
