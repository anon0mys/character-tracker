import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import App from "./App";

// ts-ignore
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    if (!container) {
        throw new Error('Root element not found');
    }
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
})
