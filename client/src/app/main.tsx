import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../assets/styles/index.css";
import App from "./App.tsx";
import { ThemeProvider } from "../shared/themes/ThemeContext.tsx";
import { CurrencyProvider } from "../shared/currency/currencyContext.tsx";




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
      <App />
      </CurrencyProvider>
    </ThemeProvider>
  </StrictMode>,
);
