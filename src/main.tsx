import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";
import { guardarGclid } from "./gclid";

// Guarda o código do clique do Google Ads assim que a pessoa chega (vale 90 dias)
guardarGclid();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
