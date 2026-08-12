import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Package, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "./CartContext";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart ? useCart() : { cartItems: [] };

  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = { firstName: "Gautam", lastName: "Dev" };
  const isActive = (path) => location.pathname === path;
  const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://ecommerencesite.onrender.com/api/TrackingAPI/get-all-orders"
      );
      
      console.log("API Full Response:", response.data);

      let ordersData = [];
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      }

      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders list:", err);
      setError("Failed to load orders list.");
      setLoading(false);
    }
  };

  const handleOrderClick = async (order) => {
    const orderIdVal = order.id || order.Id || order.orderId || order.OrderId;
    let itemsList = order.orderItems || order.OrderItems || order.items || [];

    if (!itemsList || itemsList.length === 0) {
      try {
        const itemRes = await axios.get(
          `https://ecommerencesite.onrender.com/api/TrackingAPI/Allorderitem/${orderIdVal}`
        );
        itemsList = Array.isArray(itemRes.data) ? itemRes.data : (itemRes.data?.data || []);
      } catch (err) {
        console.error(`Failed to fetch items for order ID ${orderIdVal}:`, err);
      }
    }

    navigate("/orderstatus", { 
      state: { 
        orderId: orderIdVal, 
        selectedAddress: order.address || order.Address,
        orderItems: itemsList,
        orderTotal: order.ordertotal ?? order.OrderTotal ?? order.totalAmount ?? 0,
        paymentMode: order.paymentMode || order.PaymentMode
      } 
    });
  };

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%" }}>
      
      <style>{`
        .modern-sidebar {
          width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7;
          display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px;
          position: fixed; left: 0; top: 0; z-index: 100; box-sizing: border-box;
        }
        .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; margin-bottom: 20px; text-decoration: none; }
        .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
        .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; overflow-y: auto; }
        .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; color: #2d3748; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
        .modern-nav-item:hover { background-color: #e8f7f0; color: #0fa462; }
        .modern-nav-item.active { background-color: #0fa462; color: #ffffff; }
        .modern-link-content { display: flex; align-items: center; gap: 14px; }
        .modern-link-content i { font-size: 1.15rem; width: 20px; text-align: center; }
        .modern-dropdown-toggle { border: 1px solid #edf2f7; background-color: #fafafa; }
        .modern-submenu { list-style: none; padding: 4px 0 4px 34px; display: flex; flex-direction: column; gap: 4px; }
        .modern-submenu a { color: #718096; text-decoration: none; font-size: 0.9rem; padding: 8px 12px; border-radius: 6px; display: block; font-weight: 500; }
        .modern-submenu a:hover { background-color: #f7fafc; color: #0fa462; }
        .modern-sidebar-footer { margin-top: auto; border-top: 1px solid #edf2f7; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }
        .modern-avatar { width: 40px; height: 40px; background-color: #e8f7f0; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
        .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #2d3748; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .modern-user-role { font-size: 0.75rem; color: #718096; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #e53e3e; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 10px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fff5f5; }
        .modern-main-layout { margin-left: 280px; width: calc(100% - 280px); padding: 24px; box-sizing: border-box; background-color: #121212; min-height: 100vh; }
        
        .flipkart-order-card {
          background-color: #1e1e1e;
          border: 1px solid #2d2d2d;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .flipkart-order-card:hover {
          border-color: #0fa462;
          background-color: #252525;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
            <li>
              <button className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`} onClick={() => setOpenDashboard(!openDashboard)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openDashboard && (
                <ul className="modern-submenu">
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
              <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li><Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
            <li>
              <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
                <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
                {cartItems.length > 0 && <span className="badge bg-danger rounded-pill">{cartItems.length}</span>}
              </Link>
            </li>
            <li><Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
            <li><Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-comment-dots"></i><span>Customer Feedback</span></div></Link></li>
            <li><Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-circle-exclamation"></i><span>Unavailable Medicines</span></div></Link></li>
            <li><Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">{getInitial()}</div>
            <div className="modern-user-info">
              <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>
          <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="modern-main-layout">
        <div className="container py-4" style={{ maxWidth: "850px", margin: "0 auto" }}>
          
          <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between bg-dark rounded-3 mb-4 shadow-sm">
            <div className="d-flex align-items-center">
              <ChevronLeft className="me-3 text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
              <h5 className="mb-0 fw-bold">My Orders</h5>
            </div>
            {!loading && !error && (
              <div className="badge bg-info text-dark px-3 py-2 fw-bold d-flex align-items-center gap-1">
                <ShoppingBag size={14} /> Total Orders: {orders.length}
              </div>
            )}
          </div>

          {loading && <div className="text-center text-muted py-5">Loading orders...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center bg-black bg-opacity-40 p-5 rounded-4 border border-secondary">
              <Package size={48} className="text-muted mb-3" />
              <h6 className="text-warning fw-bold">No orders found in database!</h6>
            </div>
          )}

          {/* Flipkart Style Order List View */}
          {!loading && orders.map((order, index) => {
            const itemsList = order.orderItems || order.OrderItems || order.items || [];
            const totalItems = itemsList.length;
            const firstItemImage = itemsList[0]?.productImage || itemsList[0]?.ProductImage || itemsList[0]?.imageUrl || itemsList[0]?.Image || "/AKMedizostore.png";
            const orderStatusText = order.orderStatus || order.OrderStatus || "Processing";
            const orderTotalAmt = order.ordertotal ?? order.OrderTotal ?? order.totalAmount ?? 0;
            const orderIdVal = order.id || order.Id || order.orderId || order.OrderId || index;

            return (
              <div 
                key={orderIdVal} 
                className="flipkart-order-card"
                onClick={() => handleOrderClick(order)}
              >
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: "60px", height: "60px", background: "#2a2a2a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <img 
                      src={firstItemImage} 
                      alt="Product" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      onError={(e) => { e.target.src = "/AKMedizostore.png"; }}
                    />
                  </div>

                  <div>
                    <div className="fw-bold text-success mb-1" style={{ fontSize: "1.05rem" }}>
                      {orderStatusText === "Delivered" ? `Delivered` : orderStatusText}
                    </div>
                    <div className="text-muted small">
                      AK Medistore Basket ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <span className="text-info fw-bold d-block">₹{orderTotalAmt}</span>
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>ID: #{orderIdVal}</span>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              </div>
            );
          })}

          <button className="btn btn-outline-secondary w-100 mt-3 rounded-pill py-2 fw-bold" onClick={() => navigate("/medicinedisplay")}>
            Back to Shop
          </button>
        </div>
      </div>

    </div>
  );
}