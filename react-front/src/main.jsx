import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import App from "./pages/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>
);
