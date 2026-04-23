from pathlib import Path
import joblib
from app.config import settings

# Simple dict-based cache. Replace with LRU later if memory grows.
_model_cache: dict[str, object] = {}

def load_model(model_id: str):
    if model_id in _model_cache:
        return _model_cache[model_id]   # warm — return immediately

    path = Path(settings.MODEL_STORAGE_PATH) / f"{model_id}.pkl"

    if not path.exists():
        raise FileNotFoundError(f"Model {model_id} not found")

    model = joblib.load(path)
    _model_cache[model_id] = model    # store for future calls
    return model

def evict_model(model_id: str) -> bool:
    return _model_cache.pop(model_id, None) is not None