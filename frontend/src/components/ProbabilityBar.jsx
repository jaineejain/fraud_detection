function ProbabilityBar({ probability }) {
  const pct = Math.max(0, Math.min(100, probability * 100));
  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <small>Fraud Probability</small>
        <small>{pct.toFixed(2)}%</small>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-bar bg-warning"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProbabilityBar;
