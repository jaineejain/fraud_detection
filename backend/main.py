from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model_loader import ModelArtifactError, ModelLoader
from preprocessing import PreprocessingPipeline
from schemas import PredictionResponse, TransactionRequest
from utils import setup_logger

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
MODEL_PATH = BASE_DIR / "model.pkl"
DATASET_PATH = ROOT_DIR / "paysim.csv"

logger = setup_logger()
app = FastAPI(title="Fraud Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

loader = ModelLoader(MODEL_PATH)
pipeline = PreprocessingPipeline(DATASET_PATH)
artifact = None
model = None
threshold = 0.5
feature_order: list[str] = []


@app.on_event("startup")
def startup_event() -> None:
    global artifact, model, threshold, feature_order

    try:
        artifact = loader.load()
        model = artifact["model"]
        threshold = float(artifact.get("threshold", 0.5))
        feature_order = list(artifact["features"])

        pipeline.fit()

        logger.info("Model and preprocessing pipeline loaded successfully")
    except (ModelArtifactError, FileNotFoundError, ValueError) as exc:
        logger.exception("Startup failed: %s", exc)
        raise RuntimeError(f"Startup failed: {exc}") from exc


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_type": type(model).__name__ if model is not None else None,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: TransactionRequest) -> PredictionResponse:
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        transformed = pipeline.transform_one(payload.model_dump())

        missing = [col for col in feature_order if col not in transformed.columns]
        if missing:
            raise ValueError(f"Missing engineered features: {missing}")

        transformed = transformed[feature_order]

        probability = float(model.predict_proba(transformed)[0, 1])
        prediction = int(probability >= threshold)
        label = "Fraud" if prediction == 1 else "Not Fraud"

        logger.info(
            "Prediction success | type=%s | amount=%.2f | probability=%.4f | pred=%s",
            payload.type,
            payload.amount,
            probability,
            prediction,
        )

        return PredictionResponse(
            prediction=prediction,
            label=label,
            probability=probability,
            threshold=threshold,
        )

    except ValueError as exc:
        logger.warning("Validation/preprocessing error: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Prediction failed: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error") from exc
