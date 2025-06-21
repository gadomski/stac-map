import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { Provider } from "./components/ui/provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
