import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Estilos globales
import './styles/_reset.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/dark-theme.css'// Por defecto el tema claro

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
