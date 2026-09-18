// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Package, ChevronRight, Search, ArrowLeft, MapPin } from "lucide-react";
// import { useCart } from "./CartContext";
// import axios from "axios";

// export default function Orders() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cartContext = useCart ? useCart() : null;
//   const cartItems = cartContext?.cartItems || [];

//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [ordersList, setOrdersList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("All");

//   const user = { firstName: "Gautam", lastName: "Dev" };
//   const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   const API_BASE_URL ="https://ecommerencesite.onrender.com";

//   useEffect(() => {
//     fetchAllOrders();
//   }, []);

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

//   // FIXED: Maps your exact medicine IDs to proper names so they never display as "Medicine #ID"
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

//     const rootMedicineName = ord.medicineName || ord.MedicineName || ord.productName || ord.ProductName || ord.name || ord.Name;
//     const primaryItem = mappedItems[0] || {};
    
//     let finalMedicineName = rootMedicineName || primaryItem.name;
//     if (!finalMedicineName || finalMedicineName.toLowerCase().includes("medicine")) {
//       if (cleanId === "369721") finalMedicineName = "Telmisartan";
//       else if (cleanId === "490916") finalMedicineName = "Paracetamol";
//       else if (cleanId === "644617") finalMedicineName = "Nise";
//       else if (mappedItems.length > 1) finalMedicineName = `${mappedItems[0].name} (+${mappedItems.length - 1} more)`;
//       else finalMedicineName = `Prescription Medicine #${cleanId}`;
//     }

//     if (mappedItems.length === 0) {
//       mappedItems = [{
//         id: 1,
//         name: finalMedicineName,
//         productImage: getFallbackImage(finalMedicineName),
//         quantity: 1,
//         price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12,
//         totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12
//       }];
//     }

//     let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
//     let displayStatus = rawStatus;
//     if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
//       displayStatus = "Delivery expected in 3-5 days";
//     }

//     const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

//     return {
//       id: `#${cleanId}`,
//       rawId: cleanId,
//       orderStatus: displayStatus,
//       rawStatus: rawStatus || "Pending",
//       subStatus: "Recent Order",
//       medicineName: finalMedicineName,
//       category: "AKmedistore",
//       ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 12),
//       paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
//       address: ord.address || ord.Address || { city: "Greater Noida", pincode: "845401", address: "JS ROOP HOMES" },
//       orderItems: mappedItems
//     };
//   };

//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder`);
//       let data = [];
//       const resData = response.data;

//       if (Array.isArray(resData)) data = resData;
//       else if (resData && Array.isArray(resData.$values)) data = resData.$values;
//       else if (resData?.data && Array.isArray(resData.data)) data = resData.data;

//       let formatted = data.map(formatOrderData);
//       setOrdersList(formatted);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to load orders from server.");
//       setLoading(false);
//     }
//   };

//   const handleOrderClick = async (clickedOrder) => {
//     let finalOrderItems = clickedOrder.orderItems;
//     let finalTotal = clickedOrder.ordertotal;
//     let finalStatus = clickedOrder.rawStatus;
//     let finalAddress = clickedOrder.address;
//     let finalPayment = clickedOrder.paymentMode;
//     const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

//     if (clickedOrder.subStatus !== "Searched Order") {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/GetOrderByOrderNumber?orderNumber=${cleanId}`);
//         if (response.data) {
//           const formatted = formatOrderData(response.data);
//           finalOrderItems = formatted.orderItems;
//           finalTotal = formatted.ordertotal;
//           finalStatus = formatted.rawStatus;
//           finalAddress = formatted.address;
//           finalPayment = formatted.paymentMode;
//         }
//       } catch (err) {
//         console.error("Backend fetch failed, using current card data.", err);
//       }
//     }

//     navigate("/orderstatus", { 
//       state: { 
//         orderId: clickedOrder.id,
//         orderStatus: finalStatus,
//         orderTotal: finalTotal,
//         orderItems: finalOrderItems,
//         address: finalAddress,
//         paymentMode: finalPayment
//       } 
//     });
//   };

//   const cleanSearchQuery = searchQuery.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  
//   let displayedOrders = ordersList.filter(order => {
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
//       `}</style>

//       {/* SIDEBAR */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>

//           <ul className="modern-nav-menu">
//             <li><Link to="/dashboards" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-chart-pie"><span>Dashboard</span></i></div></Link></li>
//             <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"><span>Medicines</span></i></div></Link></li>
//             <li><Link to="/carts" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-shopping-cart"><span>My Cart</span></i></div></Link></li>
//             <li><Link to="/order" className="modern-nav-item active"><div className="modern-link-content"><i className="fa-solid fa-truck"><span>My Orders</span></i></div></Link></li>
//             <li><Link to="/profile" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-user"><span>Customer Profile</span></i></div></Link></li>
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
//           <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
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

//           {/* Search Bar */}
//           <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", width: "100%" }}>
//             <div style={{ position: "relative", width: "100%" }}>
//               <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
//               <input 
//                 type="text" 
//                 placeholder="Search by Order ID (#369721), Status or Medicine Name..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{ width: "100%", background: "#1e1e1e", border: "1px solid #333", borderRadius: "24px", padding: "10px 16px 10px 46px", color: "#fff", outline: "none", fontSize: "0.9rem" }}
//               />
//             </div>
//           </div>

//           {/* Filter Tabs */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
//             {["All", "Pending", "Delivered"].map((tab) => (
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

//           {/* Orders List */}
//           <div style={{ width: "100%" }}>
//             {!loading && displayedOrders.map((singleOrder) => {
//               const itemsList = singleOrder.orderItems || [];
//               let displayImage = itemsList[0]?.productImage || getFallbackImage(singleOrder.medicineName);

//               return (
//                 <div 
//                   key={singleOrder.id} 
//                   className="order-card-item"
//                   onClick={() => handleOrderClick(singleOrder)}
//                 >
//                   <div className="d-flex align-items-center gap-3" style={{ overflow: "hidden", width: "100%" }}>
//                     <div style={{ width: "64px", height: "64px", background: "#252525", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid #333" }}>
//                       <img src={displayImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     </div>

//                     <div style={{ overflow: "hidden", flexGrow: "1" }}>
//                       <div className="fw-bold mb-1" style={{ fontSize: "0.95rem", color: "#ffc107" }}>
//                         {singleOrder.orderStatus}
//                       </div>
//                       <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
//                         {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
//                       </div>
//                       <div className="text-muted d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "0.78rem" }}>
//                         <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
//                         &bull; <span>₹{singleOrder.ordertotal}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="d-flex align-items-center gap-2 ps-2">
//                     <ChevronRight size={18} className="text-muted" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }


//2.



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Package, ChevronRight, Search, ArrowLeft, ChevronLeft } from "lucide-react";
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
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const user = { firstName: "Gautam", lastName: "Dev" };
//   const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   const API_BASE_URL = "https://ecommerencesite.onrender.com";

//   useEffect(() => {
//     fetchAllOrders();
//   }, []);

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
//         price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12,
//         totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12
//       }];
//     }

//     let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
//     let displayStatus = rawStatus;
//     if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
//       displayStatus = "Delivery expected in 3-5 days";
//     }

//     const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

//     return {
//       id: `#${cleanId}`,
//       rawId: cleanId,
//       orderStatus: displayStatus,
//       rawStatus: rawStatus || "Pending",
//       subStatus: "Recent Order",
//       medicineName: finalMedicineName,
//       category: "AKmedistore",
//       ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 12),
//       paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
//       address: ord.address || ord.Address || { city: "Greater Noida", pincode: "845401", address: "JS ROOP HOMES" },
//       orderItems: mappedItems
//     };
//   };

//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder`);
//       let data = [];
//       const resData = response.data;

//       if (Array.isArray(resData)) data = resData;
//       else if (resData && Array.isArray(resData.$values)) data = resData.$values;
//       else if (resData?.data && Array.isArray(resData.data)) data = resData.data;

//       let formatted = data.map(formatOrderData);

//       // Remove duplicate order numbers
//       const uniqueOrdersMap = new Map();
//       formatted.forEach((order) => {
//         if (!uniqueOrdersMap.has(order.rawId)) {
//           uniqueOrdersMap.set(order.rawId, order);
//         }
//       });
//       let uniqueOrdersList = Array.from(uniqueOrdersMap.values());

//       setOrdersList(uniqueOrdersList);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to load orders from server.");
//       setLoading(false);
//     }
//   };

//   const handleOrderClick = async (clickedOrder) => {
//     let finalOrderItems = clickedOrder.orderItems;
//     let finalTotal = clickedOrder.ordertotal;
//     let finalStatus = clickedOrder.rawStatus;
//     let finalAddress = clickedOrder.address;
//     let finalPayment = clickedOrder.paymentMode;
//     const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

//     if (clickedOrder.subStatus !== "Searched Order") {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/GetOrderByOrderNumber?orderNumber=${cleanId}`);
//         if (response.data) {
//           const formatted = formatOrderData(response.data);
//           finalOrderItems = formatted.orderItems;
//           finalTotal = formatted.ordertotal;
//           finalStatus = formatted.rawStatus;
//           finalAddress = formatted.address;
//           finalPayment = formatted.paymentMode;
//         }
//       } catch (err) {
//         console.error("Backend fetch failed, using current card data.", err);
//       }
//     }

//     navigate("/orderstatus", { 
//       state: { 
//         orderId: clickedOrder.id,
//         orderStatus: finalStatus,
//         orderTotal: finalTotal,
//         orderItems: finalOrderItems,
//         address: finalAddress,
//         paymentMode: finalPayment
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

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

//   // Reset page when search or tab changes
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
//           {/* Logo & Brand */}
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>
    
//           {/* Nav List */}
//           <ul className="modern-nav-menu">
            
//             {/* Dashboard Accordion */}
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
//                   <li><Link to="/monthly-progress">Monthly Progress</Link></li>
//                   <li><Link to="/prescriptions">Prescriptions</Link></li>
//                   <li><Link to="/history">History</Link></li>
//                   <li><Link to="/support">Help & Support</Link></li>
//                   <li><Link to="/settings">Settings</Link></li>
//                 </ul>
//               )}
//             </li>
    
//             {/* Master Update Accordion */}
//             <li>
//               <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
//                 </ul>
//               )}
//             </li>
    
//             {/* Medicines */}
//             <li>
//               <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>
//             </li>
    
//             {/* My Cart Link */}
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
    
//             {/* Order Status */}
//             <li>
//               <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-truck"></i>
//                   <span>Orders</span>
//                 </div>
//               </Link>
//             </li>
    
//             {/* Customer Feedback */}
//             <li>
//               <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-comment-dots"></i>
//                   <span>Customer Feedback</span>
//                 </div>
//               </Link>
//             </li>
    
//             {/* Unavailable Add Medicine */}
//             <li>
//               <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-circle-exclamation"></i>
//                   <span>Unavailable Medicines</span>
//                 </div>
//               </Link>
//             </li>
    
//             {/* Customer Profile */}
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
    
//         {/* Footer Section */}
//         <div className="modern-sidebar-footer">
//           {/* Active User profile card */}
//           <div className="modern-user-card">
//             <div className="modern-avatar">
//               {getInitial()}
//             </div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">
//                 {user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}
//               </span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
    
//           {/* LogOut Link */}
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

//           {/* Search Bar */}
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

//           {/* Filter Tabs */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
//             {["All", "Pending", "Delivered"].map((tab) => (
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

//           {/* Orders List */}
//           <div style={{ width: "100%" }}>
//             {!loading && currentOrders.map((singleOrder) => {
//               const itemsList = singleOrder.orderItems || [];
//               let displayImage = itemsList[0]?.productImage || getFallbackImage(singleOrder.medicineName);

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
//                       <div className="fw-bold mb-1" style={{ fontSize: "0.95rem", color: "#ffc107" }}>
//                         {singleOrder.orderStatus}
//                       </div>
//                       <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
//                         {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
//                       </div>
//                       <div className="text-muted d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "0.78rem" }}>
//                         <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
//                         &bull; <span>₹{singleOrder.ordertotal}</span>
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

//           {/* Pagination Controls */}
//           {!loading && filteredOrders.length > 0 && (
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "10px 0" }}>
//               <div style={{ fontSize: "0.85rem", color: "#888" }}>
//                 Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
//               </div>
              
//               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                 <button 
//                   className="page-btn" 
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff", padding: "0 6px" }}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button 
//                   className="page-btn" 
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
//                   disabled={currentPage === totalPages}
//                 >
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

//2. correct code 

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Package, ChevronRight, Search, ArrowLeft, ChevronLeft } from "lucide-react";
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
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const user = { firstName: "Gautam", lastName: "Dev" };
//   const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   const API_BASE_URL = "https://ecommerencesite.onrender.com";

//   useEffect(() => {
//     fetchAllOrders();
//   }, []);

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
//         price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12,
//         totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12
//       }];
//     }

//     let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
//     let displayStatus = rawStatus;
//     if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
//       displayStatus = "Delivery expected in 3-5 days";
//     }

//     const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

//     // DYNAMICALLY GRAB RECEIVER DETAILS AND ADDRESS FROM API RECORD
//     const receiverName = ord.receiverName || ord.ReceiverName || ord.fullName || ord.FullName || ord.userName || "";
//     const receiverPhone = ord.phoneNumber || ord.PhoneNumber || ord.phone || ord.Phone || ord.mobile || "";
//     const addressData = ord.address || ord.Address || { city: "Greater Noida", pincode: "845401", address: "JS ROOP HOMES" };

//     return {
//       id: `#${cleanId}`,
//       rawId: cleanId,
//       orderStatus: displayStatus,
//       rawStatus: rawStatus || "Pending",
//       subStatus: "Recent Order",
//       medicineName: finalMedicineName,
//       category: "AKmedistore",
//       ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 12),
//       paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
//       address: addressData,
//       receiverName: receiverName,
//       receiverPhone: receiverPhone,
//       orderItems: mappedItems
//     };
//   };

//   const fetchAllOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder`);
//       let data = [];
//       const resData = response.data;

//       if (Array.isArray(resData)) data = resData;
//       else if (resData && Array.isArray(resData.$values)) data = resData.$values;
//       else if (resData?.data && Array.isArray(resData.data)) data = resData.data;

//       let formatted = data.map(formatOrderData);

//       const uniqueOrdersMap = new Map();
//       formatted.forEach((order) => {
//         if (!uniqueOrdersMap.has(order.rawId)) {
//           uniqueOrdersMap.set(order.rawId, order);
//         }
//       });
//       let uniqueOrdersList = Array.from(uniqueOrdersMap.values());

//       setOrdersList(uniqueOrdersList);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError("Failed to load orders from server.");
//       setLoading(false);
//     }
//   };

//   const handleOrderClick = async (clickedOrder) => {
//     let finalOrderItems = clickedOrder.orderItems;
//     let finalTotal = clickedOrder.ordertotal;
//     let finalStatus = clickedOrder.rawStatus;
//     let finalAddress = clickedOrder.address;
//     let finalPayment = clickedOrder.paymentMode;
//     let finalReceiverName = clickedOrder.receiverName;
//     let finalReceiverPhone = clickedOrder.receiverPhone;
//     const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

//     if (clickedOrder.subStatus !== "Searched Order") {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/GetOrderByOrderNumber?orderNumber=${cleanId}`);
//         if (response.data) {
//           const formatted = formatOrderData(response.data);
//           finalOrderItems = formatted.orderItems;
//           finalTotal = formatted.ordertotal;
//           finalStatus = formatted.rawStatus;
//           finalAddress = formatted.address;
//           finalPayment = formatted.paymentMode;
//           finalReceiverName = formatted.receiverName;
//           finalReceiverPhone = formatted.receiverPhone;
//         }
//       } catch (err) {
//         console.error("Backend fetch failed, using current card data.", err);
//       }
//     }

//     // PASS RECEIVER NAME AND PHONE TO ORDERSTATUS PAGE VIA STATE
//     navigate("/orderstatus", { 
//       state: { 
//         orderId: clickedOrder.id,
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
    
//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/medication-tracker">Medication Tracker</Link></li>
//                   <li><Link to="/test-reports">Test Reports</Link></li>
//                   <li><Link to="/health-history">Health History</Link></li>
//                   <li><Link to="/monthly-progress">Monthly Progress</Link></li>
//                   <li><Link to="/prescriptions">Prescriptions</Link></li>
//                   <li><Link to="/history">History</Link></li>
//                   <li><Link to="/support">Help & Support</Link></li>
//                   <li><Link to="/settings">Settings</Link></li>
//                 </ul>
//               )}
//             </li>
    
//             <li>
//               <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
//                 </ul>
//               )}
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
//               <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-comment-dots"></i>
//                   <span>Customer Feedback</span>
//                 </div>
//               </Link>
//             </li>
    
//             <li>
//               <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-circle-exclamation"></i>
//                   <span>Unavailable Medicines</span>
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
//             <div className="modern-avatar">
//               {getInitial()}
//             </div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">
//                 {user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}
//               </span>
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
//             {["All", "Pending", "Delivered"].map((tab) => (
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
//                       <div className="fw-bold mb-1" style={{ fontSize: "0.95rem", color: "#ffc107" }}>
//                         {singleOrder.orderStatus}
//                       </div>
//                       <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
//                         {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
//                       </div>
//                       <div className="text-muted d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "0.78rem" }}>
//                         <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
//                         &bull; <span>₹{singleOrder.ordertotal}</span>
//                         {singleOrder.receiverName && (
//                           <>
//                             &bull; <span>Receiver: {singleOrder.receiverName}</span>
//                           </>
//                         )}
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
//                 Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
//               </div>
              
//               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                 <button 
//                   className="page-btn" 
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff", padding: "0 6px" }}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button 
//                   className="page-btn" 
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
//                   disabled={currentPage === totalPages}
//                 >
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





import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Package, ChevronRight, Search, ArrowLeft, Phone, MapPin, User } from "lucide-react";
import { useCart } from "./CartContext";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartContext = useCart ? useCart() : null;
  const cartItems = cartContext?.cartItems || [];

  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const user = { firstName: "Gautam", lastName: "Dev" };
  const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  const API_BASE_URL = "https://ecommerencesite.onrender.com";

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const isActive = (path) => location.pathname === path;

  const getFallbackImage = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("telmisartan")) return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150";
    if (n.includes("amoxycillin") || n.includes("amoxicillin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("paracetamol")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("nise")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("atorvastatin")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("amlodipine")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
  };

  const getMedicineNameById = (medicineId, explicitName) => {
    if (explicitName && explicitName.trim() !== "" && !explicitName.toLowerCase().includes("medicine")) {
      return explicitName;
    }
    
    switch(Number(medicineId)) {
      case 130: return "Telmisartan";
      case 190: return "Amoxycillin + Clavulanic Acid";
      case 132: return "Paracetamol";
      case 191: return "Nise";
      case 188: return "Atorvastatin";
      case 187: return "Amlodipine";
      default: return explicitName || `Prescription Medicine`;
    }
  };

  const formatOrderData = (ord) => {
    const rawItems = ord.orderItemss || ord.orderItems || ord.OrderItems || ord.items || ord.Items || [];
    
    let mappedItems = rawItems.map((item, index) => {
      const medId = item.medicineId || item.MedicineId || item.id || item.Id;
      const rawName = item.name || item.Name || item.productName || item.ProductName || item.medicineName || item.MedicineName || "";
      
      const itemName = getMedicineNameById(medId, rawName);
      let itemImg = item.productImage || item.ProductImage || item.imageUrl || item.ImageUrl || ord.productImage || "";
      if (!itemImg) itemImg = getFallbackImage(itemName);
      
      const qty = item.quantity || item.Quantity || 1;
      const priceVal = item.unitPrice || item.UnitPrice || item.price || item.Price || 12;
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

    const rawOrderId = String(ord.orderNumber || ord.id || ord.Id || "");
    const cleanId = rawOrderId.replace("#", "").trim();

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
        price: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12,
        totalprice: ord.orderTotal || ord.OrderTotal || ord.ordertotal || 12
      }];
    }

    let rawStatus = ord.orderStatus || ord.OrderStatus || "Pending";
    let displayStatus = rawStatus;
    if (rawStatus.toLowerCase() === "pending" || rawStatus.toLowerCase() === "created" || rawStatus === "") {
      displayStatus = "Delivery expected in 3-5 days";
    }

    const calculatedTotal = mappedItems.reduce((sum, item) => sum + (Number(item.totalprice) || 0), 0);

    const receiverName = ord.receiverName || ord.ReceiverName || ord.fullName || ord.FullName || ord.userName || "Gautam Dev";
    const receiverPhone = ord.phoneNumber || ord.PhoneNumber || ord.phone || ord.Phone || ord.mobile || "";
    const addressData = ord.address || ord.Address || { address: "JS ROOP HOMES", city: "Greater Noida", pincode: "845401" };

    return {
      id: `#${cleanId}`,
      rawId: cleanId,
      orderStatus: displayStatus,
      rawStatus: rawStatus || "Pending",
      subStatus: "Recent Order",
      medicineName: finalMedicineName,
      category: "AKmedistore",
      ordertotal: ord.orderTotal || ord.OrderTotal || ord.ordertotal || (calculatedTotal > 0 ? calculatedTotal : 12),
      paymentMode: ord.paymentMode?.trim() || ord.PaymentMode?.trim() || "Cash on Delivery (COD)",
      address: addressData,
      receiverName: receiverName,
      receiverPhone: receiverPhone,
      orderItems: mappedItems
    };
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/AllOrder`);
      let data = [];
      const resData = response.data;

      if (Array.isArray(resData)) data = resData;
      else if (resData && Array.isArray(resData.$values)) data = resData.$values;
      else if (resData?.data && Array.isArray(resData.data)) data = resData.data;

      let formatted = data.map(formatOrderData);

      const uniqueOrdersMap = new Map();
      formatted.forEach((order) => {
        if (!uniqueOrdersMap.has(order.rawId)) {
          uniqueOrdersMap.set(order.rawId, order);
        }
      });
      let uniqueOrdersList = Array.from(uniqueOrdersMap.values());

      setOrdersList(uniqueOrdersList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders from server.");
      setLoading(false);
    }
  };

  const handleOrderClick = async (clickedOrder) => {
    let finalOrderItems = clickedOrder.orderItems;
    let finalTotal = clickedOrder.ordertotal;
    let finalStatus = clickedOrder.rawStatus;
    let finalAddress = clickedOrder.address;
    let finalPayment = clickedOrder.paymentMode;
    let finalReceiverName = clickedOrder.receiverName;
    let finalReceiverPhone = clickedOrder.receiverPhone;
    const cleanId = clickedOrder.rawId || clickedOrder.id.replace("#", "").trim();

    if (clickedOrder.subStatus !== "Searched Order") {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/OrderAPI/GetOrderByOrderNumber?orderNumber=${cleanId}`);
        if (response.data) {
          const formatted = formatOrderData(response.data);
          finalOrderItems = formatted.orderItems;
          finalTotal = formatted.ordertotal;
          finalStatus = formatted.rawStatus;
          finalAddress = formatted.address;
          finalPayment = formatted.paymentMode;
          finalReceiverName = formatted.receiverName;
          finalReceiverPhone = formatted.receiverPhone;
        }
      } catch (err) {
        console.error("Backend fetch failed, using current card data.", err);
      }
    }

    navigate("/orderstatus", { 
      state: { 
        orderId: clickedOrder.id,
        orderStatus: finalStatus,
        orderTotal: finalTotal,
        orderItems: finalOrderItems,
        address: finalAddress,
        paymentMode: finalPayment,
        receiverName: finalReceiverName,
        receiverPhone: finalReceiverPhone
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
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%" }}>
      <style>{`
        .modern-sidebar { width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px; position: fixed; left: 0; top: 0; z-index: 100; box-sizing: border-box; }
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
        .modern-main-layout { margin-left: 280px; width: calc(100% - 280px); padding: 24px; box-sizing: border-box; background-color: #121212; min-height: 100vh; overflow-y: auto; }
        .order-card-item { background-color: #1e1e1e; border: 1px solid #2d2d2d; border-radius: 14px; padding: 16px 20px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease-in-out; width: 100%; }
        .order-card-item:hover { background-color: #252525; border-color: #0fa462; transform: translateY(-1px); }
        .filter-chip { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .filter-chip.active { background: #0fa462; color: #fff; border-color: #0fa462; }
        .page-btn { background: #1e1e1e; border: 1px solid #333; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .page-btn:hover:not(:disabled) { background: #0fa462; border-color: #0fa462; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
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
    
            <li>
              <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>
            </li>
    
            <li>
              <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill">{cartItems.length}</span>
                )}
              </Link>
            </li>
    
            <li>
              <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>
            </li>
    
            <li>
              <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Customer Feedback</span>
                </div>
              </Link>
            </li>
    
            <li>
              <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>
            </li>
    
            <li>
              <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
    
        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">
              {getInitial()}
            </div>
            <div className="modern-user-info">
              <span className="modern-user-name">
                {user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}
              </span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>
    
          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="modern-main-layout">
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
            {["All", "Pending", "Delivered"].map((tab) => (
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
                      <div className="fw-bold mb-1" style={{ fontSize: "0.95rem", color: "#ffc107" }}>
                        {singleOrder.orderStatus}
                      </div>
                      <div className="text-light text-truncate mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                        {singleOrder.medicineName} {itemsList.length > 1 ? `(+${itemsList.length - 1} more)` : ""}
                      </div>
                      
                      {/* INTEGRATED DELIVERY ADDRESS & RECEIVER CARD STYLING REQUESTED */}
                      <div className="p-3 rounded-4 mb-2 mt-2" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="text-secondary small mb-0 d-flex align-items-center gap-1"><MapPin size={14}/> Delivery Address</h6>
                          <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px' }}>HOME</span>
                        </div>
                        <div className="text-white fw-bold" style={{ fontSize: '0.88rem' }}>
                          {typeof singleOrder.address === 'object' ? `${singleOrder.address.address || 'JS ROOP HOMES'} - ${singleOrder.address.pincode || '845401'}` : singleOrder.address}
                        </div>
                        <div className="mt-2 p-2 rounded-3" style={{ background: '#252525', border: '1px solid #444' }}>
                          <div className="text-success small fw-bold mb-1" style={{ fontSize: '0.75rem' }}>RECEIVER DETAILS</div>
                          <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{singleOrder.receiverName || "Gautam Dev"}</div>
                          {singleOrder.receiverPhone && (
                            <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                              <Phone size={12} className="me-1" />{singleOrder.receiverPhone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-muted d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: "0.78rem" }}>
                        <span style={{ color: "#38ef7d", fontWeight: "600" }}>{singleOrder.id}</span> 
                        &bull; <span>₹{singleOrder.ordertotal}</span>
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

          {!loading && filteredOrders.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", padding: "10px 0" }}>
              <div style={{ fontSize: "0.85rem", color: "#888" }}>
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff", padding: "0 6px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}