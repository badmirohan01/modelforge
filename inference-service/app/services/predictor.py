import numpy as np
import time
from app.services.model_loader import load_model

def run_inference(model_id: str, inputs: list[float], return_proba: bool):
    model = load_model(model_id)
    X = np.array(inputs).reshape(1, -1)   # (1, n_features)

    start = time.perf_counter()
    prediction = model.predict(X)[0]
    elapsed = (time.perf_counter() - start) * 1000

    probabilities = None
    if return_proba and hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(X)[0].tolist()

    return {
        "prediction": int(prediction) if isinstance(prediction, np.integer) else float(prediction),
        "probabilities": probabilities,
        "latency_ms": round(elapsed, 2),
        "model_id": model_id,
    }