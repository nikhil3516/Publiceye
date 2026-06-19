import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base, SessionLocal
from app.auth.router import router as auth_router
from app.complaints.router import router as complaints_router
from app.users.router import router as users_router
from app.notifications.router import router as notifications_router

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("publiceye_main")

# Initialize database schemas
try:
    # Try enabling PostGIS extension on startup
    with SessionLocal() as db:
        db.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        db.commit()
    logger.info("PostGIS extension checked/created successfully.")
except Exception as e:
    logger.warning(f"Could not enable PostGIS extension (might be running standard PostgreSQL): {str(e)}")

# Create all schemas
Base.metadata.create_all(bind=engine)
logger.info("Database schemas created successfully.")

app = FastAPI(
    title="PublicEye Backend",
    description="Python FastAPI Backend for PublicEye Android Application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(complaints_router)
app.include_router(users_router)
app.include_router(notifications_router)

@app.get("/")
def read_root():
    return {
        "app": "PublicEye API",
        "status": "online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("PublicEye Backend Starting...")
    print("DOCS: http://localhost:8000/docs")
    print("EMULATOR BASE URL: http://10.0.2.2:8000/")
    print("="*50 + "\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
