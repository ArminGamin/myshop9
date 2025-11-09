// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// Note: GA and Meta Pixel are loaded in index.html after idle to avoid blocking LCP.

// Remove prerendered LCP shell once app starts
const lcpShell = document.getElementById('lcp-shell');
if (lcpShell && lcpShell.parentElement) {
  lcpShell.parentElement.removeChild(lcpShell);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
