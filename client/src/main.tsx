import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent unhandled promise rejections from causing signal abort errors
window.addEventListener('unhandledrejection', (event) => {
  console.log('Unhandled promise rejection prevented:', event.reason);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
