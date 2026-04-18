import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="hero-card p-4 p-md-5 rounded-4">
      <div className="row g-4 align-items-center">
        <div className="col-lg-8">
          <p className="text-uppercase small text-info mb-2">Real-Time Risk Intelligence</p>
          <h2 className="display-6 fw-bold mb-3">Spot Suspicious Transfers Before They Become Losses</h2>
          <p className="lead text-secondary mb-4">
            Sentinel combines engineered transaction signals with a tuned machine learning model
            to score payment risk in milliseconds. Run a transaction through the analyzer and
            inspect confidence, threshold logic, and recent decision patterns.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link className="btn btn-warning btn-lg" to="/predict">Open Risk Analyzer</Link>
            <a className="btn btn-outline-light btn-lg" href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
              API Docs
            </a>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="metric-card p-3 rounded-3">
            <h6 className="text-secondary">What You Get</h6>
            <ul className="mb-0 ps-3">
              <li>Live fraud probability with decision threshold</li>
              <li>Feature-consistent scoring from your trained model</li>
              <li>Recent prediction history with quick trend view</li>
              <li>Clean interface tuned for desktop and mobile</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
