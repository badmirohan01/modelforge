from fastapi import APIRouter
from app.schemas.infer import InferRequest, InferResponse
from app.services.predictor import run_inference

router = APIRouter()

@router.post("/infer", response_model=InferResponse)
def infer(request: InferRequest):
    result = run_inference(request.model_id, request.inputs, request.return_proba)
    return result