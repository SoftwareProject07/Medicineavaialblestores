import "@fortawesome/fontawesome-free/css/all.min.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./Component/User/CartContext.jsx";

import Login from "./Component/Login.jsx";
import Registeration from "./Component/Registeration.jsx";
import Header from "./Component/User/Header.jsx";
import DeshboardPanel from "./Component/User/DeshboardPanel.jsx";
import Contact from "./Component/Contact.jsx";
import Medicine from "./Component/Admin/Medicine.jsx";
import Dashboard from "./Component/DeshboardsMedicine/Dashboard.jsx";
import AdminDashboard from "./Component/Admin/AdminDeshboard.jsx";
import AdminLogin from "./Component/Admin/AdminLogin.jsx";

import CartItem from "./Component/User/CartItem.jsx";
import Carts from "./Component/User/Carts.jsx";
import MedicineDisplay from "./Component/User/MedicineDisplay.jsx";
import Customerdetails from "./Component/User/Customerdetails.jsx";

function App() {
  return (
    <CartProvider>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/header" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/registeration" element={<Registeration />} />

        {/* USER */}
        <Route path="/header" element={<Header />} />
        <Route path="/deshboardpanel" element={<DeshboardPanel />} />
        <Route path="/dashboards" element={<Dashboard />} />
        <Route path="/medicinedisplay" element={<MedicineDisplay />} />
        <Route path="/cartitems" element={<CartItem />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/customerdetails" element={<Customerdetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* ADMIN */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/deshboardpanel/medicines" element={<Medicine />} />

      </Routes>
    </CartProvider>
  );
}

export default App;
