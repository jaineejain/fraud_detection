from pathlib import Path
from typing import Any

import joblib


class ModelArtifactError(Exception):
    pass


class ModelLoader:
    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.artifact: dict[str, Any] | None = None

    def load(self) -> dict[str, Any]:
        if not self.model_path.exists():
            raise ModelArtifactError(f"Model file not found: {self.model_path}")

        artifact = joblib.load(self.model_path)
        if not isinstance(artifact, dict):
            raise ModelArtifactError("Artifact must be a dictionary")

        required_keys = {"model", "threshold", "features"}
        missing = required_keys - set(artifact.keys())
        if missing:
            raise ModelArtifactError(f"Missing required artifact keys: {missing}")

        self.artifact = artifact
        return artifact
