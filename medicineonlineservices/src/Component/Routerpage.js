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

import CartItem from './User/CartItem.jsx';
import MedicineDisplay from './User/MedicineDisplay.jsx';
import Customerdetails from './User/Customerdetails.jsx';
import DeliveryAddress from './User/DeliveryAddress.jsx';
import MedicineList from './User/MedicineList.jsx';
import CustomerList from './Admin/CustomerList.jsx';
import CustomerProfile from './User/CustomerProfile.jsx';
import PRINTER_VOUCHER from './User/PRINTER_VOUCHER.jsx';
import CompletePayment from './User/CompletePayment.jsx';
import ABOUTUS from './User/ABOUTUS.jsx';
import ViewExample_Header from './User/ViewExample_Header.jsx';
import Orderstatus from './User/Orderstatus.jsx';
import AdminRegisteration from './Admin/AdminRegisteration.jsx';
import AdminLoginList from './Admin/AdminLoginList.jsx';
import FeedbackCustomer from './User/FeedbackCusotmer.jsx';
import AdminFeedbackcustomerlist from './Admin/AdminFeedbackcustomerlist.jsx';
import CustomerAddMedicine from './User/CustomerAddMedicine.jsx';
import AdminUnavailableMedicinecustomer from './Admin/AdminUnavailableMedicinecustomer.jsx';
import CustomerHelpIssue from './User/CustomerHelpIssue.jsx';
import AdminCustomerHelpIssueList from './Admin/AdminCustomerHelpIssueList.jsx';

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
        <Route path="/customerdetails" element={<Customerdetails />} /> 
{/* <Route Path="/cartcontexts" element={<CartContext/>}/> */}
<Route Path="/medicinedisplay" element={<MedicineDisplay />}/>
<Route path="/deliveryaddress" element={<DeliveryAddress />}/>
<Route path="/medicinelist" element={<MedicineList />} />
<Route path="/customerlists" element={<CustomerList />} />
<Route path="/CompletePayments" element={<CompletePayment/>} />
<Route path="/medicinedata" element={<Medicine />} />
<Route path="/orders" element={<Orderstatus />} />
<Route path="/feedbackcustomers" element={<FeedbackCustomer />} />

<Route
        path="/profile"
        element={
          <PrivateRoute>
            <CustomerProfile />
          </PrivateRoute>
        }
      />
    </Routes>
    <Route path="/viewexampleheader" element={<ViewExample_Header />} />
    <Route path="/abouts" element={<ABOUTUS />} />

<Route path="/printervouchers" element={<PRINTER_VOUCHER />} />
<Route path="/adminregisterationform" element={<AdminRegisteration />} />
<Route path="/adminFeedbackcustomerlists" element={<AdminFeedbackcustomerlist />} />
<Route path="/adminloginlists" element={<AdminLoginList/>} /> 
<Route path="/customeraddmedicines" element={<CustomerAddMedicine />} />
<Route path="/adminUnavailableMedicines" element={<AdminUnavailableMedicinecustomer />} />
<Route path="/customerhelpissues" element={<CustomerHelpIssue />} />
<Route path="/admincustomerhelpissuelist" element={<AdminCustomerHelpIssueList />} />
    </BrowserRouter>
  );
}
