import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";
import "../styles/dashboardsprofiles.css";

export default function MedicineDisplay() {
  const { addToCart, cartItems = [] } = useCart();
  const navigate = useNavigate();
  const[openMasterUpdate, setOpenMasterUpdate] = useState(false);

  const [user, setUser] = useState(null);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDashboard, setOpenDashboard] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchMedicines();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct"
      );

      let rawData = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && response.data.lsTmedicines) {
        rawData = response.data.lsTmedicines;
      }

      // --- LOGIC TO REMOVE DUPLICATES BY NAME ---
      const uniqueMedsMap = new Map();

      rawData.forEach((item) => {
        // We trim spaces and lowercase the name to catch "Paracetamol" vs "paracetamol "
        const normalizedName = item.name.trim().toLowerCase();

        // If the name isn't in our Map yet, add the whole object
        if (!uniqueMedsMap.has(normalizedName)) {
          uniqueMedsMap.set(normalizedName, item);
        }
      });

      // Convert the Map values back into a clean array for the state
      setMeds(Array.from(uniqueMedsMap.values()));

    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyNow = (med) => {
    addToCart(med);
    navigate("/carts");
  };

  return (
    <div className="app-container d-flex">
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
    {/* MASTER UPDATE DROPDOWN */}
      <li className="menu-group">
        <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
          <div className="btn-content">
            <i className="fas fa-edit"></i> Master Update
          </div>
          <span>{openMasterUpdate ? "▾" : "▸"}</span>
        </button>
        {openMasterUpdate && (
          <ul className="submenu">
            <li>
              <Link to="/deliveryaddress">
                <i className="fas fa-map-marker-alt"></i> Delivery Address
              </Link>
            </li>
                <li>
                        <Link to="/CompletePayments" className="sidebar-btn active-btn">
                          <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
                        </Link>
                      </li>
                             <li>
                              <Link to="/">
                                <i className="fas fa-map-marker-alt"></i> Refund Order Amount
                              </Link>
                            </li>
          </ul>
        )}
      </li>
            <li>
              <Link to="/medicinedisplay" className="btn btn-success mb-2">
                Medicines
              </Link>
            </li>

            {/* ✅ CART WITH COUNT */}
             <Link to="/carts" className="nav-link">
                       <i className="fas fa-shopping-cart me-2"></i> My Cart
                       {cartItems.length > 0 && (
                         <span className="cart-count badge bg-danger rounded-pill ms-2">
                           {cartItems.length}
                         </span>
                       )}
                     </Link>
{/* 
             <li>
              <Link to="/deliveryaddress" className="btn btn-success mb-2">
                Delivery Address
              </Link>
            </li> */}
           
            {/* <li><Link to="/CompletePayments" className="btn btn-success mb-2">
               ORDER PAYMENT
              </Link></li> */}
             <li ><Link to="/orders" className="btn btn-success mb-2">OrderStatus </Link></li>

            {/* <li>CustomerTracking</li> */}

            <Link to="/profile"  className="btn btn-success">CustomerProfile</Link>


            <li>
              <Link to="/header">
                <i className="fas fa-sign-out-alt"></i>  LogOut
              </Link>
            </li>
          </ul>
        </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="main-content">
        <header className="content-header">
          <h2>Available Medicines</h2>
          <span className="badge-found">{meds.length} Unique Products Found</span>
        </header>
        <hr />

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading medicines...</p>
          </div>
        ) : (
          <div className="medicine-grid-container">
            {meds.length > 0 ? (
              meds.map((med) => (
                <div className="med-card-modern" key={med.id || med.name}>
                  <div className="med-card-top">
                    {med.discount > 0 && <span className="discount-pill">{med.discount}% OFF</span>}
                    <h4 className="card-brand-name">{med.name}</h4>
                  </div>

                  <div className="med-card-bottom">
                    <h3 className="med-title">{med.name}</h3>
                    <p className="med-mfg">Mfg: {med.manufacturer || "Generic"}</p>
                    <div className="price-row">
                      <span className="med-price">₹{med.unitPrice}</span>
                      <span className="med-stock">Stock: {med.quantity}</span>
                    </div>

                    <div className="card-buttons d-flex flex-column gap-2">
                      <button
                        className="btn-outline"
                        onClick={() => med.quantity > 0 ? addToCart(med) : alert("Out of stock")}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn-solid"
                        disabled={med.quantity <= 0}
                        onClick={() => buyNow(med)}
                      >
                        {med.quantity > 0 ? "Buy Now" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No medicines found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}