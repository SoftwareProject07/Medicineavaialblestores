import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminFeedbackcustomerlist() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    // State to track which buttons should be disabled
    const [sentIds, setSentIds] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); // एक्टिव रूट का पता लगाने के लिए

    // साइडबार ड्रॉपडाउन स्टेट्स
    const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
    const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);

    // SHOP TOGGLE HANDLER
    const handleShopToggle = () => {
        setIsShopOpen((prev) => !prev);
    };

    // एक्टिव नेविगेशन लिंक के लिए डायनामिक क्लासेस
    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `btn w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none transition-all ${
            isActive ? 'btn-success text-white fw-bold' : 'btn-outline-success text-white-50 border-0'
        }`;
    };

    // सब-लिंक्स (ड्रॉपडाउन आइटम्स) के लिए डायनामिक क्लासेस
    const getSubLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `position-relative ps-4 py-2 text-decoration-none d-block transition-all ${
            isActive ? 'text-success fw-bold' : 'text-white-50'
        }`;
    };

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://ecommerencesite.onrender.com/api/FeedbackCustomerApi/GetAllFeedbacks`);
            if (Array.isArray(response.data)) {
                setFeedbacks(response.data);
            } else if (response.data && response.data.data) {
                setFeedbacks(response.data.data);
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
        const savedSentIds = JSON.parse(localStorage.getItem('sent_thanks_ids') || '[]');
        setSentIds(savedSentIds);
    }, []);

    // --- MAIN LOGIC: Send Thanks & Disable Button ---
    const sendThanksMessage = (customerId, customerName) => {
        const newNotif = {
            id: Date.now(),
            customerId: customerId,
            message: "Feedback dene ke liye thanks!",
            time: new Date().toLocaleTimeString(),
            isRead: false
        };

        const existingNotifs = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
        existingNotifs.push(newNotif);
        localStorage.setItem('customer_notifications', JSON.stringify(existingNotifs));

        const updatedSentIds = [...sentIds, customerId];
        setSentIds(updatedSentIds);
        localStorage.setItem('sent_thanks_ids', JSON.stringify(updatedSentIds));
        
        alert(`Thanks sent to ${customerName}`);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
            
            {/* ---------- प्रीमियम ट्री-स्ट्रक्चर साइडबार ---------- */}
            <div style={{ 
                width: '280px', 
                backgroundColor: '#16161a', 
                padding: '24px 16px', 
                position: 'fixed',
                height: '100vh', 
                zIndex: 100, 
                overflowY: 'auto',
                borderRight: '1px solid #232329'
            }}>
                {/* ब्रांड लोगो */}
                <div className="brand mb-4 px-2 d-flex align-items-center">
                    <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
                    <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
                        AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
                    </h5>
                </div>

                {/* ग्लोबल शॉप स्टेटस स्विच */}
                <div className="px-2 mb-4">
                    <div 
                        onClick={handleShopToggle} 
                        className="p-2 d-flex align-items-center justify-content-between transition-all" 
                        style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
                    >
                        <div className="d-flex flex-column">
                            <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
                            <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
                        </div>
                        <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
                    </div>
                </div>

                {/* नेविगेशन लिंक्स */}
                <div className="d-flex flex-column gap-1">
                    <span className="px-3 text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
                    
                    <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
                        <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
                        <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
                    </Link>

                    <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
                    
                    {/* 1. MASTER CONFIGURATION DROPDOWN */}
                    <div className="mb-2">
                        <div 
                            onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
                            className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
                            style={{ cursor: 'pointer', fontSize: '13.5px' }}
                        >
                            <span className="d-flex align-items-center gap-3">
                                <i className="fas fa-sliders-h"></i> Master Config
                            </span>
                            <i className={`fas fa-chevron-right transition-all ${masterDropdownOpen ? 'rotate-90 text-success' : ''}`} style={{ fontSize: '10px', transform: masterDropdownOpen ? 'rotate(90deg)' : 'none' }}></i>
                        </div>

                        {masterDropdownOpen && (
                            <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                                
                                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Add Item Type
                                </Link>

                                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    AddAssignedTO
                                </Link>

               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                   <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Language Master       
                </Link>
                         <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                         StateName Master  
                              </Link>
<Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                CityName Master           
                              </Link> 
                

              

          
                            </div>
                        )}
                    </div>

                    {/* 2. OPERATIONS REGISTRY DROPDOWN */}
                    <div>
                        <div 
                            onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
                            className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
                            style={{ cursor: 'pointer', fontSize: '13.5px' }}
                        >
                            <span className="d-flex align-items-center gap-3">
                                <i className="fas fa-boxes"></i> Operations Registry
                            </span>
                            <i className={`fas fa-chevron-right transition-all ${listsDropdownOpen ? 'rotate-90 text-success' : ''}`} style={{ fontSize: '10px', transform: listsDropdownOpen ? 'rotate(90deg)' : 'none' }}></i>
                        </div>

                        {listsDropdownOpen && (
                            <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                                                 <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 

                                <Link to="/customerlists" className={getSubLinkClass("/customerlists")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/customerlists' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Customer LIST
                                </Link>

                                <Link to="/orderpaymentlist" className={getSubLinkClass("/orderpaymentlist")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/orderpaymentlist' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    OrderPaymentList
                                </Link>

                                <Link to="/orderstatuslist" className={getSubLinkClass("/orderstatuslist")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/orderstatuslist' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    OrderStatusLIST
                                </Link>

                                <Link to="/adminFeedbackcustomerlists" className={getSubLinkClass("/adminFeedbackcustomerlists")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminFeedbackcustomerlists' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Feedback List
                                </Link>

                                <Link to="/adminloginlists" className={getSubLinkClass("/adminloginlists")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminloginlists' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Admin Login List
                                </Link>

                                <Link to="/adminUnavailableMedicines" className={getSubLinkClass("/adminUnavailableMedicines")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminUnavailableMedicines' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Unavailable Medicine
                                </Link>

                                <Link to="/adminbankselectdetailss" className={getSubLinkClass("/adminbankselectdetailss")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminbankselectdetailss' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Bank Select Master
                                </Link>

                                <Link to="/admincreditdetails" className={getSubLinkClass("/admincreditdetails")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/admincreditdetails' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Bank Credit Details
                                </Link>

                                <Link to="/adminregisterationform" className={getSubLinkClass("/adminregisterationform")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminregisterationform' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                     Registration Form
                                </Link>

                                <Link to="/adminLivenessimageLists" className={getSubLinkClass("/adminLivenessimageLists")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminLivenessimageLists' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Liveness Image List
                                </Link>

                                <Link to="/admincustomerticketraiselist" className={getSubLinkClass("/admincustomerticketraiselist")}>
                                    <div className="position-absolute" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/admincustomerticketraiselist' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Customer Ticket Raise
                                </Link>
                                                  <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                                                            <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>

                                 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
             <Link to="/doctor_patientdetailslists" className={getSubLinkClass("/doctor_patientdetailslists")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
Doctor_PatientdetailsLists         
       </Link>
        <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

                   
                            </div>
                        )}
                    </div>

                    {/* लॉगआउट एक्शन */}
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/header')} 
                            className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
                            style={{ fontSize: '13.5px' }}
                        >
                            <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------- MAIN CONTENT AREA ---------- */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                    <h2>Customer Feedbacks</h2>
                    <button className="btn btn-outline-info btn-sm" onClick={fetchFeedbacks}>Refresh Data</button>
                </div>

                <div className="table-responsive bg-dark rounded border border-secondary">
                    <table className="table table-dark table-hover mb-0">
                        <thead className="table-secondary">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Message</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading...</td></tr>
                            ) : feedbacks.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-5">No Feedbacks Found</td></tr>
                            ) : feedbacks.map((item) => {
                                const isAlreadySent = sentIds.includes(item.freedbackcustomerid);
                                const ratingCount = Math.max(0, Number(item.starStatus || 0));
                                
                                return (
                                    <tr key={item.freedbackcustomerid}>
                                        <td>{item.freedbackcustomerid}</td>
                                        <td className="text-info fw-bold">{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <span className="text-warning">
                                                {ratingCount > 0 ? '★'.repeat(ratingCount) : 'No Rating'}
                                            </span>
                                        </td>
                                        <td>{item.message}</td>
                                        <td>
                                            <button 
                                                className={`btn btn-sm ${isAlreadySent ? 'btn-secondary' : 'btn-success'}`}
                                                onClick={() => sendThanksMessage(item.freedbackcustomerid, item.name)}
                                                disabled={isAlreadySent}
                                            >
                                                {isAlreadySent ? 'Thanks Sent' : 'Feedback Thanks'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}