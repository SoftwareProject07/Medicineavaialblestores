import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AddBankRefundableAmount() {
    const location = useLocation();

    // Sidebar Accordion States
    const [openDashboard, setOpenDashboard] = useState(false);
    const [openMasterUpdate, setOpenMasterUpdate] = useState(true); // Default open kyunki hum isi page par hain

    // Cart and User Profile States (Optional / Mock defaults)
    const [cartItems] = useState([]);
    const [user] = useState(null);

    const loggedInCustomerName = user ? `${user.firstName} ${user.lastName}` : (localStorage.getItem('customerName') || localStorage.getItem('username') || 'Gautam Dev');

    // Form & Data States
    const [formData, setFormData] = useState({
        Bank_CustomerName: loggedInCustomerName,
        BankName: '',
        BankAccountNumber: '',
        ConfirmBankAccountNumber: '',
        BankIFSCCode: '',
        BankBranchName: '',
        BankBranchAddress: '',
        BankBranchCity: '',
        BankBranchState: ''
    });

    const [bankList, setBankList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingList, setFetchingList] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchCustomerBankDetails();
    }, []);

    const fetchCustomerBankDetails = async () => {
        setFetchingList(true);
        try {
            const response = await axios.get(
                `https://ecommerencesite.onrender.com/api/BankRefundableAmountAPI/GetBankDetails?customerName=${loggedInCustomerName}`
            );
            
            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            const filteredData = data.filter(item => 
                item.Bank_CustomerName && 
                item.Bank_CustomerName.toLowerCase() === loggedInCustomerName.toLowerCase()
            );
            
            setBankList(filteredData);
        } catch (error) {
            console.error("Error fetching bank list:", error);
        } finally {
            setFetchingList(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    const getInitial = () => {
        const name = user ? `${user.firstName}` : loggedInCustomerName;
        return name ? name.charAt(0).toUpperCase() : 'G';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const processedValue = name === 'BankIFSCCode' ? value.toUpperCase() : value;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : processedValue
        });
    };

    const validateForm = () => {
        const accountRegex = /^\d{9,18}$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (!formData.BankName.trim()) {
            return "Bank name is required";
        }
        if (!accountRegex.test(formData.BankAccountNumber)) {
            return "Invalid Bank Account Number (Must be 9 to 18 digits)";
        }
        if (formData.BankAccountNumber !== formData.ConfirmBankAccountNumber) {
            return "Account numbers do not match";
        }
        if (!ifscRegex.test(formData.BankIFSCCode)) {
            return "Invalid IFSC Code format";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const validationError = validateForm();
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                Bank_CustomerName: loggedInCustomerName,
                BankRefundableAmount: formData.BankRefundableAmount ? parseFloat(formData.BankRefundableAmount) : 0
            };

            const response = await axios.post(
                "https://ecommerencesite.onrender.com/api/BankRefundableAmountAPI/AddBankRefundableAmount",
                payload
            );

            setMessage({ 
                type: 'success', 
                text: response.data.message || 'Bank Refundable Amount added successfully!' 
            });

            setBankList((prevList) => [payload, ...prevList]);

            setFormData({
                Bank_CustomerName: loggedInCustomerName,
                BankName: '',
                BankAccountNumber: '',
                ConfirmBankAccountNumber: '',
                BankIFSCCode: '',
                BankBranchName: '',
                BankBranchAddress: '',
                BankBranchCity: '',
                BankBranchState: ''
            });

        } catch (error) {
            console.error("API Error Details:", error.response || error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to submit data.';
            setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '10px',
        border: '1px solid #edf2f7',
        borderRadius: '8px',
        color: '#2d3748',
        backgroundColor: '#f8fafc',
        fontSize: '14px',
        outline: 'none',
        width: '100%'
    };

    const thTdStyle = {
        padding: '12px',
        borderBottom: '1px solid #edf2f7',
        textAlign: 'left',
        fontSize: '13px',
        color: '#2d3748'
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#f7fafc', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            
            {/* --- MODERN SIDEBAR --- */}
            <div className="modern-sidebar" style={{ width: '280px', height: '100vh', backgroundColor: '#ffffff', borderRight: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', position: 'fixed', left: 0, top: 0, zIndex: 100, overflowY: 'auto' }}>
                <div>
                    {/* Logo & Brand */}
                    <Link to="/dashboards" className="modern-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px', textDecoration: 'none' }}>
                        <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        <span style={{ fontWeight: '700', color: '#0fa462', fontSize: '1.25rem', letterSpacing: '-0.5px' }}>AK Medistore</span>
                    </Link>

                    {/* Nav List */}
                    <ul className="modern-nav-menu" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        
                        {/* Dashboard Accordion */}
                        <li>
                            <button
                                className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
                                onClick={() => setOpenDashboard(!openDashboard)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: isActive("/dashboards") ? '#0fa462' : 'transparent', color: isActive("/dashboards") ? '#fff' : '#2d3748', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left' }}
                            >
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-chart-pie" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Dashboard</span>
                                </div>
                                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
                            </button>

                            {openDashboard && (
                                <ul className="modern-submenu" style={{ listStyle: 'none', paddingLeft: '34px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li><Link to="/medication-tracker" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Medication Tracker</Link></li>
                                    <li><Link to="/test-reports" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Test Reports</Link></li>
                                    <li><Link to="/health-history" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Health History</Link></li>
                                    <li><Link to="/monthly-progress" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Monthly Progress</Link></li>
                                    <li><Link to="/prescriptions" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Prescriptions</Link></li>
                                    <li><Link to="/history" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>History</Link></li>
                                    <li><Link to="/support" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Help & Support</Link></li>
                                    <li><Link to="/settings" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>Settings</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Master Update Accordion */}
                        <li>
                            <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#fafafa', border: '1px solid #edf2f7', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-pen-to-square" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Master Update</span>
                                </div>
                                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
                            </button>
                            {openMasterUpdate && (
                                <ul className="modern-submenu" style={{ listStyle: 'none', paddingLeft: '34px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <li><Link to="/deliveryaddress" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
                                    <li><Link to="/addbankrefundableamounts" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                                    <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Medicines */}
                        <li>
                            <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-pills" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Medicines</span>
                                </div>
                            </Link>
                        </li>

                        {/* My Cart Link */}
                        <li>
                            <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-shopping-cart" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>My Cart</span>
                                </div>
                                {cartItems.length > 0 && (
                                    <span className="badge bg-danger rounded-pill" style={{ backgroundColor: '#e53e3e', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>{cartItems.length}</span>
                                )}
                            </Link>
                        </li>

                        {/* Order Status */}
                        <li>
                            <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-truck" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Order Status</span>
                                </div>
                            </Link>
                        </li>

                        {/* Customer Feedback */}
                        <li>
                            <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-comment-dots" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Customer Feedback</span>
                                </div>
                            </Link>
                        </li>

                        {/* Unavailable Add Medicine */}
                        <li>
                            <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-circle-exclamation" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Unavailable Medicines</span>
                                </div>
                            </Link>
                        </li>

                        {/* Customer Profile */}
                        <li>
                            <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', color: '#2d3748' }}>
                                <div className="modern-link-content" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <i className="fa-solid fa-user" style={{ width: '20px', textAlign: 'center' }}></i>
                                    <span>Customer Profile</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Footer Section */}
                <div className="modern-sidebar-footer" style={{ borderTop: '1px solid #edf2f7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Active User profile card */}
                    <div className="modern-user-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                        <div className="modern-avatar" style={{ width: '38px', height: '38px', backgroundColor: '#e8f7f0', color: '#0fa462', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                            {getInitial()}
                        </div>
                        <div className="modern-user-info" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span className="modern-user-name" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user ? `${user.firstName} ${user.lastName}` : loggedInCustomerName}
                            </span>
                            <span className="modern-user-role" style={{ fontSize: '0.75rem', color: '#718096', fontWeight: '500' }}>Customer Account</span>
                        </div>
                    </div>

                    {/* LogOut Link */}
                    <Link to="/header" className="modern-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', color: '#e53e3e', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', borderRadius: '10px' }}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Log Out</span>
                    </Link>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div style={{ marginLeft: '280px', padding: '32px', width: 'calc(100% - 280px)', boxSizing: 'border-box' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', border: '1px solid #edf2f7' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2d3748' }}>Add & View Bank Refundable Details</h2>
                    
                    {message.text && (
                        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Customer Name</label>
                            <input 
                                type="text" 
                                name="Bank_CustomerName" 
                                value={formData.Bank_CustomerName} 
                                onChange={handleChange}
                                required 
                                placeholder="Enter customer name" 
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Bank Name <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                name="BankName" 
                                value={formData.BankName} 
                                onChange={handleChange} 
                                required 
                                maxLength="100"
                                placeholder="e.g., State Bank of India" 
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Account Number <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="password" 
                                name="BankAccountNumber" 
                                value={formData.BankAccountNumber} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter 9-18 digit account number" 
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Confirm Account Number <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                name="ConfirmBankAccountNumber" 
                                value={formData.ConfirmBankAccountNumber} 
                                onChange={handleChange} 
                                required 
                                placeholder="Re-enter account number" 
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>IFSC Code <span style={{ color: 'red' }}>*</span></label>
                            <input 
                                type="text" 
                                name="BankIFSCCode" 
                                value={formData.BankIFSCCode} 
                                onChange={handleChange} 
                                required 
                                placeholder="e.g., SBIN0001234" 
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Branch Name</label>
                                <input type="text" name="BankBranchName" value={formData.BankBranchName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Branch City</label>
                                <input type="text" name="BankBranchCity" value={formData.BankBranchCity} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Branch State</label>
                                <input type="text" name="BankBranchState" value={formData.BankBranchState} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label style={{ fontWeight: '600', marginBottom: '6px', color: '#4a5568', fontSize: '0.9rem' }}>Branch Address</label>
                                <input type="text" name="BankBranchAddress" value={formData.BankBranchAddress} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ width: '100%', padding: '12px', backgroundColor: '#0fa462', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Submitting...' : 'Save Bank Details'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}