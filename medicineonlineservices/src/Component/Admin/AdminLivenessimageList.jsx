import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLivenessimageList() {
  const navigate = useNavigate();

  const [livenessList, setLivenessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  useEffect(() => {
    getLivenessList();
  }, []);

  const getLivenessList = async () => {
    try {
      const response = await axios.get(
       // "http://localhost:5256/api/LIVENESSVerificationAPI/AllLivenessblink"
       "https://ecommerencesite.onrender.com/api/LIVENESSVerificationAPI/AllLivenessblink",
      );

      setLivenessList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
         <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>
         {/* --- Master Config Dropdown Section --- */}
                        <div className="mb-3 border-bottom border-secondary pb-3">
                          <button 
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
                              <Link 
                                to="/adminissuetype" 
                                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fas fa-plus-circle"></i> Add Item Type
                              </Link>
                                <Link 
                to="/adminmasterassignedto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddAssignedTO 
              </Link>


              <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                AddDoctorAssignTo
                              </Link>
          
               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels     ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
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
        <ul className="nav flex-column mt-4">
          <li className="mb-3">
            <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
            </div>
          </li>
              
                 <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link></li>
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li>
          {/* <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AustomerHelpIssueList </Link></li> */}
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
                  <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
          <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
            <li>       <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
        </Link></li>

         <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

                               <li className="mt-3">
                                   <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                                       <i className="fas fa-sign-out-alt"></i> LogOut
                                   </button>
                               </li>
       
        </ul>
      </div>
      {/* Main Content */}
      <div
        style={{
          marginLeft: "280px",
          padding: "20px",
        }}
      >
        <h3 className="mb-4">Liveness Verification List</h3>

        {loading ? (
          <h5>Loading...</h5>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Session Id</th>
                <th>Blink Count</th>
                <th>Image</th>
                <th>Created Date</th>
              </tr>
            </thead>

            <tbody>
              {livenessList.length > 0 ? (
                livenessList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.sessionId}</td>
                    <td>{item.blinkCount}</td>

                    <td>
                      {item.imagePath ? (
                        <img
                          src={`http://localhost:5256/${item.imagePath}`}
                          alt="Liveness"
                          width="120"
                          height="90"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>
                      {new Date(item.createdDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}