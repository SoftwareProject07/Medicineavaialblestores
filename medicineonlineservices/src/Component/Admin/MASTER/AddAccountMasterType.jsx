import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

//const API_BASE_URL = "http://localhost:5256/api/CustomerAccountantAccountAPI";
const API_BASE_URL = "https://ecommerencesite.onrender.com/api/CustomerAccountantAccountAPI";

export default function AddAccountMasterType() {
  const navigate = useNavigate();
  const [accountTypes, setAccountTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeName, setAccountTypeName] = useState('');
  
  // Sidebar states
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Fetch all account types list data
  const fetchAccountTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/AllCustomerAccounts`);
      setAccountTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching account types:", error);
    }
  };

  // Handle Form Submit (Create or Update) sending only AccountType and optional empty other fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountTypeName.trim()) return;

    try {
      const payload = {
        id: editId || 0,
        Id: editId || 0,
        accountType: accountTypeName,
        AccountType: accountTypeName,
        customerName: null,
        email: null,
        phone: null,
        openingBalance: null,
        currentBalance: null,
        createdByAccountant: null
      };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/UpdateCustomerAccount`, payload);
        alert("Account Type updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/CreateCustomerAccount`, payload);
        alert("Account Type created successfully!");
      }

      setAccountTypeName('');
      setIsEditing(false);
      setEditId(null);
      fetchAccountTypes();
    } catch (error) {
      console.error("Error saving account type:", error.response?.data || error.message);
      const serverMessage = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.title || error.message || "Check backend connection.";
      alert(`Operation failed: ${serverMessage}`);
    }
  };

  // Handle Edit selection (Direct state assignment without using Details API call)
  const handleEditClick = (item) => {
    const name = item.accountType || item.AccountType || '';
    const id = item.id || item.Id;
    setAccountTypeName(name);
    setEditId(id);
    setIsEditing(true);
  };

  // Handle Delete API
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this Account Type?")) {
      try {
        await axios.delete(`${API_BASE_URL}/DeleteCustomerAccount?id=${id}`);
        alert("Account Type deleted successfully!");
        fetchAccountTypes();
      } catch (error) {
        console.error("Error deleting account type:", error);
        alert("Failed to delete record.");
      }
    }
  };

  // Filter list data based on searching query
  const filteredAccountTypes = accountTypes.filter(item => {
    const name = item.accountType || item.AccountType || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
        
       {/* SIDEBAR NAVIGATION */}
       <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
         <div className="brand mb-4 d-flex align-items-center">
           <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
           <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
         </div>
 
         <div className="mb-3 border-bottom border-secondary pb-3">
           <button 
             type="button"
             onClick={() => setMasterDropdownOpen(!masterDropdownOpen)} 
             className="btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center fw-bold mb-2" 
             style={{ fontSize: '13px', borderStyle: 'dashed' }}
           >
             <span className="d-flex align-items-center gap-2">
               <i className="fas fa-sliders-h"></i> Master Config
             </span>
             <i className={`fas ${masterDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: '11px' }}></i>
           </button>
           
           {masterDropdownOpen && (
             <div className="ps-1 mt-2">
               <Link to="/adminissuetype" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-plus-circle"></i> Add Item Type
               </Link>
               <Link to="/adminmasterassignedto" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-plus-circle"></i> AddAssignedTO 
               </Link>
                {/* <Link to="/doctorassignto" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-plus-circle"></i> AddDoctorAssignTo 
               </Link> */}
               <Link to="/addadmintypes" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-plus-circle"></i> AddAdminTypes 
               </Link>
               <Link to="/languagematerpanels" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-language"></i> Language Master
               </Link>
               <Link to="/statenamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-language"></i> StateName Master
               </Link>  
               <Link to="/citynamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-language"></i> CityName Master 
               </Link>
               <Link to="/addaccountmastertypes" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-language"></i> Accountant Master Types 
               </Link>
             </div>
           )}
         </div>
 
         <ul className="nav flex-column">
           <li className="mb-3">
             <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
               <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
               <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
             </div>
           </li>
           <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
           <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
           <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
           <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
           <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
           <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
           <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
           <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>
           <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails </Link></li> 
           {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li> */}
           <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
           <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
           <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
           <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
           <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>
           <li><Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists</Link></li>
           <li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
           <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li> 
           <li className="mt-3">
             <button type="button" onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
               <i className="fas fa-sign-out-alt"></i> LogOut
             </button>
           </li>
         </ul>
       </div>

       {/* MAIN CONTENT CONTAINER */}
       <div style={{ marginLeft: '260px', flex: '1', padding: '30px', backgroundColor: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
         <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
           
           {/* Left Box: Add / Edit Account Type Form */}
           <div style={{ 
             backgroundColor: '#1a1a1e', 
             border: '1px solid #2a2a30', 
             borderRadius: '8px', 
             padding: '24px', 
             width: '320px', 
             height: 'fit-content' 
           }}>
             <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
               {isEditing ? 'Edit Account Type' : 'Add Account Type'}
             </h3>
             
             <form onSubmit={handleSubmit}>
               <div style={{ marginBottom: '16px' }}>
                 <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
                   Account Type Name:
                 </label>
                 <input 
                   type="text" 
                   placeholder="e.g., Receivable / Payable" 
                   value={accountTypeName}
                   onChange={(e) => setAccountTypeName(e.target.value)}
                   style={{ 
                     width: '100%', 
                     padding: '10px 12px', 
                     backgroundColor: '#121212', 
                     border: '1px solid #333', 
                     borderRadius: '6px', 
                     color: '#fff', 
                     fontSize: '14px',
                     outline: 'none'
                   }}
                   required 
                 />
               </div>

               <button 
                 type="submit" 
                 style={{ 
                   width: '100%', 
                   backgroundColor: '#22c55e', 
                   color: '#fff', 
                   border: 'none', 
                   padding: '10px', 
                   borderRadius: '6px', 
                   fontWeight: 'bold', 
                   cursor: 'pointer',
                   transition: 'background 0.2s'
                 }}
               >
                 {isEditing ? 'Update Account Type' : 'Add Account Type'}
               </button>

               {isEditing && (
                 <button 
                   type="button" 
                   onClick={() => { setIsEditing(false); setAccountTypeName(''); setEditId(null); }}
                   style={{ 
                     width: '100%', 
                     backgroundColor: 'transparent', 
                     color: '#94a3b8', 
                     border: '1px solid #475569', 
                     padding: '8px', 
                     borderRadius: '6px', 
                     fontWeight: 'bold', 
                     cursor: 'pointer',
                     marginTop: '8px'
                   }}
                 >
                   Cancel
                 </button>
               )}
             </form>
           </div>

           {/* Right Box: Management Table & Searching */}
           <div style={{ 
             backgroundColor: '#1a1a1e', 
             border: '1px solid #2a2a30', 
             borderRadius: '8px', 
             padding: '24px', 
             flex: '1', 
             minWidth: '350px' 
           }}>
             <div style={{ display: 'flex', justifyContent: 'space-linejoin', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
               <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                 Account Type Management Table
               </h3>
               
               {/* Searching Input Bar */}
               <input 
                 type="text" 
                 placeholder="Search account type..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{ 
                   padding: '8px 12px', 
                   backgroundColor: '#121212', 
                   border: '1px solid #333', 
                   borderRadius: '6px', 
                   color: '#fff', 
                   fontSize: '13px',
                   outline: 'none',
                   width: '220px'
                 }}
               />
             </div>

             <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                 <thead>
                   <tr style={{ borderBottom: '1px solid #2a2a30', color: '#94a3b8', fontSize: '13px' }}>
                     <th style={{ padding: '12px' }}>ID</th>
                     <th style={{ padding: '12px' }}>Account Type Name</th>
                     <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredAccountTypes.length > 0 ? (
                     filteredAccountTypes.map((item) => (
                       <tr key={item.id || item.Id} style={{ borderBottom: '1px solid #222', fontSize: '14px' }}>
                         <td style={{ padding: '12px', color: '#94a3b8' }}>{item.id || item.Id}</td>
                         <td style={{ padding: '12px', fontWeight: '500', color: 'red' }}>
                           {item.accountType || item.AccountType}
                         </td>
                         <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                           <button 
                             onClick={() => handleEditClick(item)}
                             style={{ 
                               backgroundColor: '#eab308', 
                               color: '#000', 
                               border: 'none', 
                               padding: '6px 12px', 
                               borderRadius: '4px', 
                               fontSize: '12px', 
                               fontWeight: 'bold', 
                               cursor: 'pointer' 
                             }}
                           >
                             Edit
                           </button>
                           <button 
                             onClick={() => handleDeleteClick(item.id || item.Id)}
                             style={{ 
                               backgroundColor: '#ef4444', 
                               color: '#fff', 
                               border: 'none', 
                               padding: '6px 12px', 
                               borderRadius: '4px', 
                               fontSize: '12px', 
                               fontWeight: 'bold', 
                               cursor: 'pointer' 
                             }}
                           >
                             Del
                           </button>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                         No account types found.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>

         </div>
       </div>

    </div>
  );
}