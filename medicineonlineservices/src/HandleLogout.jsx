// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// // ✅ CORRECT PATH
// import { useCart } from "./Component/User/CartContext";

// export default function HandleLogout() {
//   const navigate = useNavigate();
//   const { clearCart } = useCart();

//   const handleLogout = () => {
//     clearCart();
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     Swal.fire("Logged out", "You have logged out", "success").then(() => {
//       window.location.href = "/login";
//     });
//   };

//   return (
//     <span onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
//       Logout
//     </span>
//   );
// }s
