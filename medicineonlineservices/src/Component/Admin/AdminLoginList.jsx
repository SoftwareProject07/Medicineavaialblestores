import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminLoginList() {
  const [users, setUsers] = useState([]);
  const [adminTypes, setAdminTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // --- Sidebar & UI Navigation States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  // --- Details Modal State ---
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getNavLinkClass = (path) => {
    const baseClass = "d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded text-white-50 ";
    return baseClass + (location.pathname === path ? "bg-success text-white" : "hover-sidebar-menu");
  };

  const getSubLinkClass = (path) => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none text-white-50 rounded mb-1 position-relative ";
    return baseClass + (location.pathname === path ? "text-success fw-bold" : "hover-sidebar-menu");
  };

  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    Swal.fire("Status Updated", `Store status is now set to: ${newStatus === "ON" ? "OPEN" : "CLOSED"}`, "info");
  };

  const normalizeUsers = (list) => {
    return list.map((u, index) => {
      const realId = u.admiNid ?? u.AdminId ?? u.adminId ?? u.id ?? u.Id ?? u.ID;
      const rawKey = realId ?? u.email ?? "admin";
      const uniqueKey = `${rawKey}_${index}`;

      return {
        uniqueKey: uniqueKey, 
        deleteId: realId, 
        displayIndex: index + 1, 
        firstName: u.firstName ?? u.FirstName ?? "",
        middleName: u.middleName ?? u.MiddleName ?? "",
        lastName: u.lastName ?? u.LastName ?? "",
        email: u.email ?? u.Email ?? "",
        mobileNumber: u.mobileNumber ?? u.MobileNumber ?? "",
        password: u.password ?? u.Password ?? "",
        type: u.type ?? u.Type ?? "",
        createdOn: u.createdOn ?? u.CreatedOn ?? "",
        originalData: u 
      };
    });
  };

  const fetchUsers = () => {
    axios
      .get("https://ecommerencesite.onrender.com/api/AdminApi/GETALLRegisterAdmin")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.result;
        setUsers(Array.isArray(list) ? normalizeUsers(list) : []);
      })
      .catch((err) => {
        console.error("API ERROR 👉", err);
        setUsers([]);
      });
  };

  const fetchAdminTypes = () => {
    axios
      .get(
       "https://ecommerencesite.onrender.com/api/AdminApi/AllTypeList"
      
      )
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.result;
        setAdminTypes(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Admin Types API Error:", err);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchAdminTypes();
  }, []);

  const handleDelete = (deleteId) => {
    if (!deleteId) {
      Swal.fire("Error!", "Delete karne ke liye koi valid ID nahi mili!", "error");
      return;
    }

    Swal.fire({
      title: "Kya aap pakka delete karna chahte hain?",
      text: "Yeh action wapas nahi liya ja sakta!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Haan, Delete karein!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://ecommerencesite.onrender.com/api/AdminApi/DeleteAdmin/${encodeURIComponent(deleteId)}`)
          .then(() => {
            Swal.fire("Deleted!", "Admin safaltapurvak delete ho gaya.", "success");
            fetchUsers();
          })
          .catch((err) => {
            console.error("Delete Error Details:", err.response || err);
            Swal.fire("Error!", "Delete fail ho gaya. Server check karein.", "error");
          });
      }
    });
  };

  const handleEdit = (user) => {
    const rawData = user.originalData;
    
    const adminId = rawData.admiNid ?? rawData.AdminId ?? rawData.adminId ?? rawData.id ?? rawData.Id ?? rawData.ID;
    const currentType = rawData.type ?? rawData.Type ?? "";

    const typeOptionsHtml = adminTypes.map((t) => {
      const typeValue = t.type ?? t.TypeName ?? t.name ?? t; 
      const isSelected = typeValue === currentType ? "selected" : "";
      return `<option value="${typeValue}" ${isSelected}>${typeValue}</option>`;
    }).join("");

    Swal.fire({
      title: "Edit Admin Details",
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
          <div>
            <label style="font-size: 12px; font-weight: bold;">First Name</label>
            <input id="swal-firstName" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.firstName ?? rawData.FirstName ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Middle Name</label>
            <input id="swal-middleName" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.middleName ?? rawData.MiddleName ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Last Name</label>
            <input id="swal-lastName" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.lastName ?? rawData.LastName ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Email</label>
            <input id="swal-email" type="email" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.email ?? rawData.Email ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Mobile Number</label>
            <input id="swal-mobileNumber" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.mobileNumber ?? rawData.MobileNumber ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Password</label>
            <input id="swal-password" type="text" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box;" value="${rawData.password ?? rawData.Password ?? ""}">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: bold;">Admin Type</label>
            <select id="swal-type" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; height: 45px;">
              <option value="">Select Admin Type</option>
              ${typeOptionsHtml}
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      width: "500px",
      preConfirm: () => {
        return {
          admiNid: adminId,
          firstName: document.getElementById("swal-firstName").value,
          middleName: document.getElementById("swal-middleName").value,
          lastName: document.getElementById("swal-lastName").value,
          email: document.getElementById("swal-email").value,
          mobileNumber: document.getElementById("swal-mobileNumber").value,
          password: document.getElementById("swal-password").value,
          type: document.getElementById("swal-type").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPayload = result.value;

        // Yahan PUT request ke sath ID URL mein bheji gayi hai (jaise Delete mein hoti hai) taaki 404 error na aaye
        axios
          .put(`https://ecommerencesite.onrender.com/api/AdminApi/UPDATERegisterAdmin/${encodeURIComponent(adminId)}`, updatedPayload)
          .then(() => {
            Swal.fire("Success!", "Admin details updated successfully.", "success");
            fetchUsers();
          })
          .catch((err) => {
            console.error("Update Error:", err.response || err);
            // Agar upar wala URL fail ho toh bina ID wala alternative endpoint try karega
            axios
              .put("https://ecommerencesite.onrender.com/api/AdminApi/UPDATERegisterAdmin", updatedPayload)
              .then(() => {
                Swal.fire("Success!", "Admin details updated successfully.", "success");
                fetchUsers();
              })
              .catch((err2) => {
                console.error("Alternative Update Error:", err2.response || err2);
                Swal.fire("Error!", "Update fail ho gaya. Server check karein.", "error");
              });
          });
      }
    });
  };

  const handleDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      {/* ---------- SIDEBAR ---------- */}
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
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2.5 rounded d-flex align-items-center justify-content-between transition-all" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          <div className="mt-2">
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
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>AddDoctorAssignTo</Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>

                 <Link to="/languagemaster" className={getSubLinkClass("/languagemaster")}>
                                {/* <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagemaster' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div> */}
                                Language Master           
                              </Link>


                                       <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                                {/* <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div> */}
                                         StateName Master  
                              </Link>
<Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                                {/* <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div> */}
                                CityName Master           
                              </Link> 
              </div>
            )}
          </div>
        
          <div className="mt-2">
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
              <div className="position-relative ms-3 mt-1 d-flex flex-column gap-1" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link>
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster</Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form</Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link>
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link>
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link>
                <Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link>
              </div>
            )}
          </div>

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

      {/* ---------- CONTENT AREA ---------- */}
      <div className="content flex-grow-1" style={{ marginLeft: "280px", padding: "30px", width: "calc(100% - 280px)" }}>
        <h2 className="mb-4 text-dark fw-bold">Admin Registration List</h2>

        <input
          className="form-control mb-4 shadow-sm"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ borderRadius: '6px' }}
        />

        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-bordered table-striped table-hover mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Password</th>
                <th>Type</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted py-4">Koi record nahi mila</td>
                </tr>
              ) : (
                currentItems.map((u) => (
                  <tr key={u.uniqueKey}>
                    <td>{u.displayIndex}</td>
                    <td>{u.firstName}</td>
                    <td>{u.middleName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.mobileNumber}</td>
                    <td>{u.password}</td>
                    <td><span className="badge bg-secondary">{u.type}</span></td>
                    <td>{u.createdOn ? new Date(u.createdOn).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <button className="btn btn-sm btn-info text-white px-2 py-1" onClick={() => handleDetails(u)}>
                          <i class="fa-solid fa-circle-info"></i>

                        </button>
                        <button className="btn btn-sm btn-primary px-2 py-1" onClick={() => handleEdit(u)}>
                              <i className="fas fa-edit"></i> 
                        </button>
                        <button className="btn btn-sm btn-danger px-2 py-1" onClick={() => handleDelete(u.deleteId)}>
                              <i className="fas fa-trash-alt"></i> 
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-secondary small">
            Showing {filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
          </span>

          <nav>
            <ul className="pagination mb-0 shadow-sm">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link bg-success border-success">{currentPage}</span>
              </li>
              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Admin Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>S.No:</strong> {selectedUser.displayIndex}</p>
                <p><strong>First Name:</strong> {selectedUser.firstName}</p>
                <p><strong>Middle Name:</strong> {selectedUser.middleName || "N/A"}</p>
                <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Mobile:</strong> {selectedUser.mobileNumber}</p>
                <p><strong>Password:</strong> {selectedUser.password}</p>
                <p><strong>Type:</strong> {selectedUser.type}</p>
                <p><strong>Created On:</strong> {selectedUser.createdOn ? new Date(selectedUser.createdOn).toLocaleString() : "N/A"}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}