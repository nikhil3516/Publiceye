import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import redis

# Load environment variables
load_dotenv()

logger = logging.getLogger("publiceye_db")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://publiceye_user:publiceye_pass@localhost:5432/publiceye_db")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Fallback helper: if the URL references 'postgres' or 'redis' host but we are running outside Docker, 
# point it to localhost.
def adjust_host_for_local(url: str, default_host: str) -> str:
    is_docker = os.path.exists("/.dockerenv") or os.environ.get("RUNNING_IN_DOCKER") == "true"
    if not is_docker:
        if f"@{default_host}" in url:
            return url.replace(f"@{default_host}", "@localhost")
        if default_host in url:
            return url.replace(default_host, "localhost")
    return url

final_db_url = adjust_host_for_local(DATABASE_URL, "postgres")
final_redis_url = adjust_host_for_local(REDIS_URL, "redis")

# Intelligent Database Engine Creation
try:
    # Try connecting to Postgres
    engine = create_engine(final_db_url, connect_args={"connect_timeout": 2})
    # Quick check if connection works
    engine.connect()
    logger.info("Connected to PostgreSQL successfully.")
except Exception:
    # Fallback to SQLite if Postgres is unavailable
    sqlite_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "publiceye_local.db")
    final_db_url = f"sqlite:///{sqlite_path}"
    engine = create_engine(final_db_url, connect_args={"check_same_thread": False})
    logger.warning(f"PostgreSQL not found. Falling back to SQLite: {sqlite_path}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Intelligent Redis Connection
class MockRedis:
    """A simple in-memory mock for Redis when the service is not running."""
    def __init__(self):
        self.data = {}
    def setex(self, key, time, value):
        self.data[key] = value
        logger.info(f"[MockRedis] SETEX {key} -> {value} (TTL: {time}s)")
    def get(self, key):
        val = self.data.get(key)
        logger.info(f"[MockRedis] GET {key} -> {val}")
        return val
    def delete(self, key):
        if key in self.data:
            del self.data[key]
            logger.info(f"[MockRedis] DEL {key}")
    def from_url(self, *args, **kwargs):
        return self

try:
    redis_client = redis.from_url(final_redis_url, decode_responses=True, socket_timeout=2)
    redis_client.ping()
    logger.info("Connected to Redis successfully.")
except Exception:
    logger.warning("Redis not found. Falling back to in-memory MockRedis.")
    redis_client = MockRedis()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
