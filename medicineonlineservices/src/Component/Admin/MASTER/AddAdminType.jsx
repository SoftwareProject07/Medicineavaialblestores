import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AddAdminType() {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newType, setNewType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Sidebar States & Hooks
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchTypes = async () => {
    try {
      const response = await axios.get("https://ecommerencesite.onrender.com/api/AdminApi/AllTypeList");
      console.log("Fetched Types:", response.data);
      setTypes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // 1. ADD TYPE
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newType.trim()) return;
    try {
      await axios.post(
        'https://ecommerencesite.onrender.com/api/AdminApi/AddAdminType',
        { type: newType },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNewType('');
      fetchTypes();
    } catch (error) {
      console.error('Error adding type:', error);
    }
  };

  // 2. DELETE TYPE
  const handleDelete = async (admintypeid) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`https://ecommerencesite.onrender.com/api/AdminApi/DeleteType?id=${admintypeid}`);
      fetchTypes();
    } catch (error) {
      console.error('Error deleting type:', error);
      alert("Delete failed! Check backend CORS/Error.");
    }
  };

  // 3. UPDATE TYPE
  const handleUpdate = async (admintypeid) => {
    if (!editingValue.trim()) {
      alert("Please enter a valid type name");
      return;
    }

    try {
      const numericId = Number(admintypeid);

      await axios.put(
        `https://ecommerencesite.onrender.com/api/AdminApi/updatetype?admintypeid=${numericId}`,
        { 
          admintypeid: numericId, 
          type: editingValue 
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setEditingId(null);
      setEditingValue('');
      fetchTypes();
    } catch (error) {
      console.error('Error updating type:', error);
      alert("Update failed! Check console.");
    }
  };

  // 4. DETAILS TYPE
  const handleDetails = async (admintypeid) => {
    try {
      console.log("Fetching details for ID:", admintypeid);
      const response = await axios.get(
        `https://ecommerencesite.onrender.com/api/AdminApi/DetailsType?id=${admintypeid}`
      );
      console.log("Details Response:", response.data);
      setSelectedDetails(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      alert("Could not fetch details.");
    }
  };

  const filteredTypes = types.filter((item) => {
    const val = typeof item === 'string' ? item : item.type || item.Type || item.name || '';
    return val.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTypes.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTypes.slice(indexOfFirstRow, indexOfLastRow);

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
               <Link to="/doctorassignto" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                 <i className="fas fa-plus-circle"></i> AddDoctorAssignTo 
               </Link>
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
                                               <i className="fas fa-language"></i>      CityName Master 
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
           <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li>
           <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
           <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
           <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
           <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
           <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>
           <li><Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists</Link></li>
           <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>
 
           <li className="mt-3">
             <button type="button" onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
               <i className="fas fa-sign-out-alt"></i> LogOut
             </button>
           </li>
         </ul>
       </div>

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)', color: '#fff' }}>
        <h2>Manage Admin Types</h2>

        <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter new type..."
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '250px', background: '#1e1e24', color: '#fff', border: '1px solid #2d2d37' }}
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#198754', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Add Type
          </button>
        </form>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', width: '300px', background: '#1e1e24', color: '#fff', border: '1px solid #2d2d37' }}
          />
        </div>

        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', background: '#16161a' }}>
          <thead>
            <tr style={{ background: '#232329' }}>
              <th>Admin Type ID</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((item, index) => {
                const admintypeid = item.admintypeid || item.AdminTypeId || item.id || (indexOfFirstRow + index + 1);
                const typeVal = typeof item === 'string' ? item : item.type || item.Type || item.name || '';

                return (
                  <tr key={admintypeid} style={{ borderBottom: '1px solid #232329' }}>
                    <td>{admintypeid}</td>
                    <td>
                      {editingId === admintypeid ? (
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          style={{ background: '#1e1e24', color: '#fff', border: '1px solid #2d2d37', padding: '4px' }}
                        />
                      ) : (
                        typeVal
                      )}
                    </td>
                    <td>
                      {editingId === admintypeid ? (
                        <button onClick={() => handleUpdate(admintypeid)} style={{ marginRight: '5px', background: 'green', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Save</button>
                      ) : (
                        <button onClick={() => { setEditingId(admintypeid); setEditingValue(typeVal); }} style={{ marginRight: '5px', background: '#ffc107', color: '#000', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                          
                              <i className="fas fa-edit"></i> 
                          </button>
                      )}
                      <button onClick={() => handleDelete(admintypeid)} style={{ marginRight: '5px', background: 'red', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                        <i className="fas fa-trash-alt"></i> 
                      </button>
                      <button onClick={() => handleDetails(admintypeid)} style={{ background: '#0dcaf0', color: '#000', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                        <i className="fas fa-info-circle"></i> 
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Details View Box */}
        {selectedDetails && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #2d2d37', background: '#16161a', borderRadius: '6px' }}>
            <h3>Details View</h3>
            <pre style={{ color: '#fff', background: '#000', padding: '10px' }}>{JSON.stringify(selectedDetails, null, 2)}</pre>
            <button onClick={() => setSelectedDetails(null)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', marginTop: '10px' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}