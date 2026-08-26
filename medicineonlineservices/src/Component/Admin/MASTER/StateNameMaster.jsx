import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function StateNameMaster() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [stateName, setStateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Side menu dropdown & shop toggle states
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Fetch all states using AllStateName API endpoint
  const fetchStates = async () => {
    try {
      const response = await axios.get('https://ecommerencesite.onrender.com/api/State_CityModelAPI/AllStateName');
      console.log("States API Response:", response.data);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
      Swal.fire('Error', 'Failed to fetch states', 'error');
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Robust Dynamic Helper function to extract state name from any object structure
  const getStateName = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    
    const keys = Object.keys(item);
    for (let key of keys) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('name') || 
        lowerKey.includes('title') || 
        lowerKey.includes('state') || 
        lowerKey.includes('text') ||
        lowerKey.includes('description')
      ) {
        if (item[key] && typeof item[key] === 'string' && item[key].trim() !== '') {
          return item[key];
        }
      }
    }

    for (let key of keys) {
      const lowerKey = key.toLowerCase();
      if (!lowerKey.includes('id') && typeof item[key] === 'string' && item[key].trim() !== '') {
        return item[key];
      }
    }

    return '';
  };

  // Handle Add or Update State with Duplicate Prevention Check
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = stateName.trim();
    if (!trimmedName) {
      Swal.fire('Warning', 'Please enter a state name', 'warning');
      return;
    }

    // Duplicate Check Logic
    const isDuplicate = states.some((item) => {
      const existingName = getStateName(item).trim().toLowerCase();
      // Agar edit mode me hain, toh current editing ID wale ko duplicate count nahi karna hai
      if (isEditing) {
        const itemId = item.id || item.stateId || item.stateID;
        if (itemId === editId) return false;
      }
      return existingName === trimmedName.toLowerCase();
    });

    if (isDuplicate) {
      Swal.fire('Duplicate Warning', 'This state name already exists in the list!', 'warning');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          'https://ecommerencesite.onrender.com/api/State_CityModelAPI/UpdateStateName',
          { id: editId, stateId: editId, stateName: trimmedName, name: trimmedName },
          { headers: { 'Content-Type': 'application/json' } }
        );
        Swal.fire('Success', 'State updated successfully', 'success');
        setIsEditing(false);
        setEditId(null);
      } else {
        try {
          await axios.post(
            `https://ecommerencesite.onrender.com/api/State_CityModelAPI/AddStateName?StateName=${encodeURIComponent(trimmedName)}&name=${encodeURIComponent(trimmedName)}`,
            { 
              stateName: trimmedName, 
              name: trimmedName,
              StateName: trimmedName 
            },
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (err) {
          const formData = new FormData();
          formData.append('StateName', trimmedName);
          formData.append('name', trimmedName);
          await axios.post(
            `https://ecommerencesite.onrender.com/api/State_CityModelAPI/AddStateName`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }

        Swal.fire('Success', 'State added successfully', 'success');
      }
      setStateName('');
      fetchStates();
    } catch (error) {
      console.error('Error saving state details:', error.response || error);
      const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Something went wrong';
      Swal.fire('Error', typeof errorMsg === 'string' ? errorMsg : 'Failed to save state', 'error');
    }
  };

  // Handle Edit Click
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id || item.stateId || item.stateID);
    setStateName(getStateName(item));
  };

  // Handle Delete Click with SweetAlert2 Confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://ecommerencesite.onrender.com/api/State_CityModelAPI/DeleteStateName?Id=${id}`);
          Swal.fire('Deleted!', 'State has been deleted.', 'success');
          fetchStates();
        } catch (error) {
          console.error('Error deleting state:', error);
          Swal.fire('Error', 'Failed to delete state', 'error');
        }
      }
    });
  };

  // Handle Details Click with DetailsStateName API endpoint integration
  const handleDetails = async (item) => {
    const sId = item.id || item.stateId || item.stateID;
    try {
      const response = await axios.get(`https://ecommerencesite.onrender.com/api/State_CityModelAPI/DetailsStateName?id=${sId}`);
      const data = response.data;
      
      const stateIdVal = data.id || data.stateId || sId;
      const nameVal = getStateName(data) || 'N/A';

      Swal.fire({
        title: 'State Details',
        html: `<p><strong>ID:</strong> ${stateIdVal}</p><p><strong>State Name:</strong> ${nameVal}</p>`,
        icon: 'info',
        confirmButtonColor: '#28a745'
      });
    } catch (error) {
      console.error('Error fetching details:', error);
      const fallbackName = getStateName(item) || 'N/A';
      Swal.fire({
        title: 'State Details',
        html: `<p><strong>ID:</strong> ${sId}</p><p><strong>State Name:</strong> ${fallbackName}</p>`,
        icon: 'info',
        confirmButtonColor: '#28a745'
      });
    }
  };

  // Excel File Download function (CSV format)
  const downloadExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,State Name\n";
    states.forEach((item, index) => {
      const id = item.id || item.stateId || item.stateID || (index + 1);
      const name = getStateName(item);
      csvContent += `${id},"${name}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "state_names.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire('Success', 'Excel/CSV file downloaded successfully!', 'success');
  };

  // Search filter logic
  const filteredStates = states.filter((item) => {
    const name = getStateName(item).toString().toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStates = filteredStates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStates.length / itemsPerPage) || 1;

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ backgroundColor: '#181a1b', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex' }}>
      
      {/* SIDE MENU BAR */}
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
                 <i className="fas fa-language"></i>  Accountant Master Types  
               </Link>

          



               
                    
             </div>
           )}
         </div>
 
         <ul className="nav flex-column">
           <li className="mb-3">
             <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between align-items-center" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
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

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '260px', padding: '30px', flex: 1, minWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '30px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
          
          {/* Add/Edit State Form Section */}
          <div style={{ backgroundColor: '#212529', padding: '20px', borderRadius: '8px', width: '320px', height: 'fit-content', border: '1px solid #32383e' }}>
            <h3 style={{ color: '#28a745', marginTop: '0', marginBottom: '20px', fontSize: '18px' }}>
              {isEditing ? 'Edit State Name' : 'Add State Name'}
            </h3>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>State Name:</label>
              <input 
                type="text" 
                placeholder="e.g., Bihar, Punjab, Delhi" 
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#2b3035', border: '1px solid #495057', borderRadius: '4px', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}
              />
              <button 
                type="submit"
                style={{ width: '100%', padding: '10px', backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
              >
                {isEditing ? 'Update State' : 'Add State'}
              </button>
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => { setIsEditing(false); setStateName(''); }}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* State Management Table Section */}
          <div style={{ backgroundColor: '#212529', padding: '20px', borderRadius: '8px', flex: 1, minWidth: '450px', border: '1px solid #32383e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#28a745', margin: '0', fontSize: '18px' }}>State Management Table</h3>
              
              {/* Search and Excel Download Controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="Search state..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ padding: '6px 10px', backgroundColor: '#2b3035', border: '1px solid #495057', borderRadius: '4px', color: '#fff', fontSize: '14px' }}
                />
                <button 
                  type="button"
                  onClick={downloadExcel}
                  style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  Excel Export
                </button>
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #32383e', color: '#aaa', fontSize: '14px' }}>
                  <th style={{ padding: '12px 8px', width: '15%' }}>ID</th>
                  <th style={{ padding: '12px 8px', width: '35%' }}>State Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', width: '50%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStates.length > 0 ? (
                  currentStates.map((item, index) => {
                    const stateId = item.id || item.stateId || item.stateID || (indexOfFirstItem + index + 1);
                    const nameVal = getStateName(item);
                    return (
                      <tr key={stateId} style={{ borderBottom: '1px solid #2b3035', fontSize: '14px' }}>
                        <td style={{ padding: '12px 8px', color: 'red' }}>{stateId}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: "red" }}>{nameVal || 'N/A'}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button type="button" onClick={() => handleDetails(item)} style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', marginRight: '4px', cursor: 'pointer', fontSize: '12px' }}>Details</button>
                          <button type="button" onClick={() => handleEdit(item)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '5px 8px', borderRadius: '4px', marginRight: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                          <button type="button" onClick={() => handleDelete(stateId)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Del</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>No states found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
              <button 
                type="button"
                onClick={handlePrevious} 
                disabled={currentPage === 1}
                style={{ backgroundColor: '#343a40', color: currentPage === 1 ? '#6c757d' : '#fff', border: '1px solid #495057', padding: '6px 12px', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>

              <span style={{ backgroundColor: '#28a745', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold' }}>
                {currentPage}
              </span>

              <button 
                type="button"
                onClick={handleNext} 
                disabled={currentPage >= totalPages}
                style={{ backgroundColor: '#343a40', color: currentPage >= totalPages ? '#6c757d' : '#fff', border: '1px solid #495057', padding: '6px 12px', borderRadius: '4px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}