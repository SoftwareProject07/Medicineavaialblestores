import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/DeliveryAddresss.css";
import { useCart } from "../User/CartContext";

/* ================= API ================= */
const API =
  "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI";

export default function DeliveryAddress() {
  /* ================= STATES ================= */
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [user, setUser] = useState(null);

  const { cartItems } = useCart();

  /* ================= USER (STATIC / LOCAL STORAGE) ================= */
  // const user = {
  //   firstName: "User",
  //   lastName: ""
  // };

  /* ================= CART COUNT ================= */
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
   useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ================= ADD FORM STATE ================= */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    age: "",
    address: "",
    customerCity: "",
    customerState: "",
    customerZipCode: ""
  });

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= ADD ADDRESS ================= */
  const handleSaveAddress = async () => {
    try {
      await axios.post(`${API}/AddPatient_Customer`, formData);
      alert("Customer Address Added ✅");
      setShowPopup(false);
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        age: "",
        address: "",
        customerCity: "",
        customerState: "",
        customerZipCode: ""
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert("Customer Address Failed ❌");
    }
  };
/* ================= LOGIN PERSON MOBILE (FIX) ================= */
  const loginMobile =
    addresses.length > 0 ? addresses[0].PhoneNumber : "";
  /* ================= EDIT ================= */
  const handleEdit = (addr, index) => {
    setEditIndex(index);
    setEditData({ ...addr });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/UpdatePatient_Customer`, {
        patient_CustomerId: editData.Patient_CustomerId,
        fullName: editData.FullName,
        phoneNumber: editData.PhoneNumber,
        address: editData.Address,
        customerCity: editData.CustomerCity,
        customerState: editData.CustomerState,
        customerZipCode: editData.CustomerZipCode
      });

      alert("Updated ✅");
      setEditIndex(null);
      fetchAddresses();
    } catch {
      alert("Update Failed ❌");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete address?")) return;
    await axios.delete(`${API}/DeletePatient/${id}`);
    fetchAddresses();
  };

  /* ================= DELIVER ================= */
  const handleDeliverHere = (addr) => {
    alert(`Delivering to: ${addr.FullName}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
     <div className="app-container">
         {/* ---------- SIDEBAR ---------- */}
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




      {/* ---------- MAIN ---------- */}
      <div className="main-content">

         {/* <h2>
  Login Person, {user?.firstName} {user?.lastName}, &nbsp;&nbsp;
   Mobile Number : {loginMobile}</h2>
<hr></hr> */}
 <h2>
           Login  Person : {user ? `${user.firstName} ${user.lastName}` : "User"} ✅ &nbsp;&nbsp;
               Mobile Number : {loginMobile}

             </h2>
             
             <hr></hr>
        <h2>DELIVERY ADDRESS</h2>

        {addresses.map((addr, index) => (
          <div
            key={addr.Patient_CustomerId}
            className={`address-card ${
              selectedIndex === index ? "active" : ""
            }`}
          >
            {editIndex !== index ? (
              <>
                <div className="address-header">
                  <input
                    type="radio"
                    checked={selectedIndex === index}
                    onChange={() => setSelectedIndex(index)}
                  />
                  <span className="name">{addr.FullName}</span>
                  <span className="phone">{addr.PhoneNumber}</span>
                  <span className="edit" onClick={() => handleEdit(addr, index)}>
                    EDIT
                  </span>
                  <span
                    className="delete"
                    onClick={() => handleDelete(addr.Patient_CustomerId)}
                  >
                    DELETE
                  </span>
                </div>

                <div className="address-body">
                  {addr.Address}, {addr.CustomerCity},{" "}
                  {addr.CustomerState} - <b>{addr.CustomerZipCode}</b>
                </div>

                {selectedIndex === index && (
                  <button
                    className="deliver-btn"
                    onClick={() => handleDeliverHere(addr)}
                  >
                    DELIVER HERE
                  </button>
                )}
              </>
            ) : (
              <div className="edit-form">
                <input
                  value={editData.FullName}
                  placeholder="FullName"

                  required autoComplete="off"
                  onChange={(e) =>
                    setEditData({ ...editData, FullName: e.target.value })
                  }
                />
                <input
                  value={editData.PhoneNumber}
                                    placeholder="PhoneNumber"
                  required autoComplete="off"
maxLength={10}
                  onChange={(e) =>
                    setEditData({ ...editData, PhoneNumber: e.target.value })
                  }
                />
                <input
                  value={editData.Address}
                  placeholder="Address"
                  required autoComplete="off"

                  onChange={(e) =>
                    setEditData({ ...editData, Address: e.target.value })
                  }
                />
                <input
                  value={editData.CustomerCity}
                                    placeholder="CustomerCity"
                  required autoComplete="off"

                  onChange={(e) =>
                    setEditData({ ...editData, CustomerCity: e.target.value })
                  }
                />
                <input
                  value={editData.CustomerState}
                                                      placeholder="CustomerState"
                  required autoComplete="off"

                  onChange={(e) =>
                    setEditData({ ...editData, CustomerState: e.target.value })
                  }
                />
                <input
                  value={editData.CustomerZipCode}
                                                                        placeholder="Pincode"
                  required autoComplete="off"

                  onChange={(e) =>
                    setEditData({ ...editData, CustomerZipCode: e.target.value })
                  }
                />

                <button onClick={handleUpdate}>UPDATE</button>
                <button onClick={() => setEditIndex(null)}>CANCEL</button>
              </div>
            )}
          </div>
        ))}

        {/* <button
          className="btn btn-primary mt-3"
          onClick={() => setShowPopup(true)}
        >
          + ADD NEW ADDRESS
        </button> */}

        <button
  className="btn btn-primary mt-3"
  onClick={() => setShowPopup(true)}
>
  + ADD NEW ADDRESS
</button>


        {/* ---------- POPUP ---------- */}
        {showPopup && (
          <div className="popup">
            <div className="popup-box">
              <h3>Customer  Address</h3>

              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  placeholder={key}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              ))}

              <button onClick={handleSaveAddress}>SAVE</button>
              <button onClick={() => setShowPopup(false)}>CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}