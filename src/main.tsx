import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import SplashWrapper from "./components/portal/SplashScreen.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <SplashWrapper>
    <App />
  </SplashWrapper>
);
