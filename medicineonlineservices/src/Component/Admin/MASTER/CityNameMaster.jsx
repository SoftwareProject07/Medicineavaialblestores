import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CityNameMaster() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [cityName, setCityName] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [masterDropdownOpen, setMasterDropdownOpen] = useState(true);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getSubLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `position-relative text-decoration-none py-1.5 px-2 mb-1 rounded d-block transition-all ${
      isActive ? 'text-white fw-bold bg-secondary bg-opacity-25' : 'text-white-50 hover-text-white'
    }`;
  };

  const getNameValue = (item, type) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    
    if (type === 'state') {
      return (
        item.statename || 
        item.stateName || 
        item.StateName || 
        item.state_name || 
        item.state || 
        item.State || 
        item.name || 
        item.Name || 
        ''
      );
    } else if (type === 'city') {
      return (
        item.cityname || 
        item.cityName || 
        item.CityName || 
        item.city_name || 
        item.city || 
        item.City || 
        item.name || 
        item.Name || 
        ''
      );
    }
    return '';
  };

  const getIdValue = (item, fallbackIndex = null) => {
    if (!item) return fallbackIndex;
    if (typeof item !== 'object') return item;
    return item.cityid || item.CityId || item.cityID || item.CityID || item.id || item.Id || item.ID || item._id || item.City_Id || fallbackIndex;
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get('https://ecommerencesite.onrender.com/api/State_CityModelAPI/AllStateName');
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('https://ecommerencesite.onrender.com/api/State_CityModelAPI/AllCityName');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCity = cityName.trim();

    if (!selectedState) {
      Swal.fire('Warning', 'Please select a state name from dropdown', 'warning');
      return;
    }
    if (!trimmedCity) {
      Swal.fire('Warning', 'Please enter a city name', 'warning');
      return;
    }

    const isDuplicate = cities.some((item, index) => {
      const currentId = getIdValue(item, index + 1);
      if (isEditing && String(currentId) === String(editId)) {
        return false;
      }
      const existingState = getNameValue(item, 'state').trim().toLowerCase();
      const existingCity = getNameValue(item, 'city').trim().toLowerCase();
      return existingState === selectedState.trim().toLowerCase() && existingCity === trimmedCity.toLowerCase();
    });

    if (isDuplicate) {
      Swal.fire('Duplicate Error', `City "${trimmedCity}" already exists under state "${selectedState}"!`, 'error');
      return;
    }

    try {
      if (isEditing) {
        const updatePayload = {
          cityid: Number(editId),
          id: Number(editId),
          statename: selectedState,
          cityname: trimmedCity
        };

        await axios.put(
          `https://ecommerencesite.onrender.com/api/State_CityModelAPI/UpdateCityName`,
          updatePayload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        Swal.fire('Success', 'City updated successfully', 'success');
        setIsEditing(false);
        setEditId(null);
      } else {
        const addPayload = {
          statename: selectedState,
          cityname: trimmedCity
        };

        await axios.post(
          `https://ecommerencesite.onrender.com/api/State_CityModelAPI/AddCityName`,
          addPayload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        Swal.fire('Success', 'City added successfully', 'success');
      }
      setCityName('');
      setSelectedState('');
      fetchCities();
    } catch (error) {
      console.error('Error saving city details:', error.response || error);
      Swal.fire('Error', 'Failed to save city details. Please check connection or backend.', 'error');
    }
  };

  const handleEdit = async (item, index) => {
    const targetId = getIdValue(item, index + 1);
    
    setIsEditing(true);
    setEditId(targetId);
    setSelectedState(getNameValue(item, 'state'));
    setCityName(getNameValue(item, 'city'));

    if (!targetId) return;

    try {
      const response = await axios.get(`https://ecommerencesite.onrender.com/api/State_CityModelAPI/DetailsCityName?id=${targetId}`);
      const data = response.data;
      if (data) {
        setSelectedState(getNameValue(data, 'state') || getNameValue(item, 'state'));
        setCityName(getNameValue(data, 'city') || getNameValue(item, 'city'));
      }
    } catch (error) {
      console.error('Error fetching city details for edit:', error);
    }
  };

  const handleViewDetails = async (item, index) => {
    const targetId = getIdValue(item, index + 1);
    if (!targetId) {
      Swal.fire('Error', 'City ID not found', 'error');
      return;
    }

    try {
      const response = await axios.get(`https://ecommerencesite.onrender.com/api/State_CityModelAPI/DetailsCityName?id=${targetId}`);
      const data = response.data;
      const sName = getNameValue(data, 'state') || getNameValue(item, 'state');
      const cName = getNameValue(data, 'city') || getNameValue(item, 'city');

      Swal.fire({
        title: 'City Details',
        html: `<div style="text-align: left; font-size: 15px; padding: 10px;">
                <p><b>ID:</b> ${targetId}</p>
                <p><b>State Name:</b> ${sName}</p>
                <p><b>City Name:</b> ${cName}</p>
              </div>`,
        icon: 'info',
        confirmButtonColor: '#28a745'
      });
    } catch (error) {
      Swal.fire({
        title: 'City Details',
        html: `<div style="text-align: left; font-size: 15px; padding: 10px;">
                <p><b>ID:</b> ${targetId}</p>
                <p><b>State Name:</b> ${getNameValue(item, 'state')}</p>
                <p><b>City Name:</b> ${getNameValue(item, 'city')}</p>
              </div>`,
        icon: 'info',
        confirmButtonColor: '#28a745'
      });
    }
  };

  const handleDelete = async (item, index) => {
    const targetId = getIdValue(item, index + 1);
    
    if (!targetId) {
      Swal.fire('Error', 'Invalid City ID for deletion', 'error');
      return;
    }

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
          await axios.delete(`https://ecommerencesite.onrender.com/api/State_CityModelAPI/DeleteCityName?id=${targetId}`);
          Swal.fire('Deleted!', 'City has been deleted.', 'success');
          fetchCities();
        } catch (error) {
          console.error('Error deleting city:', error);
          Swal.fire('Error', 'Failed to delete city', 'error');
        }
      }
    });
  };

  const filteredCities = cities.filter((item) => {
    const sName = getNameValue(item, 'state').toLowerCase();
    const cName = getNameValue(item, 'city').toLowerCase();
    return sName.includes(searchQuery.toLowerCase()) || cName.includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = filteredCities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCities.length / itemsPerPage) || 1;

  return (
    <div style={{ backgroundColor: '#181a1b', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex' }}>
      
      {/* SIDE MENU BAR */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
         <div className="brand mb-4 d-flex align-items-center">
           <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
           <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
         </div>

         {/* 1. MASTER CONFIG DROPDOWN */}
         <div className="mt-2 mb-3 border-bottom border-secondary pb-3">
           <div 
             onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
             className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
             style={{ cursor: 'pointer', fontSize: '13.5px' }}
           >
             <span className="d-flex align-items-center gap-3">
               <i className="fas fa-sliders-h"></i> Master Config
             </span>
             <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
           </div>

           {masterDropdownOpen && (
             <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
               <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
               
               <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 Add Item Type
               </Link>

               <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 AddAssignedTO
               </Link>

               {/* <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/doctorassignto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 AddDoctorAssignTo
               </Link> */}

               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addadmintypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 AddAdminTypes
               </Link>

               <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 <i className="fas fa-language me-1"></i> Language Master
               </Link>

               <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 <i className="fas fa-map-marker-alt me-1"></i> StateName Master
               </Link>

               <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                 <i className="fas fa-city me-1"></i> CityName Master
               </Link>
                <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addaccountmastertypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Accountant Master Types             
                              </Link> 
             </div>
           )}
         </div>

         <div className="mb-3">
           <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between align-items-center" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
             <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
             <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
           </div>
         </div>

         <div>
           <div 
             onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
             className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
             style={{ cursor: 'pointer', fontSize: '13.5px' }}
           >
             <span className="d-flex align-items-center gap-3">
               <i className="fas fa-boxes"></i> Operations Registry
             </span>
             <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
           </div>

           {listsDropdownOpen && (
             <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
               <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
               
               <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
               <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link></li>
               <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
               <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
               <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
               <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
               <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
               <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster</Link></li>
               <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link></li> 
               {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form</Link></li> */}
               <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link></li>
               <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link></li>
               <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
               <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>
               <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link></li>
               <li><Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists</Link></li>
               <li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
               <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>
             </div>
           )}
         </div>

         {/* टर्मिनेट / लॉगआउट एक्शन */}
         <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
           <button 
             type="button" 
             onClick={() => navigate('/header')} 
             className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded hover-sidebar-logout"
             style={{ fontSize: '13.5px' }}
           >
             <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
           </button>
         </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '260px', padding: '30px', flex: 1, minWidth: '400px' }}>
        <div style={{ display: 'flex', gap: '30px', maxWidth: '1150px', margin: '0 auto', flexWrap: 'wrap' }}>
          
          {/* Add/Edit City Form Section */}
          <div style={{ backgroundColor: '#212529', padding: '20px', borderRadius: '8px', width: '320px', height: 'fit-content', border: '1px solid #32383e' }}>
            <h3 style={{ color: '#28a745', marginTop: '0', marginBottom: '20px', fontSize: '18px' }}>
              {isEditing ? 'Edit City Name' : 'Add City Name'}
            </h3>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Select State Name:</label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#2b3035', border: '1px solid #495057', borderRadius: '4px', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }}
              >
                <option value="">-- Select State --</option>
                {states.map((st, idx) => {
                  const sName = getNameValue(st, 'state');
                  return (
                    <option key={idx} value={sName}>{sName}</option>
                  );
                })}
              </select>

              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>City Name:</label>
              <input 
                type="text" 
                placeholder="e.g., Motihari" 
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#2b3035', border: '1px solid #495057', borderRadius: '4px', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}
              />

              <button 
                type="submit"
                style={{ width: '100%', padding: '10px', backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
              >
                {isEditing ? 'Update City' : 'Add City'}
              </button>

              {isEditing && (
                <button 
                  type="button"
                  onClick={() => { setIsEditing(false); setCityName(''); setSelectedState(''); setEditId(null); }}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* City Management Table Section */}
          <div style={{ backgroundColor: '#212529', padding: '20px', borderRadius: '8px', flex: 1, minWidth: '520px', border: '1px solid #32383e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#28a745', margin: '0', fontSize: '18px' }}>City Management Table</h3>
              
              <input 
                type="text"
                placeholder="Search city/state..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ padding: '6px 10px', backgroundColor: '#2b3035', border: '1px solid #495057', borderRadius: '4px', color: '#fff', fontSize: '14px' }}
              />
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #32383e', color: '#aaa', fontSize: '14px' }}>
                  <th style={{ padding: '12px 8px', width: '10%' }}>ID</th>
                  <th style={{ padding: '12px 8px', width: '30%' }}>State Name</th>
                  <th style={{ padding: '12px 8px', width: '25%' }}>City Name</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', width: '35%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCities.length > 0 ? (
                  currentCities.map((item, index) => {
                    const absoluteIndex = indexOfFirstItem + index + 1;
                    const cId = getIdValue(item, absoluteIndex);
                    const stateVal = getNameValue(item, 'state') || 'N/A';
                    const cityVal = getNameValue(item, 'city') || 'N/A';
                    
                    return (
                      <tr key={cId || index} style={{ borderBottom: '1px solid #2b3035', fontSize: '14px' }}>
                        <td style={{ padding: '12px 8px', color: 'red' }}>{cId}</td>
                        <td style={{ padding: '12px 8px', color: 'red' }}>{stateVal}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'red' }}>{cityVal}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button type="button" onClick={() => handleViewDetails(item, absoluteIndex)} style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '5px 7px', borderRadius: '4px', marginRight: '3px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Details</button>
                          <button type="button" onClick={() => handleEdit(item, absoluteIndex)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '5px 7px', borderRadius: '4px', marginRight: '3px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Edit</button>
                          <button type="button" onClick={() => handleDelete(item, absoluteIndex)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 7px', borderRadius: '4px', marginRight: '3px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>Del</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>No cities found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
              <button 
                type="button"
                onClick={() => setCurrentPage(currentPage - 1)} 
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
                onClick={() => setCurrentPage(currentPage + 1)} 
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