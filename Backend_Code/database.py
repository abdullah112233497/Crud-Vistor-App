from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DB_URL = os.getenv("DB_URL")
 
# NeonDB requires SSL
engine = create_engine(DB_URL, connect_args={"sslmode": "require"})

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 