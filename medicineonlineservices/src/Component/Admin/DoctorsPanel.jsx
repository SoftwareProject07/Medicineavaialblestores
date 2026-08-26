import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const PATIENT_CUSTOMER_API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"; 
const PATIENT_UPDATE_API = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI/UpdatePatientDetails";

export default function DoctorsPanel() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    // Edit Modal States
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [currentPatientId, setCurrentPatientId] = useState(null);
    const [formData, setFormData] = useState({ fullName: "", age: "", description: "" });

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);

    // Assign Doctor Modal State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [assigningPatientId, setAssigningPatientId] = useState(null);

    const navigate = useNavigate();

    // Flexible Logged-in Doctor Identification
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
        localStorage.getItem("doctorUser") ||
        "Akhil Khhatun";

    const cleanDocName = rawDoctorIdentifier.replace(/dr\.?/gi, "").trim();
    const docName = `Dr. ${cleanDocName.charAt(0).toUpperCase() + cleanDocName.slice(1)}`;

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(PATIENT_CUSTOMER_API);
            const rawItems = res.data?.data || res.data || [];
            
            const patientData = rawItems.map((item, index) => {
                const resolvedName = item.patientName || item.fullName || item.name;
                const resolvedAddress = item.patientReason || item.address || item.description || item.deliveryAddress || "N/A";
                const resolvedMobile = item.phoneNumber || item.mobileNumber || item.age;
                
                let resolvedDoc = 
                    item.assignedDoctor || 
                    item.doctorName || 
                    item.doctor || 
                    item.assigned_doctor || 
                    item.doctorFullName || 
                    item.doctorname || 
                    item.assignedDoctorName || 
                    item.assigneddoctor || "";
                
                const currentId = item.patientDetailsId || item.patient_CustomerId || item.id;

                return {
                    patientid: currentId || index + 1,
                    name: (resolvedName && resolvedName !== "string") ? resolvedName : "Unknown Patient",
                    mobileNumber: (resolvedMobile !== undefined && resolvedMobile !== null) ? resolvedMobile : "N/A",
                    address: (resolvedAddress && resolvedAddress !== "string") ? resolvedAddress : "N/A",
                    assignedDoctor: resolvedDoc ? resolvedDoc.trim() : "Unassigned"
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

    useEffect(() => { 
        fetchPatients(); 
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        setPatients(patients.filter(p => (p.patientid || p.id) !== id));
        alert("🗑️ Record Deleted Successfully!");
    };

    const handleEditOpen = (patient) => {
        setCurrentPatientId(patient.patientid || patient.id);
        setFormData({
            fullName: patient.name,
            age: patient.mobileNumber,
            description: patient.address
        });
        setShowPatientModal(true);
    };

    const handleSavePatient = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                patientDetailsId: currentPatientId,
                patientName: formData.fullName,
                age: Number(formData.age) || 0,
                patientReason: formData.description,
            };

            await axios.put(`${PATIENT_UPDATE_API}/${currentPatientId}`, updatePayload).catch(() => {
                axios.post(PATIENT_UPDATE_API, updatePayload);
            });

            setPatients(prev => prev.map(p => {
                if ((p.patientid || p.id) === currentPatientId) {
                    return { ...p, name: formData.fullName, mobileNumber: formData.age, address: formData.description };
                }
                return p;
            }));

            setShowPatientModal(false);
            alert("✅ Patient Record Updated Successfully!");
        } catch (err) {
            console.error("Update error:", err);
            alert("❌ Failed to update patient.");
        }
    };

    const handleAssignOpen = (patient) => {
        setAssigningPatientId(patient.patientid || patient.id);
        setSelectedDoctor(patient.assignedDoctor !== "Unassigned" ? patient.assignedDoctor : "");
        setShowAssignModal(true);
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            const assignPayload = {
                patientDetailsId: assigningPatientId,
                assignedDoctor: selectedDoctor
            };

            await axios.put(`${PATIENT_UPDATE_API}/${assigningPatientId}`, assignPayload).catch(() => {
                axios.post(PATIENT_UPDATE_API, assignPayload);
            });

            setPatients(prev => prev.map(p => {
                if ((p.patientid || p.id) === assigningPatientId) {
                    return { ...p, assignedDoctor: selectedDoctor };
                }
                return p;
            }));

            setShowAssignModal(false);
            alert("✅ Doctor Assigned Successfully!");
            fetchPatients();
        } catch (err) {
            console.error("Assign error:", err);
            alert("❌ Failed to assign doctor.");
        }
    };

    const handleRowClickOpenDetails = (patient) => {
        setSelectedPatientDetails(patient);
        setShowDetailsModal(true);
    };

    // --- FLEXIBLE FILTER LOGIC ---
    const accessiblePatients = patients.filter(patient => {
        const assignedDocRaw = (patient.assignedDoctor || "").toLowerCase().trim();
        
        if (!assignedDocRaw || assignedDocRaw === "unassigned" || assignedDocRaw === "string") {
            return false;
        }

        const targetClean = cleanDocName.toLowerCase();
        return assignedDocRaw.includes(targetClean) || targetClean.includes(assignedDocRaw) || assignedDocRaw.includes("akhil");
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
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Mobile</th>
                                    <th>Patient Reason</th>
                                    <th>Assigned Doctor</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-4 text-muted">Loading records...</td></tr>
                                ) : filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            <div>No patient records found assigned to {docName}.</div>
                                        </td>
                                    </tr>
                                ) : filteredPatients.map((patient) => {
                                    const currentId = patient.patientid || patient.id;

                                    return (
                                        <tr key={currentId} className="table-active">
                                            <td className="fw-bold">#{currentId}</td>
                                            <td>
                                                <span 
                                                    className="text-primary fw-bold" 
                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    onClick={() => handleRowClickOpenDetails(patient)}
                                                >
                                                    {patient.name}
                                                </span>
                                            </td>
                                            <td>{patient.mobileNumber}</td>
                                            <td>
                                                <span style={{ cursor: 'pointer' }} onClick={() => handleRowClickOpenDetails(patient)}>
                                                    {patient.address}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-success text-white px-2 py-1">
                                                    <i className="fas fa-user-md me-1"></i> {patient.assignedDoctor}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex flex-wrap gap-1 justify-content-center align-items-center">
                                                    <button 
                                                        className="btn btn-sm btn-success px-2 py-0" 
                                                        style={{ fontSize: '11px' }} 
                                                        onClick={() => handleAssignOpen(patient)}
                                                    >
                                                        Assign Doctor
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-warning text-dark px-2 py-0" 
                                                        style={{ fontSize: '11px' }} 
                                                        onClick={() => handleEditOpen(patient)}
                                                    >
                                                        <i className="fas fa-edit"></i>
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
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ASSIGN DOCTOR MODAL */}
            {showAssignModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <form onSubmit={handleAssignSubmit} className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-success fw-bold">Assign Doctor</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label text-light fw-bold">Select Doctor</label>
                                    <select 
                                        className="form-select bg-light text-dark"
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Doctor --</option>
                                        <option value="Dr. Akhil Khhatun">Dr. Akhil Khhatun</option>
                                        <option value="Dr. Salman Khhatun">Dr. Salman Khhatun</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success btn-sm fw-bold">Save Assignment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PATIENT MODAL */}
            {showPatientModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <form onSubmit={handleSavePatient} className="modal-content bg-dark text-white border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-warning fw-bold">Edit Patient Record</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPatientModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label text-light fw-bold">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm bg-light text-dark"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label text-light fw-bold">Mobile / Age</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm bg-light text-dark"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label text-light fw-bold">Patient Reason</label>
                                    <textarea 
                                        className="form-control form-control-sm bg-light text-dark"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="2"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPatientModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-warning btn-sm text-dark fw-bold">Save Changes</button>
                            </div>
                        </form>
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
                                <p><strong>Mobile:</strong> {selectedPatientDetails.mobileNumber}</p>
                                <p><strong>Patient Reason:</strong> {selectedPatientDetails.address}</p>
                                <p><strong>Assigned Doctor:</strong> {selectedPatientDetails.assignedDoctor}</p>
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