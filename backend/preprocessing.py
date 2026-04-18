from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, RobustScaler


class PreprocessingPipeline:
    """
    Rebuilds the notebook preprocessing so API inference matches training logic.
    """

    def __init__(self, dataset_path: Path):
        self.dataset_path = dataset_path
        self.scaler: RobustScaler | None = None
        self.encoder: LabelEncoder | None = None
        self.high_amount_threshold: float | None = None
        self.numeric_columns: list[str] | None = None

    def fit(self) -> None:
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset not found: {self.dataset_path}")

        df = pd.read_csv(self.dataset_path)

        self.high_amount_threshold = float(df["amount"].quantile(0.99))

        self.encoder = LabelEncoder()
        self.encoder.fit(df["type"].astype(str))

        features_df = self._engineer_features(df)
        y = df["isFraud"].values

        X_train, _, _, _ = train_test_split(
            features_df,
            y,
            test_size=0.2,
            stratify=y,
            random_state=42,
        )

        self.numeric_columns = X_train.select_dtypes(include=[np.number]).columns.tolist()
        self.scaler = RobustScaler()
        self.scaler.fit(X_train[self.numeric_columns])

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        engineered = pd.DataFrame()

        engineered["step"] = df["step"].astype(float)
        engineered["amount"] = df["amount"].astype(float)
        engineered["log_amount"] = np.log1p(df["amount"].astype(float))

        if self.high_amount_threshold is None:
            raise ValueError("Pipeline not fitted: high_amount_threshold missing")
        engineered["is_high_amount"] = (
            df["amount"].astype(float) > self.high_amount_threshold
        ).astype(int)

        engineered["hour"] = (df["step"].astype(int) % 24).astype(float)
        engineered["is_night"] = engineered["hour"].isin([0, 1, 2, 3, 4, 5, 22, 23]).astype(int)

        engineered["balance_diff_orig"] = (
            df["oldbalanceOrg"].astype(float) - df["newbalanceOrig"].astype(float)
        )
        engineered["balance_diff_dest"] = (
            df["newbalanceDest"].astype(float) - df["oldbalanceDest"].astype(float)
        )

        if self.encoder is None:
            raise ValueError("Pipeline not fitted: encoder missing")
        try:
            engineered["type_enc"] = self.encoder.transform(df["type"].astype(str))
        except ValueError as exc:
            raise ValueError(
                f"Unknown transaction type. Supported types: {list(self.encoder.classes_)}"
            ) from exc

        return engineered

    def transform_one(self, payload: dict) -> pd.DataFrame:
        if self.scaler is None or self.numeric_columns is None:
            raise ValueError("Pipeline not fitted")

        input_df = pd.DataFrame([payload])
        features = self._engineer_features(input_df)

        scaled = features.copy()
        scaled[self.numeric_columns] = self.scaler.transform(scaled[self.numeric_columns])

        return scaled
