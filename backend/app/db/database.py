import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load .env from the root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/alphatech")
if DATABASE_URL and "?pgbouncer=true" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("?pgbouncer=true", "")
DIRECT_URL = os.getenv("DIRECT_URL")

engine = create_engine(DATABASE_URL)
schema_engine = create_engine(DIRECT_URL) if DIRECT_URL else engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
