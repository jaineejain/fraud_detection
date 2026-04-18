function FraudStatsChart({ historyItems }) {
  const total = historyItems.length;
  const fraudCount = historyItems.filter((item) => item.result.prediction === 1).length;
  const safeCount = total - fraudCount;

  const fraudPct = total ? (fraudCount / total) * 100 : 0;
  const safePct = total ? (safeCount / total) * 100 : 0;

  return (
    <div>
      <h5 className="mb-3">Prediction Distribution</h5>
      <div className="chart-wrap mb-3">
        <div className="chart-label">Fraud</div>
        <div className="chart-track">
          <div className="chart-fill bg-danger" style={{ width: `${fraudPct}%` }} />
        </div>
        <div className="chart-value">{fraudPct.toFixed(1)}%</div>
      </div>

      <div className="chart-wrap">
        <div className="chart-label">Not Fraud</div>
        <div className="chart-track">
          <div className="chart-fill bg-success" style={{ width: `${safePct}%` }} />
        </div>
        <div className="chart-value">{safePct.toFixed(1)}%</div>
      </div>
    </div>
  );
}

export default FraudStatsChart;
