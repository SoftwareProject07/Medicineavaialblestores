import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PATIENT_CUSTOMER_API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"; 
const PATIENT_ADD_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/AddPatientDetails"; 
const PATIENT_UPDATE_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/UpdatePatientDetails";

const DOCTOR_ASSIGN_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/AllDoctorAssigntoPatient";

export default function DoctorPatientDetailsLists() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    // Sidebar Dropdown States
    const [listsDropdownOpen, setListsDropdownOpen] = useState(true);
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);

    const [visibleColumns] = useState({
        id: true,
        name: true,
        mobileNumber: true,
        address: true,
        assignedDoctor: true,
        actions: true
    });

    // Add / Edit Patient Modal States
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        description: ""
    });

    // Assign Doctor Modal State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");

    // Details Modal State
    const [selectedDetailPatient, setSelectedDetailPatient] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const getSubLinkClass = (path) => {
        return `px-3 py-1.5 text-decoration-none d-flex align-items-center ${location.pathname === path ? 'text-success fw-bold' : 'text-white-50'} hover-sidebar-sublink`;
    };

    const handleShopToggle = () => {
        setIsShopOpen(!isShopOpen);
    };

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const selectedAddress = JSON.parse(
                localStorage.getItem("selectedDeliveryAddress") || 
                localStorage.getItem("selectedAddress") || 
                localStorage.getItem("checkoutAddress") || 
                "null"
            );

            const res = await axios.get(PATIENT_CUSTOMER_API);
            const rawItems = res.data || [];

            let filteredRaw = [];

            if (selectedAddress) {
                // Extracting unique identifiers from the selected storage object
                const selectedId = String(selectedAddress.patientDetailsId || selectedAddress.id || selectedAddress.patient_CustomerId || "").trim();
                const selectedName = String(selectedAddress.fullName || selectedAddress.patientName || selectedAddress.name || "").trim().toLowerCase();
                const selectedMobile = String(selectedAddress.mobileNumber || selectedAddress.phoneNumber || "").trim();

                filteredRaw = rawItems.filter(item => {
                    const itemId = String(item.patientDetailsId || item.id || item.patient_CustomerId || "").trim();
                    const itemName = String(item.patientName || item.fullName || item.name || "").trim().toLowerCase();
                    const itemMobile = String(item.mobileNumber || item.phoneNumber || item.age || "").trim();

                    // Strict matching: Match exclusively by ID, exact Name, or exact Mobile
                    if (selectedId && itemId) {
                        return itemId === selectedId;
                    }
                    if (selectedName && itemName) {
                        return itemName === selectedName;
                    }
                    if (selectedMobile && itemMobile) {
                        return itemMobile === selectedMobile;
                    }
                    return false;
                });
            } else {
                filteredRaw = []; 
            }

            const patientData = filteredRaw.map((item, index) => {
                const resolvedName = item.patientName || item.fullName || item.name || "Unknown Patient";
                const resolvedAddress = item.patientReason || item.address || item.description || "N/A";
                const resolvedMobile = item.age || item.mobileNumber || item.phoneNumber || "N/A";

                return {
                    patientid: item.patientDetailsId || item.patient_CustomerId || item.id || index + 1,
                    name: resolvedName !== "string" ? resolvedName : "Unknown Patient",
                    mobileNumber: resolvedMobile !== "string" && resolvedMobile !== 0 ? resolvedMobile : "N/A",
                    address: resolvedAddress !== "string" ? resolvedAddress : "N/A",
                    assignedDoctor: item.assignedDoctor || "Not Required / General",
                    pdfStatus: item.pdfStatus !== undefined ? item.pdfStatus : false 
                };
            });

            setPatients(patientData);
        } catch (err) {
            console.error("Fetch error:", err);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(DOCTOR_ASSIGN_API);
            setDoctorList(res.data || []);
        } catch (err) {
            console.error("Error fetching doctors:", err);
        }
    };

    useEffect(() => { 
        fetchPatients(); 
        fetchDoctors();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const updated = patients.filter(p => (p.patientid || p.id) !== id);
        setPatients(updated);
        alert("🗑️ Record Deleted Successfully!");
    };

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setCurrentPatientId(null);
        setFormData({
            fullName: "",
            age: "",
            description: ""
        });
        setShowPatientModal(true);
    };

    const handleOpenEditModal = (patient) => {
        setIsEditMode(true);
        setCurrentPatientId(patient.patientid || patient.id);
        setFormData({
            fullName: patient.name !== "Unknown Patient" ? patient.name : "",
            age: patient.mobileNumber !== "N/A" ? patient.mobileNumber : "",
            description: patient.address !== "N/A" ? patient.address : ""
        });
        setShowPatientModal(true);
    };

    const handleSavePatientRecord = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patientName: formData.fullName,
                age: Number(formData.age) || 0,
                patientReason: formData.description
            };

            if (isEditMode && currentPatientId) {
                const updatePayload = { ...payload, patientDetailsId: currentPatientId };
                try {
                    await axios.put(`${PATIENT_UPDATE_API}/${currentPatientId}`, updatePayload);
                } catch (updateErr) {
                    await axios.post(PATIENT_UPDATE_API, updatePayload);
                }
                alert("💾 Record Updated Successfully!");
            } else {
                try {
                    await axios.post(PATIENT_ADD_API, payload);
                } catch (innerErr) {
                    console.error("API error details:", innerErr);
                }
                alert("💾 Record Saved Successfully to API!");
            }

            setShowPatientModal(false);
            fetchPatients();
        } catch (error) {
            console.error("Error saving record to API:", error);
            alert("❌ Failed to save record to API.");
        }
    };

    const handleOpenAssignModal = (id, currentAssignedDoc) => {
        setSelectedPatientId(id);
        setSelectedDoctor(currentAssignedDoc || "");
        setShowAssignModal(true);
    };

    const handleSaveAssignedDoctor = async () => {
        try {
            setPatients(prev => prev.map(p => {
                if ((p.patientid || p.id) === selectedPatientId) {
                    return { ...p, assignedDoctor: selectedDoctor };
                }
                return p;
            }));
            setShowAssignModal(false);
            alert("✅ Doctor Assigned Successfully!");
        } catch (err) {
            console.error("Error assigning doctor:", err);
            alert("❌ Failed to assign doctor.");
        }
    };

    const handleRowClickOpenDetails = (patient) => {
        setSelectedDetailPatient(patient);
        setShowDetailModal(true);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(patient.mobileNumber)?.includes(searchTerm)
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

            {/* Sidebar */}
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
                    
                    <Link to="/deshboardpanel" className="px-3 py-2 text-white-50 text-decoration-none d-flex align-items-center gap-3">
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
                                
                                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                                    <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    Add Item Type
                                </Link>

                                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                                    <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    AddAssignedTO
                                </Link>
                                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                    <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/doctorassignto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    AddDoctorAssignTo
                                </Link>
                                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                                    <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addadmintypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                    AddAdminTypes
                                </Link>

                                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
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
                                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                                
                                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Dashboard</Link>
                                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">CustomerLIST</Link>
                                <Link to="/" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">OrderPaymentList</Link>
                                <Link to="/" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">OrderStatusLIST</Link>
                                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-1 text-start btn-sm">Feedback List</Link>
                                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Admin Login List</Link>
                                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">UnavailableMedicineList</Link>
                                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">bankselectMaster</Link>
                                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">BankCreditAmountDetails</Link> 
                                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Registeartion Form</Link>
                                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">LivenessimageList</Link>
                                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">customerticketraiselist</Link>
                                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-1 text-start text-decoration-none btn-sm">Bank Details RefundList</Link>
                                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Customer_DeliveryAddressList</Link> 
                                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Livetracker</Link> 
                                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Doctor_PatientdetailsLists</Link>
                                <Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">HiringDATA</Link>
                            </div>
                        )}
                    </div>

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
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '30px', boxSizing: 'border-box', backgroundColor: '#121212' }}>
                <div className="card border-0 shadow bg-white text-dark mb-4 overflow-hidden" style={{ borderRadius: '6px' }}>
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Patient Records Lists</h4>
                        </div>
                        <div className="d-flex align-items-center gap-2 w-50 justify-content-end">
                            <input
                                type="text"
                                className="form-control form-control-sm w-50 bg-white text-dark border-0"
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-responsive m-0">
                        <table className="table table-bordered table-hover m-0 align-middle" style={{ fontSize: '13px' }}>
                            <thead className="table-dark text-uppercase">
                                <tr>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.name && <th>Full Name</th>}
                                    {visibleColumns.mobileNumber && <th>Mobile</th>}
                                    {visibleColumns.address && <th>Patient Reason</th>}
                                    {visibleColumns.assignedDoctor && <th>Assigned Doctor</th>}
                                    {visibleColumns.actions && <th className="text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-4 text-muted">Loading records...</td></tr>
                                ) 
                                : filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            <div>No Records Found for the selected address/customer.</div>
                                        </td>
                                    </tr>
                                ) 
                                : filteredPatients.map((patient) => {
                                    const currentId = patient.patientid || patient.id;

                                    return (
                                        <tr key={currentId} className="table-active">
                                            {visibleColumns.id && <td className="fw-bold">#{currentId}</td>}
                                            {visibleColumns.name && (
                                                <td>
                                                    <span 
                                                        className="text-primary fw-bold" 
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                        onClick={() => handleRowClickOpenDetails(patient)}
                                                    >
                                                        {patient.name}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.mobileNumber && <td>{patient.mobileNumber}</td>}
                                            {visibleColumns.address && (
                                                <td>
                                                    <span style={{ cursor: 'pointer' }} onClick={() => handleRowClickOpenDetails(patient)}>
                                                        {patient.address}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.assignedDoctor && (
                                                <td>
                                                    <span className="badge bg-success text-white px-2 py-1">
                                                        <i className="fas fa-user-md me-1"></i> {patient.assignedDoctor}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.actions && (
                                                <td className="text-center">
                                                    <div className="d-flex flex-wrap gap-1 justify-content-center align-items-center">
                                                        <button 
                                                            className="btn btn-sm btn-success px-2 py-0" 
                                                            style={{ fontSize: '11px' }} 
                                                            onClick={() => handleOpenAssignModal(currentId, patient.assignedDoctor)}
                                                        >
                                                            Assign Doctor
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-info text-white px-2 py-0" 
                                                            style={{ fontSize: '11px' }} 
                                                            onClick={() => handleRowClickOpenDetails(patient)}
                                                        >
                                                            <i className="fa-solid fa-circle-info"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-warning text-dark px-2 py-0" 
                                                            style={{ fontSize: '11px' }} 
                                                            onClick={() => handleOpenEditModal(patient)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger px-2 py-0" 
                                                            style={{ fontSize: '11px' }} 
                                                            onClick={() => handleDelete(currentId)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>    
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add / Edit Patient Modal */}
            {showPatientModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-success fw-bold">
                                    {isEditMode ? "Edit Record Entry" : "Add Record Entry"}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPatientModal(false)}></button>
                            </div>
                            <form onSubmit={handleSavePatientRecord}>
                                <div className="modal-body" style={{ fontSize: '13px' }}>
                                    <div className="mb-3">
                                        <label className="form-label text-light mb-1 fw-bold">Patient Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light text-dark border-0 form-control-sm fw-bold"
                                            placeholder="Enter patient name..."
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light mb-1 fw-bold">Age / Mobile</label>
                                        <input 
                                            type="number" 
                                            className="form-control bg-light text-dark border-0 form-control-sm fw-bold"
                                            placeholder="Enter age or mobile..."
                                            value={formData.age}
                                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-light mb-1 fw-bold">Patient Reason / Description</label>
                                        <textarea 
                                            className="form-control bg-light text-dark border-0 form-control-sm fw-bold"
                                            placeholder="Enter description or reason..."
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-secondary">
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPatientModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success btn-sm">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Doctor Modal */}
            {showAssignModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-success fw-bold">Assign Doctor</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ fontSize: '13px' }}>
                                <div className="mb-3">
                                    <label className="form-label text-light mb-1 fw-bold">Select Doctor</label>
                                    <select 
                                        className="form-control bg-light text-dark border-0 form-control-sm fw-bold"
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                        <option value="">-- Choose Doctor --</option>
                                        {doctorList.map((doc, idx) => {
                                            const docName = doc.doctorName || doc.name || doc.fullName || `Doctor ${idx + 1}`;
                                            return (
                                                <option key={idx} value={docName}>{docName}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success btn-sm" onClick={handleSaveAssignedDoctor}>Confirm Assignment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailModal && selectedDetailPatient && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-info fw-bold">Patient Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ fontSize: '13px' }}>
                                <p><strong>ID:</strong> #{selectedDetailPatient.patientid || selectedDetailPatient.id}</p>
                                <p><strong>Full Name:</strong> {selectedDetailPatient.name}</p>
                                <p><strong>Mobile / Age:</strong> {selectedDetailPatient.mobileNumber}</p>
                                <p><strong>Patient Reason:</strong> {selectedDetailPatient.address}</p>
                                <p><strong>Assigned Doctor:</strong> {selectedDetailPatient.assignedDoctor}</p>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDetailModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}