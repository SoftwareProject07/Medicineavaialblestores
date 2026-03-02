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
import { useAuth } from "./Component/User/AuthContext";
 import CartItem from "./Component/User/CartItem.jsx";
import Carts from "./Component/User/Carts.jsx";
import MedicineDisplay from "./Component/User/MedicineDisplay.jsx";
import Customerdetails from "./Component/User/Customerdetails.jsx";
import DeliveryAddress from "./Component/User/DeliveryAddress.jsx";
import MedicineList from "./Component/User/MedicineList.jsx";
import CustomerList from "./Component/Admin/CustomerList.jsx";
import CustomerProfile from "./Component/User/CustomerProfile.jsx";
import PRINTER_VOUCHER from "./Component/User/PRINTER_VOUCHER.jsx";
import CompletePayment from "./Component/User/CompletePayment.jsx";
import ABOUTUS from "./Component/User/ABOUTUS.jsx";
import ViewExample_Header from "./Component/User/ViewExample_Header.jsx";
import Orderstatus from "./Component/User/Orders.jsx";




function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {
  const { loading } = useAuth();
if (loading) {
    return <div>Loading...</div>;
  }

//   const PrivateRoute = ({ children }) => {
//   const auth = localStorage.getItem("user") || localStorage.getItem("token");
//   // Agar auth nahi hai toh orders page ki jagah home ya login par bhej dega
//   return auth ? children : <Navigate to="/" replace />;
// };

  return (
    <CartProvider >
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
        <Route path="/deliveryaddress" element={<DeliveryAddress />} />
        <Route path="/medicinelist" element={<MedicineList />} /> 
 <Route path="/customerlists" element={<CustomerList />} />
 <Route path="/CompletePayments" element={<CompletePayment/>} />
 
<Route
        path="/profile"
        element={
          <PrivateRoute>
            <CustomerProfile />
          </PrivateRoute>
        }
      />
    <Route path="/printervouchers" element={<PRINTER_VOUCHER />} />
    <Route path="/medicinedata" element={<Medicine />} />
    <Route path="/viewexampleheader" element={<ViewExample_Header />} />
    {/* <Route path="/adminheaders" element={<AdminHeader />} />  */}
    <Route path="/abouts" element={<ABOUTUS />} />
    <Route path="/orders" element={<Orderstatus />} />



        </Routes>

    </CartProvider>
  );
}

export default App;
