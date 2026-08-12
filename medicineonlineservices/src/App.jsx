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
import Orderstatus from "./Component/User/Orderstatus.jsx";
import AdminRegisteration from "./Component/Admin/AdminRegisteration.jsx";
import AdminLoginList from "./Component/Admin/AdminLoginList.jsx";
import FeedbackCustomer from "./Component/User/FeedbackCusotmer.jsx";
import AdminFeedbackcustomerlist from "./Component/Admin/AdminFeedbackcustomerlist.jsx";
import CustomerAddMedicine from "./Component/User/CustomerAddMedicine.jsx";
import AdminUnavailableMedicinecustomer from "./Component/Admin/AdminUnavailableMedicinecustomer.jsx";
import CustomerHelpIssue from "./Component/User/CustomerHelpIssue.jsx";
import AdminCustomerHelpIssueList from "./Component/Admin/AdminCustomerHelpIssueList.jsx";
import AdminBankSelectDetails from "./Component/Admin/AdminBankSelectDetails.jsx";
import Admincreditdetail from "./Component/Admin/Admincreditdetail.jsx";
import LivenessFaceWelcome from "./Component/LIvenssfacematchproject/LivenessFaceWelcome.jsx";
import LivenessFaceCapture from "./Component/LIvenssfacematchproject/LivenessFaceCapture.jsx";
import AdminLivenessimageList from "./Component/Admin/AdminLivenessimageList.jsx";
// import AdminSupportTicketList from "./Component/Admin/adminSupportTicketList.jsx";
import CustomerticketRaise from "./Component/User/CustomerticketRaise.jsx";
import MedicineChartAI from "./Component/User/MedicineChartAI.jsx";
import AdminCustomerticktRaiseList from "./Component/Admin/AdminCustomerticktRaiseList.jsx";
import AddIssueType from "./Component/Admin/MASTER/AddIssueType.jsx";
import AddMasterAssignedTo from "./Component/Admin/MASTER/AddMasterAssignedTo.jsx";
import AddBankRefundableAmount from "./Component/User/AddBankRefundableAmount.jsx";
import CustomerBankDetailsRefundList from "./Component/Admin/customer_bankdetailsrefundList.jsx";
import DeliveryAddressLIst from "./Component/Admin/DeliveryAddressLIst.jsx";
import BankRefundabledetailsList from "./Component/User/BankRefundabledetailsList.jsx";
import AdminLiveTracker from "./Component/Admin/AdminLiveTracker.jsx";
import Orders from "./Component/User/Orders.jsx";
import DoctorAssignto from "./Component/Admin/MASTER/DoctorAssignto.jsx";
import Doctor_patientsDetailsList from "./Component/Admin/Doctor_patientsDetailsList.jsx";
import AddAdminType from "./Component/Admin/MASTER/AddAdminType.jsx";
import Hiring_candidateapplied from "./Component/Admin/Hiring_candidateapplied.jsx";
import DeliveryOrderPersonPanel from "./Component/Admin/DeliveryOrderPersonPanel.jsx";
import DoctorsPanel from "./Component/Admin/DoctorsPanel.jsx";
import LanguageMasterPanel from "./Component/Admin/MASTER/LanguageMasterPanel.jsx";
import StateNameMaster from "./Component/Admin/MASTER/StateNameMaster.jsx";
import CityNameMaster from "./Component/Admin/MASTER/CityNameMaster.jsx";


function PrivateRoute({ children }) {
 // const navigate = useNavigate();
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}


function App() {
  const { loading } = useAuth();
if (loading) {
    return <div>Loading...</div>;
  }



  return (
    <CartProvider >
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/header" />} />
            {/* <Route 
        path="/" 
        element={<Navigate to ="/livenessfacewelcome"  />} 
      /> */}
                <Route path="/login" element={<Login />} />

        <Route path="/registeration" element={<Registeration />} />

        {/* USER */}
        <Route path="/header" element={<Header />} />
        <Route path="/deshboardpanel" element={<DeshboardPanel />} />
        <Route path="/dashboards" element={<Dashboard />} />
        <Route path="/medicinedisplay" element={<MedicineDisplay />} />
        <Route path="/cartitems" element={<CartItem />} />
        {/* <Route path="/cartitems" element={<CartItem cart={Carts} setCart={setCart} />} /> */}
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
 {/* <Route path="/CompletePayments" element={<CompletePayment cartItems={Carts} />} /> */}
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
<Route path="/adminregisterationform" element={<AdminRegisteration />} />

<Route path="/adminloginlists" element={<AdminLoginList />} />
<Route path="/feedbackcustomers" element={<FeedbackCustomer />} />
<Route path="/adminFeedbackcustomerlists" element={<AdminFeedbackcustomerlist />} />
<Route path="/customeraddmedicines" element={<CustomerAddMedicine />} />
<Route path="/adminUnavailableMedicines" element={<AdminUnavailableMedicinecustomer />} /> 
<Route path="/customerhelpissues" element={<CustomerHelpIssue />} />
<Route path="/adminCustomerHelpIssueLists" element={<AdminCustomerHelpIssueList />} />
<Route path="/adminbankselectdetailss" element={<AdminBankSelectDetails />} />
<Route path="/admincreditdetails" element={<Admincreditdetail />} />  
<Route path="/livenessfacewelcome" element={<LivenessFaceWelcome  />} />
<Route path="/eyeblinkfacecapture" element={<LivenessFaceCapture />} />
<Route path="/adminLivenessimageLists" element={<AdminLivenessimageList />} />
<Route path="/customerticketraised" element={<CustomerticketRaise />} />  

{/* <Route path="/adminsupportticketlist" element={<AdminSupportTicketList />} /> */}
<Route path="/medicinechartai" element={<MedicineChartAI />} /> 
<Route path="/admincustomerticketraiselist" element={<AdminCustomerticktRaiseList />} />
<Route path="/addbankrefundableamounts" element={<AddBankRefundableAmount />} />
<Route path="/customer-bankdetailsrefund" element={<CustomerBankDetailsRefundList />} />
<Route path="/customerdeliveryaddresslist" element={<DeliveryAddressLIst  />} />
<Route path="/bankdetailsrefundlist" element={<BankRefundabledetailsList />} />
<Route path="/adminlivetracker" element={<AdminLiveTracker  />}  />
{/* /*Master page admin*/}

<Route path="/adminissuetype" element={<AddIssueType />} />  
<Route path="/order"  element={<Orders />}/>
{/* <Route path="/adminmasterassignedto" element={<AddMasterAssignedTo />} /> */}
<Route path="/adminmasterassignedto" element ={<AddMasterAssignedTo />} />  
<Route path="/doctorassignto" element={<DoctorAssignto />}/>
<Route path="/doctor_patientdetailslists" element={<Doctor_patientsDetailsList/>}/>
<Route path="/addadmintypes" element={<AddAdminType/>}/>
<Route path="/statenamemasters" element={<StateNameMaster/>}/>    
<Route path="/citynamemasters" element={<CityNameMaster/>}/>  

{/* hiring_candidateapplied */}
<Route path="/hiringcandidteapplieds" element={<Hiring_candidateapplied /> } />

{/* DeliveryOrderPersonPanel */}
<Route path="/deliveryorderpersonpanel" element={<DeliveryOrderPersonPanel />} />
{/* //DoctorPanels */}
<Route path="/doctorpanels" element={<DoctorsPanel />} />

<Route path="/languagematerpanels" element={<LanguageMasterPanel />} /> 
        </Routes>

    </CartProvider>
  );
}

export default App;
