from fastapi import APIRouter
import time

router = APIRouter()
start_time = time.time()

@router.get("/health")
def health_check():
    from app.services.model_loader import _model_cache
    return {
        "status": "ok",
        "cached_models": len(_model_cache),
        "uptime_seconds": round(time.time() - start_time, 2)
    }