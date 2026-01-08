import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Component/Login.jsx";
import Registeration from "./Component/Registeration.jsx";
import Header from './User/Header.jsx';
import DeshboardPanel from './User/DeshboardPanel.jsx';
import Contact from './Contact.jsx';
import Medicine from "./Admin/Medicine.jsx";
import Dashboard from './DeshboardsMedicine/Dashboard.jsx';
import AdminDashboard from './Admin/AdminDeshboard.jsx';
import Carts from './User/Carts.jsx';
import AdminLogin from './Admin/AdminLogin.jsx';
// import AdminRegisteration from './Admin/AdminRegisteration.jsx';
import CustomerDetails from './User/Customerdetails.jsx';
import CartItem from './User/CartItem.jsx';
import MedicineDisplay from './User/MedicineDisplay.jsx';
import LoginForgetPassword from './User/LoginForgetPassword.jsx';
//import UpdateMedicine from "./Component/Admin/UpdateMedicine.jsx";

//import Deskboard from './User/Deskboard.jsx';


// User Components
// import Login from "./Component/Login";
//   import Registeration from "./Component/Registeration";
// import Profile from './User/Profile';
// import Orders from './User/Orders';
// import MedicineDisplay from './User/MedicineDisplay';
// import Carts from './User/Carts';
// import Deskboard from './User/Deskboard';

// Admin Components
// import AdminDeskboard from './Admin/AdminDeskboard';
// import AdminHeader from './Admin/AdminHeader';
// import AdminOrder from './Admin/AdminOrder';
// import CustomerList from './Admin/CustomerList';
// import Medicine from './Admin/Medicine';

export default function Routerpage() {
  return (
    <BrowserRouter>
      <Routes>

        {/* User Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registeration" element={<Registeration />} /> 
        <Route Path="/header" element={<Header/>}/>
        <Route Path="/deshboardpanel" element={<DeshboardPanel />}/>
        <Route Path="/contact" element={<Contact />}/>
        <Route Path="/deshboardpanel/medicines" element={<Medicine />} />
        <Route Path="/dashboards" element={<Dashboard />} />
        <Route Path="/admindashboard" element={<AdminDashboard  />} />
        <Route path="/cartitems" element={<CartItem />} />
             <Route path="/carts" element={<Carts />}/>
             <Route Path="/adminlogin" element={<AdminLogin />} />
             {/* <Route Path="/adminregisteration" element={<AdminRegisteration />} /> */}
        <Route Pathath="/customerdetails" element={<CustomerDetails />} /> 
{/* <Route Path="/cartcontexts" element={<CartContext/>}/> */}
<Route Path="/medicinedisplay" element={<MedicineDisplay />}/>
             {/* <Route Path="/cart.controllers" element={<Cart./> }/> */}
<Route path="/loginforgetpassword"  element ={<LoginForgetPassword />}/>
    {/* <Route path="/Deskboard" element={<Deskboard />} /> */}
        {/* <Route path="/Orders" element={<Orders />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/MedicineDisplay" element={<MedicineDisplay />} />
        <Route path="/Carts" element={<Carts />} /> */}

        {/* Admin Routes */}
        {/* <Route path="/AdminDeskboard" element={<AdminDeskboard />} />
        <Route path="/AdminHeader" element={<AdminHeader />} />
        <Route path="/AdminOrder" element={<AdminOrder />} />
        <Route path="/CustomerList" element={<CustomerList />} />
        <Route path="/Medicine" element={<Medicine />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
