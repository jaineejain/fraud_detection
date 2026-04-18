# Fraud Detection System (Full-Stack)

Production-ready B.Tech project setup using:
- Backend: FastAPI
- Frontend: React (Vite + Bootstrap)
- ML Model: joblib/pickle artifact (`model.pkl`)

## Project Structure

```text
fraud_detection/
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   ├── preprocessing.py
│   ├── schemas.py
│   ├── utils.py
│   ├── requirements.txt
│   └── model.pkl
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css
│       ├── api/
│       │   └── client.js
│       ├── components/
│       │   ├── FraudStatsChart.jsx
│       │   ├── PredictionHistory.jsx
│       │   └── ProbabilityBar.jsx
│       └── pages/
│           ├── HomePage.jsx
│           └── PredictionPage.jsx
├── paysim.csv
├── best_fraud_model_tuned.pkl
└── README.md
```

## Backend Features

- `/predict` endpoint for transaction classification
- `/health` endpoint for API health status
- Input validation with Pydantic
- Error handling with proper status codes
- Logging to console + `backend/logs/app.log`
- CORS enabled
- Loads model artifact from `backend/model.pkl`
- Rebuilds preprocessing pipeline from training dataset (`paysim.csv`) to match notebook logic

## Frontend Features

- Home page and Prediction page
- Fintech-style responsive UI
- Dark mode toggle
- Prediction form and loading state
- Fraud/Not Fraud result + probability bar
- Prediction history (localStorage)
- Simple fraud statistics chart
- Axios API integration

## Setup and Run

### 1. Backend setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend setup

```bash
cd frontend
npm install
# Optional env config
# copy .env.example to .env and edit if needed
npm run dev
```

Frontend URL: http://localhost:5173

## API Example

### POST /predict

```json
{
  "step": 1,
  "type": "TRANSFER",
  "amount": 50000,
  "oldbalanceOrg": 70000,
  "newbalanceOrig": 20000,
  "oldbalanceDest": 0,
  "newbalanceDest": 50000
}
```

### Response

```json
{
  "prediction": 1,
  "label": "Fraud",
  "probability": 0.9321,
  "threshold": 0.9081
}
```

## Notes

- Supported transaction types: `CASH_IN`, `CASH_OUT`, `DEBIT`, `PAYMENT`, `TRANSFER`
- If model training preprocessing changes, update `backend/preprocessing.py` accordingly.
