import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/DeliveryAddresss.css";
import { useCart } from "../User/CartContext";

/* ================= API BASE ================= */
const API =
  "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI";

export default function DeliveryAddress() {
  /* ================= STATE ================= */
  const [openDashboard, setOpenDashboard] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { cartItems } = useCart();
 /* ---------- LOAD USER ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ================= CART COUNT ================= */
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];

      const normalized = raw.map((item) => ({
        Patient_CustomerId: item.patient_CustomerId,
        FullName: item.fullName,
        PhoneNumber: item.phoneNumber,
        Address: item.address,
        CustomerCity: item.customerCity,
        CustomerState: item.customerState,
        CustomerZipCode: item.customerZipCode
      }));

      setAddresses(normalized);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= ADD ADDRESS POPUP ================= */
  const openAddPatientPopup = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Delivery Address",
      width: 750,
      html: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <input id="fullName" class="swal2-input" placeholder="Full Name">
          <input id="phoneNumber" class="swal2-input" placeholder="Mobile Number">
          <input id="address" class="swal2-input" placeholder="Address">
          <input id="customerCity" class="swal2-input" placeholder="City">
          <input id="customerState" class="swal2-input" placeholder="State">
          <input id="customerZipCode" class="swal2-input" placeholder="Zip Code">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "SAVE ADDRESS",
      preConfirm: () => {
        const fullName = document.getElementById("fullName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const address = document.getElementById("address").value;
        const customerCity = document.getElementById("customerCity").value;
        const customerState = document.getElementById("customerState").value;
        const customerZipCode =
          document.getElementById("customerZipCode").value;

        if (
          !fullName ||
          !phoneNumber ||
          !address ||
          !customerCity ||
          !customerState ||
          !customerZipCode
        ) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return {
          fullName,
          phoneNumber,
          address,
          customerCity,
          customerState,
          customerZipCode
        };
      }
    });

    if (!formValues) return;

    try {
      await axios.post(`${API}/AddPatient_Customer`, formValues);
      Swal.fire("Success", "Address Added Successfully", "success");
      fetchAddresses();
    } catch (error) {
      Swal.fire("Error", "Failed to Add Address", "error");
    }
  };

  if (loading) return <p>Loading...</p>;
 /* ================= LOGIN PERSON MOBILE (FIX) ================= */
  const loginMobile =
    addresses.length > 0 ? addresses[0].PhoneNumber : "";
  return (
    
    <div className="app-container">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
             <div className="brand">
               <Link to="/dashboards">
                 <img src="/AKMedizostore.png" alt="logo" width="55" />
               </Link>
               <span>
                 {user ? `${user.firstName} ${user.lastName}` : "User"}
               </span>
             </div>
     
             <ul>
               <li className="menu-group">
                 <button
                   className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
                   onClick={() => setOpenDashboard(!openDashboard)}
                 >
                   Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
                 </button>
     
                 {openDashboard && (
                   <ul className="submenu">
                     <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                     <li><Link to="/test-reports">Test Reports</Link></li>
                     <li><Link to="/health-history">Health History</Link></li>
                     <li><Link to="/monthly-progress">Monthly Progress</Link></li>
                     <li><Link to="/prescriptions">Prescriptions</Link></li>
                     <li><Link to="/history">History</Link></li>
                     <li><Link to="/support">Help & Support</Link></li>
                     <li><Link to="/settings">Settings</Link></li>
                   </ul>
                 )}
               </li>
     
               <li>
                 <Link to="/medicinedisplay" className="btn btn-success mb-2">
                   Medicines
                 </Link>
               </li>
     
               {/* ✅ CART WITH COUNT */}
               <li>
                 <Link
                   to="/carts"
                   className="btn btn-success mb-2 d-flex justify-content-between align-items-center"
                 >
                   <span>Medicine Cart</span>
                   {totalQuantity > 0 && (
                     <span
                       style={{
                         background: "red",
                         color: "#fff",
                         borderRadius: "50%",
                         padding: "2px 8px",
                         fontSize: "12px"
                       }}
                     >
                       {totalQuantity}
                     </span>
                   )}
                 </Link>
               </li>
               {/* deliveryaddress */}
              {/* <li>Delivery Address</li> */}
                <li>
                 <Link to="/deliveryaddress" className="btn btn-success mb-2">
                   Delivery Address
                 </Link>
               </li>
               <li>OrdersPayment</li>
               <li>CustomerTracking</li>
               <li>OrderStatus</li>
               <li>Customer Profile</li>
     
               <li>
                 <Link to="/header">
                   <i className="fas fa-sign-out-alt"></i> LogOut
                 </Link>
               </li>
             </ul>
           </div>
      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
         <h2>
          Login Person, {user?.firstName} {user?.lastName},  &nbsp; &nbsp;
          Mobile Number : {loginMobile}
        </h2>
        <br></br>
        <hr></hr>
        <h2>DELIVERY ADDRESS</h2>

        {addresses.map((addr) => (
          <div key={addr.Patient_CustomerId} className="address-card">
            <div className="address-header">
              <span className="name">{addr.FullName}</span>
              <span className="phone">{addr.PhoneNumber}</span>
            </div>
            <div className="address-body">
              {addr.Address}, {addr.CustomerCity},{" "}
              {addr.CustomerState} -{" "}
              <b>{addr.CustomerZipCode}</b>
            </div>
          </div>
        ))}

        {/* ================= PROCESS TO CHECKOUT ================= */}
        <button
          className="checkout-btn"
          onClick={openAddPatientPopup}
        >
          PROCESS TO CHECKOUT
        </button>
      </div>
    </div>
  );
}
