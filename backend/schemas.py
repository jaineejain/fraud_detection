from pydantic import BaseModel, Field, ConfigDict


class TransactionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    step: int = Field(..., ge=0, description="Time step in hours")
    type: str = Field(..., description="Transaction type, e.g. CASH_OUT, TRANSFER")
    amount: float = Field(..., ge=0)
    oldbalanceOrg: float = Field(..., ge=0)
    newbalanceOrig: float = Field(..., ge=0)
    oldbalanceDest: float = Field(..., ge=0)
    newbalanceDest: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    prediction: int
    label: str
    probability: float
    threshold: float
