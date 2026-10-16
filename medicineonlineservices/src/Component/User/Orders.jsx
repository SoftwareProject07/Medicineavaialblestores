// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Package, ChevronRight, Search, ArrowLeft, Phone, MapPin, User, XCircle } from "lucide-react";
// import { useCart } from "./CartContext";
// import axios from "axios";

// export default function Orders() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cartContext = useCart ? useCart() : null;
//   const cartItems = cartContext?.cartItems || [];

//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [ordersList, setOrdersList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("All");
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const user = { firstName: "Gautam", lastName: "Dev" };
//   const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   const API_BASE_URL = "https://ecommerencesite.onrender.com";

//   useEffect(() => {
//     // Agar location.state me cancellation aayi hai toh use localStorage me save karein
//     if (location.state && location.state.orderId) {
//       const stateStatus = String(location.state.orderStatus || "").toLowerCase();
//       const cleanId = String(location.state.orderId).replace("#", "").trim();
      
//       const savedOrdersCache = JSON.parse(localStorage.getItem("all_orders_cache") || "{}");
//       if (savedOrdersCache[cleanId]) {
//         savedOrdersCache[cleanId].orderStatus = stateStatus.includes("cancel") ? "Cancelled" : location.state.orderStatus;
//         if (stateStatus.includes("cancel")) {
//           savedOrdersCache[cleanId].rawStatus = "Cancelled";
//         }
//         localStorage.setItem("all_orders_cache", JSON.stringify(savedOrdersCache));
//       }

//       if (stateStatus.includes("cancel")) {
//         const cancelledOrders = JSON.parse(localStorage.getItem("cancelled_orders") || "[]");
//         if (!cancelledOrders.includes(cleanId)) {
//           cancelledOrders.push(cleanId);
//           localStorage.setItem("cancelled_orders", JSON.stringify(cancelledOrders));
//         }
//       }
//     }
//     fetchAllOrders();
//   }, [location.state]);

//   const isActive = (path) => location.pathname === path;

//   const getFallbackImage = (name) => {
//     const n = (name || "").toLowerCase();
//     if (n.includes("telmisartan")) return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150";
//     if (n.includes("amoxycillin") || n.includes("amoxicillin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("paracetamol")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("nise")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("atorvastatin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("amlodipine")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//   };

//   const getMedicineNameById = (medicineId, explicitName) => {
//     if (explicitName && explicitName.trim() !== "" && !explicitName.toLowerCase().includes("medicine")) {
//       return explicitName;
//     }
//     switch(Number(medicineId)) {
//       case 130: return "Telmisartan";
//       case 190: return "Amoxycillin + Clavulanic Acid";
//       case 132: return "Paracetamol";
//       case 191: return "Nise";
//       case 188: return "Atorvastatin";
//       case 187: return "Amlodipine";
//       default: return explicitName || `Prescription Medicine`;
//     }
//   };

//   const formatOrderData = (ord) => {
//     const rawItems = ord.orderItemss || ord.orderItems || ord.OrderItems || ord.items || ord.Items || [];
    
//     let mappedItems = rawItems.map((item, index) => {
//       const medId = item.medicineId || item.MedicineId || item.id || item.Id;
//       const rawName = item.name || item.Name || item.productName || item.ProductName || item.medicineName || item.MedicineName || "";
      
//       const itemName = getMedicineNameById(medId, rawName);
//       let itemImg = item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || ord.productImage || "";
//       if (!itemImg) itemImg = getFallbackImage(itemName);
      
//       const qty = item.quantity || item.Quantity || 1;
//       const priceVal = item.unitPrice || item.UnitPrice || item.price || item.Price || 12;
//       const totalPriceVal = item.totalprice || item.Totalprice || item.totalPrice || item.TotalPrice || (qty * priceVal);

//       return {
//         id: medId || index + 1,
//         name: itemName,
//         productImage: itemImg,
//         quantity: qty,
//         price: priceVal,
//         totalprice: totalPriceVal
//       };
//     });

//     const rawOrderId = String(ord.orderNumber || ord.id || ord.Id || "");
//     const cleanId = rawOrderId.replace("#", "").trim();

//     const cancelledOrders = JSON.parse(localStorage.getItem("cancelled_orders") || "[]");
//     const savedOrdersCache = JSON.parse(localStorage.getItem("all_orders_cache") || "{}");
//     const cachedOrder = savedOrdersCache[cleanId] || {};

//     const isLocallyCancelled = cancelledOrders.includes(cleanId) || cachedOrder.rawStatus === "Cancelled";

//     const rootMedicineName = ord.medicineName || ord.MedicineName || ord.productName || ord.ProductName || ord.name || ord.Name;
//     const primaryItem = mappedItems[0] || {};
    
//     let finalMedicineName = rootMedicineName || primaryItem.name;
//     if (!finalMedicineName || finalMedicineName.toLowerCase().includes("medicine")) {
//       if (mappedItems.length > 1) finalMedicineName = `${mappedItems[0].name} (+${mappedItems.length - 1} more)`;
//       else finalMedicineName = `Prescription Medicine #${cleanId}`;
//     }

//     if (mappedItems.length === 0 && cachedOrder.orderItems) {
//       mappedItems = cachedOrder.orderItems;
//     } else if (mappedItems.length === 0) {
//       mappedItems = [{
//         id: 1,
//         name: finalMedicineName,
//         productImage: getFallbackImage(finalMedicineName),
//         quantity: 1,
//         price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12,
//         totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12
//       }];
//     }

//     let rawStatus = cachedOrder.rawStatus || ord.orderStatus || ord.OrderStatus || "Pending";
    
//     if (isLocallyCancelled || rawStatus.toLowerCase() === "cancelled" || rawStatus.toLowerCase() === "order cancelled") {
//       rawStatus = "Cancelled";
//       if (!cancelledOrders.includes(cleanId)) {
//         cancelledOrders.push(cleanId);
//         localStorage.setItem("cancelled_orders", JSON.stringify(cancelledOrders));
//       }
//     }

//     let displayStatus = rawStatus;
//     if (rawStatus.toLowerCase() === "cancelled") {
//       displayStatus = "Order Cancelled";
//     } else if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
//       displayStatus = "Delivery expected in 3-5 days";
//     }

//     const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

//     const receiverName = ord.receiverName || ord.ReceiverName || ord.fullName || ord.FullName || ord.userName || "Gautam Dev";
//     const receiverPhone = ord.phoneNumber || ord.PhoneNumber || ord.phone || ord.Phone || ord.mobile || "";
//     const addressData = ord.address || ord.Address || { address: "JS ROOP HOMES", city: "Greater Noida", pincode: "845401" };
//     const orderDate = ord.orderDate || ord.OrderDate || new Date().toISOString();

//     const formattedOrderObj = {
//       id: `#${cleanId}`,
//       rawId: cleanId,
//       orderStatus: displayStatus,
//       rawStatus: rawStatus,
//       subStatus: "Recent Order",
//       medicineName: finalMedicineName,
//       category: "AKmedistore",
//       ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 12),
//       paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
//       address: addressData,
//       receiverName: receiverName,
//       receiverPhone: receiverPhone,
//       orderItems: mappedItems,
//       orderDate: orderDate
//     };

//     // Cache me save karein taaki data loss na ho
//     savedOrdersCache[cleanId] = formattedOrderObj;
//     localStorage.setItem("all_orders_cache", JSON.stringify(savedOrdersCache));

//     return formattedOrderObj;
//   };

//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder?t=${new Date().getTime()}`);
//       let data = [];
//       const resData = response.data;

//       if (Array.isArray(resData)) data = resData;
//       else if (resData && Array.isArray(resData.$values)) data = resData.$values;
//       else if (resData?.data && Array.isArray(resData.data)) data = resData.data;

//       let formatted = data.map(formatOrderData);

//       const uniqueOrdersMap = new Map();
//       formatted.forEach((order) => {
//         if (!uniqueOrdersMap.has(order.rawId) || order.rawStatus.toLowerCase() === "cancelled") {
//           uniqueOrdersMap.set(order.rawId, order);
//         }
//       });
//       let uniqueOrdersList = Array.from(uniqueOrdersMap.values());

//       setOrdersList(uniqueOrdersList);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       // Fallback to local cache if API fails
//       const savedOrdersCache = JSON.parse(localStorage.getItem("all_orders_cache") || "{}");
//       const cachedList = Object.values(savedOrdersCache);
//       if (cachedList.length > 0) {
//         setOrdersList(cachedList);
//       } else {
//         setError("Failed to load orders from server.");
//       }
//       setLoading(false);
//     }
//   };

//   const handleOrderClick = async (clickedOrder) => {
//     const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();
//     const savedOrdersCache = JSON.parse(localStorage.getItem("all_orders_cache") || "{}");
//     const cachedOrder = savedOrdersCache[cleanId] || clickedOrder;

//     let finalOrderItems = cachedOrder.orderItems || clickedOrder.orderItems;
//     let finalTotal = cachedOrder.ordertotal || clickedOrder.ordertotal;
//     let finalStatus = cachedOrder.rawStatus || clickedOrder.rawStatus;
//     let finalAddress = cachedOrder.address || clickedOrder.address;
//     let finalPayment = cachedOrder.paymentMode || clickedOrder.paymentMode;
//     let finalReceiverName = cachedOrder.receiverName || clickedOrder.receiverName;
//     let finalReceiverPhone = cachedOrder.receiverPhone || clickedOrder.receiverPhone;

//     const cancelledOrders = JSON.parse(localStorage.getItem("cancelled_orders") || "[]");
//     const isLocallyCancelled = cancelledOrders.includes(cleanId) || finalStatus.toLowerCase() === "cancelled";

//     if (isLocallyCancelled) {
//       finalStatus = "Cancelled";
//     }

//     navigate("/orderstatus", { 
//       state: { 
//         orderId: cleanId,
//         orderStatus: finalStatus,
//         orderTotal: finalTotal,
//         orderItems: finalOrderItems,
//         address: finalAddress,
//         paymentMode: finalPayment,
//         receiverName: finalReceiverName,
//         receiverPhone: finalReceiverPhone
//       } 
//     });
//   };

//   const cleanSearchQuery = searchQuery.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  
//   let filteredOrders = ordersList.filter(order => {
//     const cleanOrderId = String(order.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
//     const cleanRawId = String(order.rawId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
//     const status = (order.orderStatus || "").toLowerCase();
//     const medName = (order.medicineName || "").toLowerCase();
//     const itemsMatch = order.orderItems.some(item => item.name.toLowerCase().includes(cleanSearchQuery));

//     const matchesSearch = cleanSearchQuery === "" ||
//                           cleanOrderId.includes(cleanSearchQuery) || 
//                           cleanRawId.includes(cleanSearchQuery) || 
//                           status.includes(cleanSearchQuery) || 
//                           medName.includes(cleanSearchQuery) ||
//                           itemsMatch;
    
//     if (activeTab === "All") return matchesSearch;
//     return matchesSearch && order.rawStatus.toLowerCase() === activeTab.toLowerCase();
//   });

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, activeTab]);

//   return (
//     <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%" }}>
//       <style>{`
//         .modern-sidebar { width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px; position: fixed; left: 0; top: 0; z-index: 100; box-sizing: border-box; }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; margin-bottom: 20px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; overflow-y: auto; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; color: #2d3748; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #e8f7f0; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; }
//         .modern-link-content { display: flex; align-items: center; gap: 14px; }
//         .modern-submenu { list-style: none; padding-left: 32px; margin: 6px 0 0 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-submenu a { color: #4a5568; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
//         .modern-submenu a:hover { color: #0fa462; }
//         .modern-sidebar-footer { margin-top: auto; border-top: 1px solid #edf2f7; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }
//         .modern-avatar { width: 40px; height: 40px; background-color: #e8f7f0; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #2d3748; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.75rem; color: #718096; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #e53e3e; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 10px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fff5f5; }
//         .modern-main-layout { margin-left: 280px; width: calc(100% - 280px); padding: 24px; box-sizing: border-box; background-color: #121212; min-height: 100vh; overflow-y: auto; }
//         .order-card-item { background-color: #1e1e1e; border: 1px solid #2d2d2d; border-radius: 14px; padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease-in-out; width: 100%; }
//         .order-card-item:hover { background-color: #252525; border-color: #0fa462; transform: translateY(-1px); }
//         .filter-chip { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
//         .filter-chip.active { background: #0fa462; color: #fff; border-color: #0fa462; }
//         .page-btn { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
//         .page-btn:hover:not(:disabled) { background: #0fa462; border-color: #0fa462; }
//         .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//       `}</style>

//       {/* SIDEBAR */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>
    
//           <ul className="modern-nav-menu">
//             <li>
//               <button
//                 className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//             </li>
//             <li>
//               <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>
//             </li>
//             <li>
//               <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-shopping-cart"></i>
//                   <span>My Cart</span>
//                 </div>
//                 {cartItems.length > 0 && (
//                   <span className="badge bg-danger rounded-pill">{cartItems.length}</span>
//                 )}
//               </Link>
//             </li>
//             <li>
//               <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-truck"></i>
//                   <span>Orders</span>
//                 </div>
//               </Link>
//             </li>
//             <li>
//               <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-user"></i>
//                   <span>Customer Profile</span>
//                 </div>
//               </Link>
//             </li>
//           </ul>
//         </div>
    
//         <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
//           <Link to="/header" className="modern-logout-btn">
//             <i className="fa-solid fa-right-from-bracket"></i>
//             <span>Log Out</span>
//           </Link>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="modern-main-layout">
//         <div className="container-fluid py-3" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 20px" }}>
          
//           <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
//             <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
//               <ArrowLeft size={22} />
//             </button>
//             <h4 style={{ margin: 0, fontWeight: "700", fontSize: "1.25rem" }}>My Orders & Deliveries</h4>
//           </div>

//           <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", width: "100%" }}>
//             <div style={{ position: "relative", width: "100%" }}>
//               <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
//               <input 
//                 type="text" 
//                 placeholder="Search by Order ID, Status or Medicine Name..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", borderRadius: "24px", padding: "10px 16px 10px 46px", color: "#fff", outline: "none", fontSize: "0.9rem" }}
//               />
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
//             {["All", "Pending", "Delivered", "Cancelled"].map((tab) => (
//               <button 
//                 key={tab} 
//                 className={`filter-chip ${activeTab === tab ? "active" : ""}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {loading && <div className="text-center text-light py-5">Loading orders from database...</div>}
//           {error && <div className="alert alert-danger">{error}</div>}

//           <div style={{ width: "100%" }}>
//             {!loading && currentOrders.map((singleOrder) => {
//               const itemsList = singleOrder.orderItems || [];
//               let displayImage = itemsList[0]?.productImage || getFallbackImage(singleOrder.medicineName);
//               const formattedDate = new Date(singleOrder.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//               const isCancelled = singleOrder.rawStatus.toLowerCase() === "cancelled";

//               return (
//                 <div 
//                   key={singleOrder.rawId || singleOrder.id} 
//                   className="order-card-item"
//                   onClick={() => handleOrderClick(singleOrder)}
//                 >
//                   <div className="d-flex align-items-center gap-3" style={{ overflow: "hidden", width: "100%" }}>
//                     <div style={{ width: "64px", height: "64px", background: "#252525", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid #333" }}>
//                       <img src={displayImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     </div>

//                     <div style={{ overflow: "hidden", flexGrow: "1" }}>
//                       <div className="fw-bold mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.95rem", color: isCancelled ? "#ff4d4d" : "#ffc107" }}>
//                         <span>{singleOrder.orderStatus}</span>
//                         <span className="text-muted" style={{ fontSize: "0.78rem" }}>{formattedDate}</span>
//                       </div>
//                       <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
//                         {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
//                       </div>
                      
//                       <div className="p-3 rounded-4 mb-2 mt-2" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
//                         <div className="d-flex justify-content-between align-items-center mb-1">
//                           <h6 className="text-secondary small mb-0 d-flex align-items-center gap-1"><MapPin size={14}/> Delivery Address</h6>
//                           <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px' }}>HOME</span>
//                         </div>
//                         <div className="text-white fw-bold" style={{ fontSize: '0.88rem' }}>
//                           {typeof singleOrder.address === 'object' ? `${singleOrder.address.address || 'JS ROOP HOMES'}, ${singleOrder.address.city || 'Greater Noida'} ${singleOrder.address.pincode || '845401'}` : singleOrder.address}
//                         </div>
//                         <div className="mt-2 p-2 rounded-3" style={{ background: '#252525', border: '1px solid #444' }}>
//                           <div className="text-success small fw-bold mb-1" style={{ fontSize: '0.75rem' }}>RECEIVER DETAILS</div>
//                           <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{singleOrder.receiverName || "Gautam Dev"}</div>
//                           {singleOrder.receiverPhone && (
//                             <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
//                               <Phone size={12} className="me-1" />{singleOrder.receiverPhone}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-muted d-flex align-items-center justify-content-between flex-wrap" style={{ fontSize: "0.78rem", width: "100%" }}>
//                         <div>
//                           <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
//                           &bull; <span>₹{singleOrder.ordertotal}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="d-flex align-items-center gap-2 ps-2">
//                     <ChevronRight size={18} className="text-muted" />
//                   </div>
//                 </div>
//               );
//             })}

//             {!loading && filteredOrders.length === 0 && (
//               <div className="text-center text-muted py-5">No orders found.</div>
//             )}
//           </div>

//           {!loading && filteredOrders.length > 0 && (
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "10px 0" }}>
//               <div style={{ fontSize: "0.85rem", color: "#888" }}>
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
//               </div>
              
//               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                 <button className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
//                   Previous
//                 </button>
//                 <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff", padding: "0 6px" }}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button className="page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }







// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { ChevronRight, Search, ArrowLeft, Phone, MapPin, X } from "lucide-react";
// import { useCart } from "./CartContext";
// import axios from "axios";

// export default function Orders() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cartContext = useCart ? useCart() : null;
//   const cartItems = cartContext?.cartItems || [];

//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);
//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [ordersList, setOrdersList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("All");
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const user = { firstName: "Gautam", lastName: "Dev" };
//   const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   const API_BASE_URL = "https://ecommerencesite.onrender.com";

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 992) {
//         setIsSidebarOpen(true);
//       } else {
//         setIsSidebarOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     fetchAllOrders();
//   }, [location.state]);

//   const isActive = (path) => location.pathname === path;

//   const getFallbackImage = (name) => {
//     const n = (name || "").toLowerCase();
//     if (n.includes("amlodipine")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("amoxycillin") || n.includes("amoxicillin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("telmisartan")) return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150";
//     if (n.includes("paracetamol")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     if (n.includes("nise")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//     return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
//   };

//   const getMedicineNameById = (medicineId, explicitName) => {
//     if (explicitName && explicitName.trim() !== "" && !explicitName.toLowerCase().includes("medicine")) {
//       return explicitName;
//     }
//     switch(Number(medicineId)) {
//       case 187: return "Amlodipine";
//       case 190: return "Amoxycillin + Clavulanic Acid";
//       case 130: return "Telmisartan";
//       case 132: return "Paracetamol";
//       case 191: return "Nise";
//       default: return explicitName || `Prescription Medicine`;
//     }
//   };

//   const formatOrderData = (ord) => {
//     const rawOrderId = String(ord.orderNumber || ord.id || ord.Id || "");
//     const cleanId = rawOrderId.replace("#", "").trim();

//     const rawItems = ord.orderItemss || ord.orderItems || ord.OrderItems || ord.items || ord.Items || [];
    
//     let mappedItems = rawItems.map((item, index) => {
//       const medId = item.medicineId || item.MedicineId || item.id || item.Id;
//       const rawName = item.name || item.Name || item.productName || item.ProductName || item.medicineName || item.MedicineName || "";
      
//       let itemName = getMedicineNameById(medId, rawName);
//       if (cleanId === "200047") itemName = "Amlodipine";

//       let itemImg = item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || ord.productImage || "";
//       if (!itemImg) itemImg = getFallbackImage(itemName);
      
//       const qty = item.quantity || item.Quantity || 1;
//       const priceVal = item.unitPrice || item.UnitPrice || item.price || item.Price || 120;
//       const totalPriceVal = item.totalprice || item.Totalprice || item.totalPrice || item.TotalPrice || (qty * priceVal);

//       return {
//         id: medId || index + 1,
//         name: itemName,
//         productImage: itemImg,
//         quantity: qty,
//         price: priceVal,
//         totalprice: totalPriceVal
//       };
//     });

//     const cancelledOrdersMap = JSON.parse(localStorage.getItem("cancelled_orders_map") || "{}");
//     const legacyCancelled = JSON.parse(localStorage.getItem("cancelled_orders") || "[]");

//     const isLocallyCancelled = Boolean(cancelledOrdersMap[cleanId]) || legacyCancelled.includes(cleanId);

//     const rootMedicineName = ord.medicineName || ord.MedicineName || ord.productName || ord.ProductName || ord.name || ord.Name;
//     const primaryItem = mappedItems[0] || {};
    
//     let finalMedicineName = rootMedicineName || primaryItem.name;
//     if (!finalMedicineName || finalMedicineName.toLowerCase().includes("medicine")) {
//       if (mappedItems.length > 1) finalMedicineName = `${mappedItems[0].name} (+${mappedItems.length - 1} more)`;
//       else finalMedicineName = `Prescription Medicine #${cleanId}`;
//     }

//     if (mappedItems.length === 0) {
//       mappedItems = [{
//         id: 1,
//         name: finalMedicineName,
//         productImage: getFallbackImage(finalMedicineName),
//         quantity: 1,
//         price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 120,
//         totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 120
//       }];
//     }

//     let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
    
//     if (isLocallyCancelled || rawStatus.toLowerCase() === "cancelled" || rawStatus.toLowerCase() === "order cancelled") {
//       rawStatus = "Cancelled";
//     }

//     let displayStatus = rawStatus;
//     if (rawStatus.toLowerCase() === "cancelled") {
//       displayStatus = "Order Cancelled";
//     } else if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
//       displayStatus = "Delivery expected in 3-5 days";
//     }

//     const receiverName = ord.receiverName || ord.ReceiverName || ord.fullName || ord.FullName || ord.userName || "Gautam Dev";
//     const receiverPhone = ord.phoneNumber || ord.PhoneNumber || ord.phone || ord.Phone || ord.mobile || "";
//     const addressData = ord.address || ord.Address || { address: "JS ROOP HOMES", city: "Greater Noida", pincode: "845401" };
//     const orderDate = ord.orderDate || ord.OrderDate || new Date().toISOString();

//     const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

//     return {
//       id: `#${cleanId}`,
//       rawId: cleanId,
//       orderStatus: displayStatus,
//       rawStatus: rawStatus,
//       subStatus: "Recent Order",
//       medicineName: finalMedicineName,
//       category: "AKmedistore",
//       ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 116),
//       totalMRP: ord.totalMRP || ord.totalMrp || calculatedTotal || 120,
//       platformFee: ord.platformFee || 0,
//       couponDiscount: ord.couponDiscount || 4,
//       paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
//       address: addressData,
//       receiverName: receiverName,
//       receiverPhone: receiverPhone,
//       orderItems: mappedItems,
//       orderDate: orderDate
//     };
//   };

//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       let data = [];
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder?t=${new Date().getTime()}`);
//         const resData = response.data;
//         if (Array.isArray(resData)) data = resData;
//         else if (resData && Array.isArray(resData.$values)) data = resData.$values;
//         else if (resData?.data && Array.isArray(resData.data)) data = resData.data;
//       } catch (err) {
//         console.log("API fetch warning, loading from local cache.");
//       }

//       let formatted = data.map(formatOrderData);

//       // Ensure explicit important order IDs (like #301111, #200047, etc.) are always searchable/visible
//       const targetIds = ["301111", "200047", "647606", "780649"];
//       targetIds.forEach(targetId => {
//         const exists = formatted.some(o => o.rawId === targetId);
//         if (!exists) {
//           formatted.unshift({
//             id: `#${targetId}`,
//             rawId: targetId,
//             orderStatus: "Delivery expected in 3-5 days",
//             rawStatus: "Pending",
//             subStatus: "Recent Order",
//             medicineName: targetId === "301111" ? "Telmisartan" : "Prescription Medicine",
//             category: "AKmedistore",
//             ordertotal: 116,
//             totalMRP: 120,
//             platformFee: 0,
//             couponDiscount: 4,
//             paymentMode: "Cash on Delivery (COD)",
//             address: { address: "JS ROOP HOMES", city: "Greater Noida", pincode: "845401" },
//             receiverName: "Gautam Dev",
//             receiverPhone: "7033132629",
//             orderItems: [{
//               id: 1,
//               name: targetId === "301111" ? "Telmisartan" : "Medicine Item",
//               productImage: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150",
//               quantity: 1,
//               price: 120,
//               totalprice: 120
//             }],
//             orderDate: new Date().toISOString()
//           });
//         }
//       });

//       const uniqueOrdersMap = new Map();
//       formatted.forEach((order) => {
//         if (!uniqueOrdersMap.has(order.rawId) || order.rawStatus.toLowerCase() === "cancelled" || targetIds.includes(order.rawId)) {
//           uniqueOrdersMap.set(order.rawId, order);
//         }
//       });

//       setOrdersList(Array.from(uniqueOrdersMap.values()));
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to load orders from server.");
//       setLoading(false);
//     }
//   };

//   const handleOrderClick = (clickedOrder) => {
//     const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

//     navigate("/orderstatus", { 
//       state: { 
//         orderId: cleanId,
//         orderStatus: clickedOrder.rawStatus,
//         orderTotal: clickedOrder.ordertotal,
//         totalMRP: clickedOrder.totalMRP,
//         platformFee: clickedOrder.platformFee,
//         couponDiscount: clickedOrder.couponDiscount,
//         orderItems: clickedOrder.orderItems,
//         address: clickedOrder.address,
//         paymentMode: clickedOrder.paymentMode,
//         receiverName: clickedOrder.receiverName,
//         receiverPhone: clickedOrder.receiverPhone
//       } 
//     });
//   };

//   const cleanSearchQuery = searchQuery.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  
//   let filteredOrders = ordersList.filter(order => {
//     const cleanOrderId = String(order.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
//     const cleanRawId = String(order.rawId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
//     const status = (order.orderStatus || "").toLowerCase();
//     const medName = (order.medicineName || "").toLowerCase();
//     const itemsMatch = order.orderItems.some(item => item.name.toLowerCase().includes(cleanSearchQuery));

//     const matchesSearch = cleanSearchQuery === "" ||
//                           cleanOrderId.includes(cleanSearchQuery) || 
//                           cleanRawId.includes(cleanSearchQuery) || 
//                           status.includes(cleanSearchQuery) || 
//                           medName.includes(cleanSearchQuery) ||
//                           itemsMatch;
    
//     if (activeTab === "All") return matchesSearch;
//     return matchesSearch && order.rawStatus.toLowerCase() === activeTab.toLowerCase();
//   });

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, activeTab]);

//   return (
//     <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%", overflowX: "hidden" }}>
//       <style>{`
//         .modern-sidebar { width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px; position: fixed; left: 0; top: 0; z-index: 1050; box-sizing: border-box; transition: transform 0.3s ease; }
//         @media (max-width: 991.98px) {
//           .modern-sidebar { transform: translateX(-100%); }
//           .modern-sidebar.open { transform: translateX(0); box-shadow: 5px 0 25px rgba(0, 0, 0, 0.5); }
//           .modern-main-layout { margin-left: 0 !important; width: 100% !important; }
//         }
//         @media (min-width: 992px) {
//           .modern-sidebar { transform: translateX(0) !important; }
//           .modern-main-layout { margin-left: 280px !important; width: calc(100% - 280px) !important; }
//         }
//         .sidebar-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 1040; backdrop-filter: blur(2px); }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; margin-bottom: 20px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; overflow-y: auto; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; color: #2d3748; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #e8f7f0; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; }
//         .modern-link-content { display: flex; align-items: center; gap: 14px; }
//         .modern-submenu { list-style: none; padding-left: 32px; margin: 6px 0 0 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-submenu a { color: #4a5568; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
//         .modern-submenu a:hover { color: #0fa462; }
//         .modern-sidebar-footer { margin-top: auto; border-top: 1px solid #edf2f7; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }
//         .modern-avatar { width: 40px; height: 40px; background-color: #e8f7f0; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #2d3748; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.75rem; color: #718096; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #e53e3e; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 10px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fff5f5; }
//         .modern-main-layout { height: 100vh; overflow-y: auto; padding: 24px; box-sizing: border-box; background-color: #121212; width: 100%; margin-left: 280px; }
//         @media (max-width: 991.98px) {
//           .modern-main-layout { margin-left: 0 !important; width: 100% !important; }
//         }
//         .order-card-item { background-color: #1e1e1e; border: 1px solid #2d2d2d; border-radius: 14px; padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease-in-out; width: 100%; }
//         .order-card-item:hover { background-color: #252525; border-color: #0fa462; transform: translateY(-1px); }
//         .filter-chip { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
//         .filter-chip.active { background: #0fa462; color: #fff; border-color: #0fa462; }
//         .page-btn { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
//         .page-btn:hover:not(:disabled) { background: #0fa462; border-color: #0fa462; }
//         .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//       `}</style>

//       {isSidebarOpen && window.innerWidth < 992 && (
//         <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
//       )}

//       {/* SIDEBAR MENU */}
//       <div className={`modern-sidebar ${isSidebarOpen ? "open" : ""}`}>
//         <div>
//           <div className="d-flex align-items-center justify-content-between">
//             <Link to="/dashboards" className="modern-brand mb-0 pb-0 border-0">
//               <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
//               <span>AK Medistore</span>
//             </Link>
//             {window.innerWidth < 992 && (
//               <button className="btn btn-sm btn-light" onClick={() => setIsSidebarOpen(false)}>
//                 <X size={18} />
//               </button>
//             )}
//           </div>
    
//           <ul className="modern-nav-menu mt-3">
//             <li>
//               <button
//                 className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/medication-tracker">Medication Tracker</Link></li>
//                   <li><Link to="/test-reports">Test Reports</Link></li>
//                   <li><Link to="/health-history">Health History</Link></li>
//                 </ul>
//               )}
//             </li>
//             <li>
//               <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress">Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
//                 </ul>
//               )}
//             </li>
//             <li>
//               <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
//                 <div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div>
//               </Link>
//             </li>
//             <li>
//               <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
//                 <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
//                 {cartItems.length > 0 && <span className="badge bg-danger rounded-pill">{cartItems.length}</span>}
//               </Link>
//             </li>
//             <li>
//               <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
//                 <div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div>
//               </Link>
//             </li>
//             <li>
//               <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
//                 <div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div>
//               </Link>
//             </li>
//           </ul>
//         </div>
    
//         <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
//           <Link to="/header" className="modern-logout-btn">
//             <i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span>
//           </Link>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="modern-main-layout flex-grow-1">
//         <div className="container-fluid py-3" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 20px" }}>
          
//           <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
//             <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
//               <ArrowLeft size={22} />
//             </button>
//             <h4 style={{ margin: 0, fontWeight: "700", fontSize: "1.25rem" }}>My Orders & Deliveries</h4>
//           </div>

//           <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", width: "100%" }}>
//             <div style={{ position: "relative", width: "100%" }}>
//               <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
//               <input 
//                 type="text" 
//                 placeholder="Search by Order ID, Status or Medicine Name..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", borderRadius: "24px", padding: "10px 16px 10px 46px", color: "#fff", outline: "none", fontSize: "0.9rem" }}
//               />
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
//             {["All", "Pending", "Delivered", "Cancelled"].map((tab) => (
//               <button 
//                 key={tab} 
//                 className={`filter-chip ${activeTab === tab ? "active" : ""}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {loading && <div className="text-center text-light py-5">Loading orders from database...</div>}
//           {error && <div className="alert alert-danger">{error}</div>}

//           <div style={{ width: "100%" }}>
//             {!loading && currentOrders.map((singleOrder) => {
//               const itemsList = singleOrder.orderItems || [];
//               let displayImage = itemsList[0]?.productImage || getFallbackImage(singleOrder.medicineName);
//               const formattedDate = new Date(singleOrder.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//               const isCancelled = singleOrder.rawStatus.toLowerCase() === "cancelled";

//               return (
//                 <div 
//                   key={singleOrder.rawId || singleOrder.id} 
//                   className="order-card-item"
//                   onClick={() => handleOrderClick(singleOrder)}
//                 >
//                   <div className="d-flex align-items-center gap-3" style={{ overflow: "hidden", width: "100%" }}>
//                     <div style={{ width: "64px", height: "64px", background: "#252525", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid #333" }}>
//                       <img src={displayImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     </div>

//                     <div style={{ overflow: "hidden", flexGrow: "1" }}>
//                       <div className="fw-bold mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.95rem", color: isCancelled ? "#ff4d4d" : "#ffc107" }}>
//                         <span>{singleOrder.orderStatus}</span>
//                         <span className="text-muted" style={{ fontSize: "0.78rem" }}>{formattedDate}</span>
//                       </div>
//                       <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
//                         {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
//                       </div>
                      
//                       <div className="p-3 rounded-4 mb-2 mt-2" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
//                         <div className="d-flex justify-content-between align-items-center mb-1">
//                           <h6 className="text-secondary small mb-0 d-flex align-items-center gap-1"><MapPin size={14}/> Delivery Address</h6>
//                           <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px' }}>HOME</span>
//                         </div>
//                         <div className="text-white fw-bold" style={{ fontSize: '0.88rem' }}>
//                           {typeof singleOrder.address === 'object' ? `${singleOrder.address.address || 'JS ROOP HOMES'}, ${singleOrder.address.city || 'Greater Noida'} ${singleOrder.address.pincode || '845401'}` : singleOrder.address}
//                         </div>
//                         <div className="mt-2 p-2 rounded-3" style={{ background: '#252525', border: '1px solid #444' }}>
//                           <div className="text-success small fw-bold mb-1" style={{ fontSize: '0.75rem' }}>RECEIVER DETAILS</div>
//                           <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{singleOrder.receiverName || "Gautam Dev"}</div>
//                           {singleOrder.receiverPhone && (
//                             <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
//                               <Phone size={12} className="me-1" />{singleOrder.receiverPhone}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-muted d-flex align-items-center justify-content-between flex-wrap" style={{ fontSize: "0.78rem", width: "100%" }}>
//                         <div>
//                           <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
//                           &bull; <span>₹{singleOrder.ordertotal}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="d-flex align-items-center gap-2 ps-2">
//                     <ChevronRight size={18} className="text-muted" />
//                   </div>
//                 </div>
//               );
//             })}

//             {!loading && filteredOrders.length === 0 && (
//               <div className="text-center text-muted py-5">No orders found.</div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, Search, ArrowLeft, Phone, MapPin, X } from "lucide-react";
import { useCart } from "./CartContext";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartContext = useCart ? useCart() : null;
  const cartItems = cartContext?.cartItems || [];

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = { firstName: "Gautam", lastName: "Dev" };
  const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  const API_BASE_URL = "https://ecommerencesite.onrender.com";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [location.state]);

  const isActive = (path) => location.pathname === path;

  const getFallbackImage = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("amlodipine")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("amoxycillin") || n.includes("amoxicillin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("telmisartan")) return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150";
    if (n.includes("paracetamol")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("nise")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
  };

  const getMedicineNameById = (medicineId, explicitName) => {
    if (explicitName && explicitName.trim() !== "" && !explicitName.toLowerCase().includes("medicine")) {
      return explicitName;
    }
    switch(Number(medicineId)) {
      case 187: return "Amlodipine";
      case 190: return "Amoxycillin + Clavulanic Acid";
      case 130: return "Telmisartan";
      case 132: return "Paracetamol";
      case 191: return "Nise";
      default: return explicitName || `Prescription Medicine`;
    }
  };

  const formatOrderData = (ord) => {
    const rawOrderId = String(ord.orderNumber || ord.id || ord.Id || "");
    const cleanId = rawOrderId.replace("#", "").trim();

    const rawItems = ord.orderItemss || ord.orderItems || ord.OrderItems || ord.items || ord.Items || [];
    
    let mappedItems = rawItems.map((item, index) => {
      const medId = item.medicineId || item.MedicineId || item.id || item.Id;
      const rawName = item.name || item.Name || item.productName || item.ProductName || item.medicineName || item.MedicineName || "";
      
      let itemName = getMedicineNameById(medId, rawName);
      let itemImg = item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || ord.productImage || "";
      if (!itemImg) itemImg = getFallbackImage(itemName);
      
      const qty = item.quantity || item.Quantity || 1;
      const priceVal = item.unitPrice || item.UnitPrice || item.price || item.Price || 120;
      const totalPriceVal = item.totalprice || item.Totalprice || item.totalPrice || item.TotalPrice || (qty * priceVal);

      return {
        id: medId || index + 1,
        name: itemName,
        productImage: itemImg,
        quantity: qty,
        price: priceVal,
        totalprice: totalPriceVal
      };
    });

    const cancelledOrdersMap = JSON.parse(localStorage.getItem("cancelled_orders_map") || "{}");
    const legacyCancelled = JSON.parse(localStorage.getItem("cancelled_orders") || "[]");

    const isLocallyCancelled = Boolean(cancelledOrdersMap[cleanId]) || legacyCancelled.includes(cleanId);

    const rootMedicineName = ord.medicineName || ord.MedicineName || ord.productName || ord.ProductName || ord.name || ord.Name;
    const primaryItem = mappedItems[0] || {};
    
    let finalMedicineName = rootMedicineName || primaryItem.name;
    if (!finalMedicineName || finalMedicineName.toLowerCase().includes("medicine")) {
      if (mappedItems.length > 1) finalMedicineName = `${mappedItems[0].name} (+${mappedItems.length - 1} more)`;
      else finalMedicineName = `Prescription Medicine #${cleanId}`;
    }

    if (mappedItems.length === 0) {
      mappedItems = [{
        id: 1,
        name: finalMedicineName,
        productImage: getFallbackImage(finalMedicineName),
        quantity: 1,
        price: ord.orderTotal || 120,
        totalprice: ord.orderTotal || 120
      }];
    }

    let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
    
    if (isLocallyCancelled || rawStatus.toLowerCase() === "cancelled" || rawStatus.toLowerCase() === "order cancelled") {
      rawStatus = "Cancelled";
    }

    let displayStatus = rawStatus;
    if (rawStatus.toLowerCase() === "cancelled") {
      displayStatus = "Order Cancelled";
    } else if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
      displayStatus = "Delivery expected in 3-5 days";
    }

    const receiverName = ord.receiverName || ord.ReceiverName || ord.fullName || ord.FullName || ord.userName || "Gautam Dev";
    const receiverPhone = ord.phoneNumber || ord.PhoneNumber || ord.phone || ord.Phone || ord.mobile || "";
    const addressData = ord.address || ord.Address || { address: "JS ROOP HOMES", city: "Greater Noida", pincode: "845401" };
    const orderDate = ord.orderDate || ord.OrderDate || new Date().toISOString();

    const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);
    
    // Platform fee extraction with fallback for specific orders like #384887 or #200047
    const dbPlatformFee = ord.platformFee !== undefined ? ord.platformFee : (ord.PlatformFee !== undefined ? ord.PlatformFee : (ord.platformfee !== undefined ? ord.platformfee : null));
    const finalPlatformFee = dbPlatformFee !== null && Number(dbPlatformFee) > 0 ? Number(dbPlatformFee) : 7;

    const dbCoupon = ord.couponDiscount !== undefined ? ord.couponDiscount : (ord.CouponDiscount !== undefined ? ord.couponDiscount : null);
    const finalCoupon = dbCoupon !== null ? Number(dbCoupon) : 4;

    const dbTotalMRP = ord.totalMRP || ord.totalMrp || ord.TotalMrp || calculatedTotal;
    const dbOrderTotal = ord.orderTotal || ord.OrderTotal || ord.ordertotal || ((dbTotalMRP + finalPlatformFee) - finalCoupon);

    return {
      id: `#${cleanId}`,
      rawId: cleanId,
      orderStatus: displayStatus,
      rawStatus: rawStatus,
      subStatus: "Recent Order",
      medicineName: finalMedicineName,
      category: "AKmedistore",
      ordertotal: dbOrderTotal,
      totalMRP: dbTotalMRP,
      platformFee: finalPlatformFee,
      couponDiscount: finalCoupon,
      paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
      address: addressData,
      receiverName: receiverName,
      receiverPhone: receiverPhone,
      orderItems: mappedItems,
      orderDate: orderDate
    };
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data = [];
      try {
        const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder?t=${new Date().getTime()}`);
        const resData = response.data;
        if (Array.isArray(resData)) data = resData;
        else if (resData && Array.isArray(resData.$values)) data = resData.$values;
        else if (resData?.data && Array.isArray(resData.data)) data = resData.data;
      } catch (err) {
        console.log("API warning");
      }

      let formatted = data.map(formatOrderData);

      const uniqueOrdersMap = new Map();
      formatted.forEach((order) => {
        if (!uniqueOrdersMap.has(order.rawId) || order.rawStatus.toLowerCase() === "cancelled") {
          uniqueOrdersMap.set(order.rawId, order);
        }
      });

      setOrdersList(Array.from(uniqueOrdersMap.values()));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders from server.");
      setLoading(false);
    }
  };

  const handleOrderClick = (clickedOrder) => {
    const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

    navigate("/orderstatus", { 
      state: { 
        orderId: cleanId,
        orderStatus: clickedOrder.rawStatus,
        orderTotal: clickedOrder.ordertotal,
        totalMRP: clickedOrder.totalMRP,
        platformFee: clickedOrder.platformFee,
        couponDiscount: clickedOrder.couponDiscount,
        orderItems: clickedOrder.orderItems,
        address: clickedOrder.address,
        paymentMode: clickedOrder.paymentMode,
        receiverName: clickedOrder.receiverName,
        receiverPhone: clickedOrder.receiverPhone
      } 
    });
  };

  const cleanSearchQuery = searchQuery.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  
  let filteredOrders = ordersList.filter(order => {
    const cleanOrderId = String(order.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanRawId = String(order.rawId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const status = (order.orderStatus || "").toLowerCase();
    const medName = (order.medicineName || "").toLowerCase();
    const itemsMatch = order.orderItems.some(item => item.name.toLowerCase().includes(cleanSearchQuery));

    const matchesSearch = cleanSearchQuery === "" ||
                          cleanOrderId.includes(cleanSearchQuery) || 
                          cleanRawId.includes(cleanSearchQuery) || 
                          status.includes(cleanSearchQuery) || 
                          medName.includes(cleanSearchQuery) ||
                          itemsMatch;
    
    if (activeTab === "All") return matchesSearch;
    return matchesSearch && order.rawStatus.toLowerCase() === activeTab.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%", overflowX: "hidden" }}>
      <style>{`
        .modern-sidebar { width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px; position: fixed; left: 0; top: 0; z-index: 1050; box-sizing: border-box; transition: transform 0.3s ease; }
        @media (max-width: 991.98px) {
          .modern-sidebar { transform: translateX(-100%); }
          .modern-sidebar.open { transform: translateX(0); box-shadow: 5px 0 25px rgba(0, 0, 0, 0.5); }
          .modern-main-layout { margin-left: 0 !important; width: 100% !important; }
        }
        @media (min-width: 992px) {
          .modern-sidebar { transform: translateX(0) !important; }
          .modern-main-layout { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }
        .sidebar-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 1040; backdrop-filter: blur(2px); }
        .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; margin-bottom: 20px; text-decoration: none; }
        .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
        .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; overflow-y: auto; }
        .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; color: #2d3748; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
        .modern-nav-item:hover { background-color: #e8f7f0; color: #0fa462; }
        .modern-nav-item.active { background-color: #0fa462; color: #ffffff; }
        .modern-link-content { display: flex; align-items: center; gap: 14px; }
        .modern-submenu { list-style: none; padding-left: 32px; margin: 6px 0 0 0; display: flex; flex-direction: column; gap: 6px; }
        .modern-submenu a { color: #4a5568; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
        .modern-submenu a:hover { color: #0fa462; }
        .modern-sidebar-footer { margin-top: auto; border-top: 1px solid #edf2f7; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }
        .modern-avatar { width: 40px; height: 40px; background-color: #e8f7f0; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
        .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #2d3748; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .modern-user-role { font-size: 0.75rem; color: #718096; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #e53e3e; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 10px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fff5f5; }
        .modern-main-layout { height: 100vh; overflow-y: auto; padding: 24px; box-sizing: border-box; background-color: #121212; width: 100%; margin-left: 280px; }
        @media (max-width: 991.98px) {
          .modern-main-layout { margin-left: 0 !important; width: 100% !important; }
        }
        .order-card-item { background-color: #1e1e1e; border: 1px solid #2d2d2d; border-radius: 14px; padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease-in-out; width: 100%; }
        .order-card-item:hover { background-color: #252525; border-color: #0fa462; transform: translateY(-1px); }
        .filter-chip { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-chip.active { background: #0fa462; color: #fff; border-color: #0fa462; }
      `}</style>

      {isSidebarOpen && window.innerWidth < 992 && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR MENU */}
      <div className={`modern-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/dashboards" className="modern-brand mb-0 pb-0 border-0">
              <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
              <span>AK Medistore</span>
            </Link>
            {window.innerWidth < 992 && (
              <button className="btn btn-sm btn-light" onClick={() => setIsSidebarOpen(false)}>
                <X size={18} />
              </button>
            )}
          </div>
    
          <ul className="modern-nav-menu mt-3">
            <li>
              <button
                className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
                onClick={() => setOpenDashboard(!openDashboard)}
              >
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
                </ul>
              )}
            </li>
            <li>
              <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress">Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
                <div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div>
              </Link>
            </li>
            <li>
              <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
                <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
                {cartItems.length > 0 && <span className="badge bg-danger rounded-pill">{cartItems.length}</span>}
              </Link>
            </li>
            <li>
              <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
                <div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div>
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
                <div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div>
              </Link>
            </li>
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
          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="modern-main-layout flex-grow-1">
        <div className="container-fluid py-3" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 20px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <ArrowLeft size={22} />
            </button>
            <h4 style={{ margin: 0, fontWeight: "700", fontSize: "1.25rem" }}>My Orders & Deliveries</h4>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", width: "100%" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              <input 
                type="text" 
                placeholder="Search by Order ID, Status or Medicine Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", borderRadius: "24px", padding: "10px 16px 10px 46px", color: "#fff", outline: "none", fontSize: "0.9rem" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
            {["All", "Pending", "Delivered", "Cancelled"].map((tab) => (
              <button 
                key={tab} 
                className={`filter-chip ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading && <div className="text-center text-light py-5">Loading orders from database...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div style={{ width: "100%" }}>
            {!loading && currentOrders.map((singleOrder) => {
              const itemsList = singleOrder.orderItems || [];
              let displayImage = itemsList[0]?.productImage || getFallbackImage(singleOrder.medicineName);
              const formattedDate = new Date(singleOrder.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              const isCancelled = singleOrder.rawStatus.toLowerCase() === "cancelled";

              return (
                <div 
                  key={singleOrder.rawId || singleOrder.id} 
                  className="order-card-item"
                  onClick={() => handleOrderClick(singleOrder)}
                >
                  <div className="d-flex align-items-center gap-3" style={{ overflow: "hidden", width: "100%" }}>
                    <div style={{ width: "64px", height: "64px", background: "#252525", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid #333" }}>
                      <img src={displayImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    <div style={{ overflow: "hidden", flexGrow: "1" }}>
                      <div className="fw-bold mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: "0.95rem", color: isCancelled ? "#ff4d4d" : "#ffc107" }}>
                        <span>{singleOrder.orderStatus}</span>
                        <span className="text-muted" style={{ fontSize: "0.78rem" }}>{formattedDate}</span>
                      </div>
                      <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                        {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
                      </div>
                      
                      <div className="p-3 rounded-4 mb-2 mt-2" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="text-secondary small mb-0 d-flex align-items-center gap-1"><MapPin size= {14}/> Delivery Address</h6>
                          <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px' }}>HOME</span>
                        </div>
                        <div className="text-white fw-bold" style={{ fontSize: '0.88rem' }}>
                          {typeof singleOrder.address === 'object' ? `${singleOrder.address.address || 'JS ROOP HOMES'}, ${singleOrder.address.city || 'Greater Noida'} ${singleOrder.address.pincode || '845401'}` : singleOrder.address}
                        </div>
                        <div className="mt-2 p-2 rounded-3" style={{ background: '#252525', border: '1px solid #444' }}>
                          <div className="text-success small fw-bold mb-1" style={{ fontSize: '0.75rem' }}>RECEIVER DETAILS</div>
                          <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{singleOrder.receiverName || "Gautam Dev"}</div>
                          {singleOrder.receiverPhone && (
                            <div className="text-muted small" style={{ fontSize: '0.78rem' ,backgroundColor: 'red'}}>
                              <Phone size={12} className="me-1"  />{singleOrder.receiverPhone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-muted d-flex align-items-center justify-content-between flex-wrap" style={{ fontSize: "0.78rem", width: "100%" }}>
                        <div>
                          <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
                          &bull; <span>₹{singleOrder.ordertotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 ps-2">
                    <ChevronRight size={18} className="text-muted" />
                  </div>
                </div>
              );
            })}

            {!loading && filteredOrders.length === 0 && (
              <div className="text-center text-muted py-5">No orders found.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}