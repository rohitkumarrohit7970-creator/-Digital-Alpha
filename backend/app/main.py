from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health
from app.db.database import Base, engine
import app.models

# Create tables if they don't exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables. Database might not exist. Error: {e}")

app = FastAPI(
    title="Digital Alpha Technologies API",
    description="Backend API for the Digital Alpha take-home assignment",
    version="1.0.0",
)

import os

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# If we want to allow all for easy testing on Render:
if os.getenv("ENVIRONMENT") == "production" and not frontend_url:
    origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import health, transactions, analytics, rewards

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(rewards.router, prefix="/api/rewards", tags=["rewards"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Digital Alpha API. Check /api/health for status."}
