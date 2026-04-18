import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PredictionPage from "./pages/PredictionPage";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("fd_dark_mode");
    return saved ? saved === "true" : true;
  });

  useEffect(() => {
    document.body.classList.toggle("theme-dark", darkMode);
    localStorage.setItem("fd_dark_mode", String(darkMode));
  }, [darkMode]);

  const themeLabel = useMemo(
    () => (darkMode ? "Switch To Light" : "Switch To Dark"),
    [darkMode]
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <h1 className="brand-title mb-0">Sentinel Fraud Monitor</h1>
          <div className="d-flex align-items-center gap-3">
            <nav className="nav nav-pills">
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="/predict" className="nav-link">Analyze Transaction</NavLink>
            </nav>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {themeLabel}
            </button>
          </div>
        </div>
      </header>

      <main className="container py-4 py-md-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictionPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
