function PredictionHistory({ historyItems }) {
  if (!historyItems.length) {
    return <p className="text-secondary mb-0">No predictions yet.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped align-middle">
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Label</th>
            <th>Probability</th>
          </tr>
        </thead>
        <tbody>
          {historyItems.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.time).toLocaleString()}</td>
              <td>{item.payload.type}</td>
              <td>{Number(item.payload.amount).toLocaleString()}</td>
              <td>
                <span className={`badge ${item.result.prediction === 1 ? "bg-danger" : "bg-success"}`}>
                  {item.result.label}
                </span>
              </td>
              <td>{(item.result.probability * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PredictionHistory;
