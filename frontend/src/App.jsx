import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import TemplatePreviewPage from "./pages/TemplatePreviewPage";
import DownloadPage from "./pages/DownloadPage";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <header className="header">
        <div className="container nav">
          <h1>Resume Templates</h1>
          <nav className="menu">
            <Link to="/">Home</Link>
            <Link to="/download">Download</Link>
            <button type="button" className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/templates/:id" element={<TemplateDetailPage />} />
          <Route path="/templates/:id/preview" element={<TemplatePreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
