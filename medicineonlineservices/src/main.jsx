import React from "react";
// import { HashRouter } from "react-router-dom";
// import "../component/styles/noscroll.css";


import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "../styles/Global.css";
// import "../src/component/styles/Global.css";
import { CartProvider } from "./Component/User/CartContext";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <CartProvider>

      <App />
      </CartProvider>
    </BrowserRouter>
);
