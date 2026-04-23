from pydantic import BaseModel, field_validator

class InferRequest(BaseModel):
    model_id: str
    inputs: list[float]
    return_proba: bool = False

    @field_validator("inputs")
    @classmethod
    def inputs_not_empty(cls, v):
        if not v:
            raise ValueError("inputs cannot be empty")
        return v

class InferResponse(BaseModel):
    prediction: int | float
    probabilities: list[float] | None = None
    latency_ms: float
    model_id: str