import React from "react";
import { createRoot } from "react-dom/client";
import { ToolingPreview } from "./ToolingPreview";
import "./style.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ToolingPreview />
  </React.StrictMode>
);
