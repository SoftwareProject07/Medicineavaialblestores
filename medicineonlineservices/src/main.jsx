// import React from "react";
// // import { HashRouter } from "react-router-dom";
// // import "../component/styles/noscroll.css";


// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./Component/User/AuthContext";
// import { CartProvider } from "./Component/User/CartContext";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// // import "../styles/Global.css";
// // import "../src/component/styles/Global.css";


// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//     <BrowserRouter>
//         <AuthProvider>

//         <CartProvider>

//       <App />
//       </CartProvider>
//       </AuthProvider>

//     </BrowserRouter>
// );

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Component/User/AuthContext";
import { CartProvider } from "./Component/User/CartContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
