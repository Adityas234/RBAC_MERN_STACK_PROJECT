import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Global React Error Boundary to catch render failures
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#fef2f2", color: "#991b1b", fontFamily: "sans-serif", border: "2px solid #f87171", borderRadius: "12px", margin: "20px" }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold" }}>⚠️ Application Render Crash</h2>
          <p style={{ fontWeight: "bold", fontSize: "14px", margin: "0 0 10px 0" }}>{this.state.error?.toString()}</p>
          <pre style={{ background: "#fee2e2", padding: "15px", borderRadius: "6px", overflowX: "auto", fontSize: "12px", whiteSpace: "pre-wrap" }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ background: "#fee2e2", padding: "15px", borderRadius: "6px", overflowX: "auto", fontSize: "12px", marginTop: "10px", whiteSpace: "pre-wrap" }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "15px", padding: "8px 16px", background: "#991b1b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global fallback UI for promise rejections & script errors
const showErrorOverlay = (message, stack) => {
  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = `
      <div style="padding: 30px; background: #fff5f5; color: #c53030; font-family: sans-serif; border: 2px solid #feb2b2; border-radius: 12px; margin: 20px;">
        <h2 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">🚨 Uncaught Global JavaScript Error</h2>
        <p style="font-weight: bold; font-size: 14px; margin: 0 0 10px 0;">${message}</p>
        <pre style="background: #fff; border: 1px solid #fed7d7; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px; whiteSpace: pre-wrap;">${stack || 'No stack trace available'}</pre>
        <button onclick="window.location.reload()" style="margin-top: 15px; padding: 8px 16px; background: #c53030; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Reload Page</button>
      </div>
    `;
  }
};

window.addEventListener("error", (event) => {
  // Ignore minor browser/extension warnings
  if (event.message?.includes("ResizeObserver") || event.message?.includes("Script error")) return;
  showErrorOverlay(event.message, event.error?.stack);
});

window.addEventListener("unhandledrejection", (event) => {
  showErrorOverlay(event.reason?.message || "Unhandled Promise Rejection", event.reason?.stack);
});

ReactDOM.createRoot(document.getElementById("root")).render(

<GoogleOAuthProvider

clientId={

import.meta.env.VITE_GOOGLE_CLIENT_ID

}

>

<ErrorBoundary>

<BrowserRouter>

<App />

</BrowserRouter>

</ErrorBoundary>

</GoogleOAuthProvider>

);
