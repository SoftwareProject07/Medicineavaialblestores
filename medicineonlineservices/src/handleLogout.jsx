// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// // ✅ CORRECT PATH
// import { useCart } from "./Component/User/CartContext";

// export default function HandleLogout() {
//  const Logout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     logout();
//     navigate("/login");
//   }, []);

//   return null;
// };
// }

import { useCart } from "../User/CartContext";

const { clearCart } = useCart();

const handleLogout = () => {
  clearCart();     // ✅ only logged-in user's cart
  localStorage.removeItem("user");
  logout();
  navigate("/login");
};
