import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

export default function BankRefundabledetailsList() {
  const location = useLocation();
  const [bankList, setBankList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [editData, setEditData] = useState(null);

  // User state initialization with localStorage fallback
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem('userId') || '',
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    mobileNumber: localStorage.getItem('phone') || '',
    email: localStorage.getItem('email') || ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankConfirmAccountNumber: '',
    bankIFSCCode: '',
    bank_CustomerName: '',
    branchName: '',
    branchCity: '',
    branchState: '',
    branchAddress: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const API_URL = 'https://ecommerencesite.onrender.com/api/BankRefundableAmountAPI/GetAllBankRefundableAmounts';
  const UPDATE_API_URL = 'https://ecommerencesite.onrender.com/api/BankRefundableAmountAPI';
  const USERS_API_URL = 'https://ecommerencesite.onrender.com/api/UserAPI/GetAllUsers';

  useEffect(() => {
    fetchBankDetails();
    verifyAndUpdateUser();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const allData = response.data || [];
      setBankList(allData);
      setFilteredList(allData);
    } catch (error) {
      console.error('Error fetching bank refundable details:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndUpdateUser = async () => {
    const lStorageId = localStorage.getItem('userId');
    const lStoragePhone = localStorage.getItem('phone');
    const lStorageEmail = localStorage.getItem('email') || localStorage.getItem('username');

    try {
      const response = await axios.get(USERS_API_URL);
      const users = response.data || [];
      
      const matchedUser = users.find(u => 
        (lStorageId && String(u.id) === String(lStorageId)) ||
        (lStoragePhone && String(u.mobileNumber) === String(lStoragePhone)) ||
        (lStorageEmail && (u.email === lStorageEmail || u.mobileNumber === lStorageEmail))
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
        localStorage.setItem('userId', matchedUser.id);
        localStorage.setItem('firstName', matchedUser.firstName || '');
        localStorage.setItem('lastName', matchedUser.lastName || '');
        localStorage.setItem('phone', matchedUser.mobileNumber || '');
        localStorage.setItem('email', matchedUser.email || '');
      }
    } catch (error) {
      console.error('Error verifying user session:', error);
    }
  };

  const fName = currentUser.firstName || localStorage.getItem('firstName') || '';
  const lName = currentUser.lastName || localStorage.getItem('lastName') || '';
  const fullName = fName ? `${fName} ${lName}`.trim() : 'User';

  const getInitial = () => {
    return fName ? fName.charAt(0).toUpperCase() : 'U';
  };

  useEffect(() => {
    const results = bankList.filter((item) =>
      Object.values(item).some(
        (val) => val && typeof val !== 'object' && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredList(results);
    setCurrentPage(1);
  }, [searchTerm, bankList]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete these bank details?')) {
      try {
        await axios.delete(`${UPDATE_API_URL}/${id}`).catch(() => {});
        const updatedList = bankList.filter(
          (item) => (item.bankRefundableAmountid || item.id || item.Id || item.BankId) !== id
        );
        setBankList(updatedList);
        setFilteredList(updatedList);
        alert('Deleted successfully!');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setFormData({
      bankName: item.bankName || item.BankName || item.bankname || item.bank_Name || item.Bank_Name || '',
      bankAccountNumber: item.bankAccountNumber || item.BankAccountNumber || item.accountNumber || item.AccountNumber || item.bankRefundableAmount || '',
      bankConfirmAccountNumber: item.bankConfirmAccountNumber || item.BankConfirmAccountNumber || item.confirmAccountNumber || item.ConfirmAccountNumber || item.bankAccountNumber || item.BankAccountNumber || item.bankRefundableAmount || '',
      bankIFSCCode: item.bankIFSCCode || item.BankIFSCCode || item.ifscCode || item.IfscCode || '',
      bank_CustomerName: item.bank_CustomerName || item.Bank_CustomerName || item.customerName || item.CustomerName || item.Name || fullName,
      branchName: item.branchName || item.BranchName || item.branchname || '',
      branchCity: item.branchCity || item.BranchCity || item.branchcity || '',
      branchState: item.branchState || item.BranchState || item.branchstate || '',
      branchAddress: item.branchAddress || item.BranchAddress || item.branchaddress || item.address || item.Address || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;
    const recId = editData.bankRefundableAmountid || editData.id || editData.Id || editData.BankId;

    try {
      setSubmitting(true);
      const payload = {
        bankRefundableAmountid: recId,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankConfirmAccountNumber: formData.bankConfirmAccountNumber,
        bankIFSCCode: formData.bankIFSCCode,
        bank_CustomerName: formData.bank_CustomerName,
        branchName: formData.branchName,
        branchCity: formData.branchCity,
        branchState: formData.branchState,
        branchAddress: formData.branchAddress,
        phone: currentUser?.mobileNumber || localStorage.getItem('phone') || '',
        userId: currentUser?.id || localStorage.getItem('userId') || ''
      };

      await axios.put(`${UPDATE_API_URL}/UpdateBankRefundableAmount/${recId}`, payload).catch(() => {
        return axios.put(`${UPDATE_API_URL}/${recId}`, payload);
      });

      const updatedList = bankList.map((item) => {
        const itemId = item.bankRefundableAmountid || item.id || item.Id || item.BankId;
        if (itemId === recId) {
          return { ...item, ...payload };
        }
        return item;
      });

      setBankList(updatedList);
      setFilteredList(updatedList);
      setIsEditModalOpen(false);
      alert('Bank refundable details updated successfully!');
    } catch (error) {
      console.error('Error updating bank details:', error);
      alert('Failed to update bank details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetails = (item) => {
    setSelectedDetails(item);
  };

  const getCustomerDisplay = (item) => {
    return item.bank_CustomerName || item.Bank_CustomerName || item.customerName || item.CustomerName || item.Name || fullName;
  };

  const getBankNameDisplay = (item) => {
    return item.bankName || item.BankName || item.bankname || item.bank_Name || item.Bank_Name || 'N/A';
  };

  const getAccountNumberDisplay = (item) => {
    return item.bankAccountNumber || item.BankAccountNumber || item.accountNumber || item.AccountNumber || item.bankRefundableAmount || 'N/A';
  };

  const getConfirmAccountNumberDisplay = (item) => {
    return item.bankConfirmAccountNumber || item.BankConfirmAccountNumber || item.confirmAccountNumber || item.ConfirmAccountNumber || item.bankAccountNumber || item.BankAccountNumber || item.bankRefundableAmount || 'N/A';
  };

  const isActive = (path) => location.pathname === path;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredList.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: '#f7fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
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
            <li><Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div></Link></li>
            <li><Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Order Status</span></div></Link></li>
            <li><Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-comment-dots"></i><span>Customer Feedback</span></div></Link></li>
            <li><Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-circle-exclamation"></i><span>Unavailable Medicines</span></div></Link></li>
            <li><Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
          </ul>
        </div>
   
        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">
              {getInitial()}
            </div>
            <div className="modern-user-info">
              <span className="modern-user-name">
                {fullName !== 'User' ? fullName : "Customer Account"}
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

      {/* MAIN CONTENT WORKSPACE */}
      <div style={{ marginLeft: '280px', padding: '32px', width: 'calc(100% - 280px)', boxSizing: 'border-box' }}>
        <h2 style={{ color: '#1a202c', marginBottom: '5px' }}>Bank Refundable Details</h2>
        <p style={{ color: '#718096', marginBottom: '20px' }}>Showing all registered bank refundable records.</p>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by Bank Name, Account Number, Confirm Account, IFSC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>Loading data...</p>
        ) : filteredList.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', fontStyle: 'italic', padding: '40px' }}>No bank refundable details found.</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid #edf2f7' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2b6cb0', color: '#ffffff', textAlign: 'left' }}>
                    <th style={thTdStyle}>ID</th>
                    <th style={thTdStyle}>Customer Name</th>
                    <th style={thTdStyle}>Bank Name</th>
                    <th style={thTdStyle}>Account Number</th>
                    <th style={thTdStyle}>Confirm Account Number</th>
                    <th style={thTdStyle}>IFSC Code</th>
                    <th style={{ ...thTdStyle, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((item, index) => {
                    const recordId = item.bankRefundableAmountid || item.id || item.Id || item.BankId || indexOfFirstRow + index + 1;
                    return (
                      <tr key={recordId} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={thTdStyle}>{recordId}</td>
                        <td style={thTdStyle}>{getCustomerDisplay(item)}</td>
                        <td style={thTdStyle}>{getBankNameDisplay(item)}</td>
                        <td style={thTdStyle}>{getAccountNumberDisplay(item)}</td>
                        <td style={thTdStyle}>{getConfirmAccountNumberDisplay(item)}</td>
                        <td style={thTdStyle}>{item.bankIFSCCode || item.BankIFSCCode || item.ifscCode || item.IfscCode || 'N/A'}</td>
                        <td style={{ ...thTdStyle, textAlign: 'center' }}>
                          <button onClick={() => handleDetails(item)} style={{ ...actionBtnStyle, backgroundColor: '#3182ce' }}>Details</button>
                          <button onClick={() => handleEdit(item)} style={{ ...actionBtnStyle, backgroundColor: '#d69e2e' }}>Edit</button>
                          <button onClick={() => handleDelete(recordId)} style={{ ...actionBtnStyle, backgroundColor: '#e53e3e' }}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredList.length)} of {filteredList.length} entries
              </p>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ ...paginationBtnStyle, backgroundColor: currentPage === 1 ? '#e2e8f0' : '#2b6cb0', color: '#fff' }}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button key={number} onClick={() => setCurrentPage(number)} style={{ ...paginationBtnStyle, backgroundColor: currentPage === number ? '#1a202c' : '#edf2f7', color: currentPage === number ? '#fff' : '#2d3748' }}>{number}</button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...paginationBtnStyle, backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#2b6cb0', color: '#fff' }}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '500px' }}>
            <h3 style={{ marginBottom: '16px', color: '#1a202c' }}>Edit Bank Refundable Details</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Customer Name</label>
                <input type="text" value={formData.bank_CustomerName} onChange={(e) => setFormData({ ...formData, bank_CustomerName: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Bank Name *</label>
                <input type="text" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Account Number *</label>
                <input type="text" value={formData.bankAccountNumber} onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Confirm Account Number *</label>
                <input type="text" value={formData.bankConfirmAccountNumber} onChange={(e) => setFormData({ ...formData, bankConfirmAccountNumber: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>IFSC Code *</label>
                <input type="text" value={formData.bankIFSCCode} onChange={(e) => setFormData({ ...formData, bankIFSCCode: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ ...actionBtnStyle, backgroundColor: '#718096', flex: 1, padding: '10px' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ ...actionBtnStyle, backgroundColor: '#0fa462', flex: 1, padding: '10px' }}>{submitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const thTdStyle = { padding: '14px 16px', fontSize: '0.9rem', color: '#2d3748', fontWeight: '600' };
const actionBtnStyle = { padding: '6px 12px', margin: '0 3px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' };
const paginationBtnStyle = { padding: '6px 12px', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '0.95rem', boxSizing: 'border-box' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '400px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };