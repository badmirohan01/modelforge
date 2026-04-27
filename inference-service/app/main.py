from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers import infer, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("ModelForge inference service starting...")
    yield
    print("Shutting down...")

app = FastAPI(
    title="ModelForge Inference Service",
    description="ML model inference microservice",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(health.router)
app.include_router(infer.router)