import { useEffect, useMemo, useState } from "react";
import { checkHealth, predictFraud } from "../api/client";
import ProbabilityBar from "../components/ProbabilityBar";
import PredictionHistory from "../components/PredictionHistory";
import FraudStatsChart from "../components/FraudStatsChart";

const defaultForm = {
  step: 1,
  type: "TRANSFER",
  amount: 50000,
  oldbalanceOrg: 70000,
  newbalanceOrig: 20000,
  oldbalanceDest: 0,
  newbalanceDest: 50000,
};

function PredictionPage() {
  const [formData, setFormData] = useState(defaultForm);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("fd_prediction_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    checkHealth()
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: "unavailable" }));
  }, []);

  useEffect(() => {
    localStorage.setItem("fd_prediction_history", JSON.stringify(history));
  }, [history]);

  const apiStatusClass = useMemo(() => {
    return health?.status === "ok" ? "text-success" : "text-danger";
  }, [health]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "type" ? value : Number(value),
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await predictFraud(formData);
      setResult(response);

      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          time: new Date().toISOString(),
          payload: formData,
          result: response,
        },
        ...prev,
      ].slice(0, 20));
    } catch (err) {
      const message = err.response?.data?.detail || "Prediction failed. Please verify input and backend status.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-xl-7">
        <div className="panel-card p-4 rounded-4 h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h4 mb-0">Transaction Prediction</h3>
            <small className={apiStatusClass}>API: {health?.status || "checking..."}</small>
          </div>

          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Step (hour)</label>
              <input className="form-control" type="number" name="step" value={formData.step} onChange={onChange} min="0" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Transaction Type</label>
              <select className="form-select" name="type" value={formData.type} onChange={onChange} required>
                <option value="CASH_IN">CASH_IN</option>
                <option value="CASH_OUT">CASH_OUT</option>
                <option value="DEBIT">DEBIT</option>
                <option value="PAYMENT">PAYMENT</option>
                <option value="TRANSFER">TRANSFER</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Amount</label>
              <input className="form-control" type="number" name="amount" value={formData.amount} onChange={onChange} min="0" step="0.01" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Old Balance Origin</label>
              <input className="form-control" type="number" name="oldbalanceOrg" value={formData.oldbalanceOrg} onChange={onChange} min="0" step="0.01" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">New Balance Origin</label>
              <input className="form-control" type="number" name="newbalanceOrig" value={formData.newbalanceOrig} onChange={onChange} min="0" step="0.01" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Old Balance Destination</label>
              <input className="form-control" type="number" name="oldbalanceDest" value={formData.oldbalanceDest} onChange={onChange} min="0" step="0.01" required />
            </div>

            <div className="col-md-6">
              <label className="form-label">New Balance Destination</label>
              <input className="form-control" type="number" name="newbalanceDest" value={formData.newbalanceDest} onChange={onChange} min="0" step="0.01" required />
            </div>

            <div className="col-12 d-flex gap-2 flex-wrap">
              <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? "Predicting..." : "Predict Fraud"}
              </button>
              <button type="button" className="btn btn-outline-light" onClick={() => setFormData(defaultForm)}>
                Reset
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}

          {result && (
            <div className="result-card mt-4 p-3 rounded-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Result</h5>
                <span className={`badge ${result.prediction === 1 ? "bg-danger" : "bg-success"}`}>
                  {result.label}
                </span>
              </div>
              <p className="mb-2">Threshold: {result.threshold.toFixed(4)}</p>
              <ProbabilityBar probability={result.probability} />
            </div>
          )}
        </div>
      </div>

      <div className="col-xl-5 d-flex flex-column gap-4">
        <div className="panel-card p-4 rounded-4">
          <FraudStatsChart historyItems={history} />
        </div>

        <div className="panel-card p-4 rounded-4">
          <h4 className="h5 mb-3">Recent Predictions</h4>
          <PredictionHistory historyItems={history} />
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;
