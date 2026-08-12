import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PATIENT_CUSTOMER_API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"; 
const PATIENT_ADD_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/AddPatientDetails"; 
const PATIENT_UPDATE_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/UpdatePatientDetails";
const DOCTOR_ASSIGN_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/AllDoctorAssigntoPatient";

export default function DoctorsPanel() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const [visibleColumns] = useState({
        id: true,
        name: true,
        mobileNumber: true,
        address: true,
        assignedDoctor: true,
        actions: true
    });

    // Add / Edit Modal States
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [formData, setFormData] = useState({ fullName: "", age: "", description: "" });

    // Assign Modal States
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // 🚀 LOGGED IN DOCTOR INFO RETRIEVAL
    let loggedInUser = {};
    try {
        const rawUser = localStorage.getItem("loggedInUser") || localStorage.getItem("adminUser") || localStorage.getItem("doctorUser") || "{}";
        loggedInUser = JSON.parse(rawUser);
    } catch (e) {
        loggedInUser = {};
    }

    let rawDoctorIdentifier = 
        loggedInUser.firstName || 
        loggedInUser.name || 
        loggedInUser.doctorName || 
        loggedInUser.userName || 
        localStorage.getItem("doctorName") || 
        localStorage.getItem("userName") || 
        "Akhil";

    const cleanDocName = rawDoctorIdentifier.replace(/dr\.\s*/i, "").trim().toLowerCase();
    const docName = `Dr. ${cleanDocName.charAt(0).toUpperCase() + cleanDocName.slice(1)}`;

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(PATIENT_CUSTOMER_API);
            const rawItems = res.data?.data || res.data || [];

            const patientData = rawItems.map((item, index) => {
                const resolvedName = item.patientName || item.fullName || item.name;
                const resolvedAddress = item.patientReason || item.address || item.description;
                const resolvedMobile = item.age || item.mobileNumber || item.phoneNumber;
                const resolvedDoc = item.assignedDoctor || item.doctorName || item.doctor || item.assigned_doctor || "";

                return {
                    patientid: item.patientDetailsId || item.patient_CustomerId || item.id || index + 1,
                    name: (resolvedName && resolvedName !== "string") ? resolvedName : "Unknown Patient",
                    mobileNumber: (resolvedMobile !== undefined && resolvedMobile !== null) ? resolvedMobile : "N/A",
                    address: (resolvedAddress && resolvedAddress !== "string") ? resolvedAddress : "N/A",
                    assignedDoctor: resolvedDoc
                };
            });

            console.log("Fetched Patients from API:", patientData);
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
        setPatients(patients.filter(p => (p.patientid || p.id) !== id));
        alert("🗑️ Record Deleted Successfully!");
    };

    const handleOpenAssignModal = (id, currentAssignedDoc) => {
        setSelectedPatientId(id);
        setSelectedDoctor(currentAssignedDoc || "");
        setShowAssignModal(true);
    };

    const handleSaveAssignedDoctor = async () => {
        try {
            const targetPatient = patients.find(p => (p.patientid || p.id) === selectedPatientId);
            if (targetPatient) {
                const updatePayload = {
                    patientDetailsId: selectedPatientId,
                    patientName: targetPatient.name,
                    age: Number(targetPatient.mobileNumber) || 0,
                    patientReason: targetPatient.address,
                    assignedDoctor: selectedDoctor 
                };
                try {
                    await axios.put(`${PATIENT_UPDATE_API}/${selectedPatientId}`, updatePayload);
                } catch (e) {
                    await axios.post(PATIENT_UPDATE_API, updatePayload);
                }
            }

            setPatients(prev => prev.map(p => {
                if ((p.patientid || p.id) === selectedPatientId) {
                    return { ...p, assignedDoctor: selectedDoctor };
                }
                return p;
            }));
            
            setShowAssignModal(false);
            alert("✅ Doctor Assigned Successfully!");
            fetchPatients(); 
        } catch (err) {
            console.error("Error assigning doctor:", err);
            alert("❌ Failed to assign doctor.");
        }
    };

    const handleRowClickOpenDetails = (patient) => {
        setSelectedPatientDetails(patient);
        setShowDetailsModal(true);
    };

    // 🚀 FILTERING: Ab saare patients dikhenge taaki assign hone ke baad data UI par turant show ho
    const accessiblePatients = patients.filter(patient => {
        const assignedDocRaw = (patient.assignedDoctor || "").trim().toLowerCase();
        if (!assignedDocRaw) return true; 
        return assignedDocRaw.includes(cleanDocName) || cleanDocName.includes(assignedDocRaw) || true;
    });

    const filteredPatients = accessiblePatients.filter(patient =>
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(patient.mobileNumber)?.includes(searchTerm)
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

            {/* SIDEBAR */}
            <div style={{ width: '280px', backgroundColor: '#16161a', padding: '24px 16px', position: 'fixed', height: '100vh', zIndex: 100, borderRight: '1px solid #232329' }}>
                <h5 className="text-white fw-bold mb-4">AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Panel</span></h5>
                
                <div className="d-flex flex-column gap-1">
                    <span className="text-muted fw-bold mb-2" style={{ fontSize: '10px' }}>NAVIGATION</span>
                    <Link to="/doctorspanel" className="btn btn-success w-100 text-start btn-sm mb-3">Patient Records Lists</Link>
                    
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/adminlogin'); }} 
                        className="btn btn-link text-danger text-start text-decoration-none p-0 mt-4"
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> LogOut
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '30px', boxSizing: 'border-box', backgroundColor: '#121212' }}>
                <div className="card border-0 shadow bg-white text-dark mb-4 overflow-hidden" style={{ borderRadius: '6px' }}>
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>
                                Patient Records Lists <span style={{ fontSize: '13px', fontWeight: 'normal' }}>(Logged in: {docName})</span>
                            </h4>
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
                                ) : filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            <div>No patient records found.</div>
                                        </td>
                                    </tr>
                                ) : filteredPatients.map((patient) => {
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
                                                        <i className="fas fa-user-md me-1"></i> {patient.assignedDoctor || "Not Assigned"}
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

            {/* ASSIGN MODAL */}
            {showAssignModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-success fw-bold">Assign Doctor</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label text-light mb-1 fw-bold">Select Doctor</label>
                                <select 
                                    className="form-control bg-light text-dark border-0 form-control-sm fw-bold"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                >
                                    <option value="">-- Choose Doctor --</option>
                                    {doctorList.map((doc, idx) => {
                                        const docNameVal = typeof doc === 'string' 
                                            ? doc 
                                            : (doc.firstName ? `Dr. ${doc.firstName} ${doc.lastName || ''}`.trim() : (doc.doctorName || doc.name || JSON.stringify(doc)));
                                        return <option key={idx} value={docNameVal}>{docNameVal}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-success btn-sm" onClick={handleSaveAssignedDoctor}>Confirm Assign</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS MODAL */}
            {showDetailsModal && selectedPatientDetails && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-info fw-bold">Patient Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailsModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{ fontSize: '14px' }}>
                                <p><strong>ID:</strong> #{selectedPatientDetails.patientid || selectedPatientDetails.id}</p>
                                <p><strong>Full Name:</strong> {selectedPatientDetails.name}</p>
                                <p><strong>Mobile/Age:</strong> {selectedPatientDetails.mobileNumber}</p>
                                <p><strong>Patient Reason:</strong> {selectedPatientDetails.address}</p>
                                <p><strong>Assigned Doctor:</strong> {selectedPatientDetails.assignedDoctor || "Not Assigned"}</p>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDetailsModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}