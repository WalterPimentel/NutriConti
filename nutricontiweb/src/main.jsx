import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider } from "./contexts/useLoading.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </Router>
);
