import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = "https://ecommerencesite.onrender.com/api/LanguageAPI";
//const API_BASE = 'http://localhost:5256/api/LanguageAPI';

export default function LanguageMasterPanel() {
    const navigate = useNavigate();
    
    const [languages, setLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [message, setMessage] = useState('');
    
    const [formData, setFormData] = useState({ id: 0, preferredLanguage: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [detailsItem, setDetailsItem] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleShopToggle = () => {
        setIsShopOpen(!isShopOpen);
    };

    // 1. LIST FUNCTION (GET)
    const fetchLanguages = async () => {
        try {
            const res = await fetch("https://ecommerencesite.onrender.com/api/LanguageAPI/AllCurrentLanguageAsync");
            if (res.ok) {
                const data = await res.json();
                setLanguages(Array.isArray(data) ? data : data.data || []);
            }
        } catch (err) {
            console.error("Error fetching list:", err);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. CREATE FUNCTION (With Duplicate Validation Check)
    const handleCreate = async () => {
        const trimmedLang = formData.preferredLanguage.trim();

        // Check if language already exists (case-insensitive)
        const isDuplicate = languages.some(
            (lang) => lang.preferredLanguage && lang.preferredLanguage.toLowerCase() === trimmedLang.toLowerCase()
        );

        if (isDuplicate) {
            setMessage('Duplicate language! This entry already exists.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/CreateLanguage`, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    id: 0,
                    preferredLanguage: trimmedLang
                })
            });

            if (res.ok) {
                setMessage('Language Added successfully!');
                setFormData({ id: 0, preferredLanguage: '' });
                fetchLanguages();
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errText = await res.text();
                console.error("Create failed response:", errText);
                setMessage('Create failed.');
            }
        } catch (err) {
            console.error("Error creating:", err);
            setMessage('Network error during create.');
        }
    };

    // 3. UPDATE FUNCTION (PUT)
    const handleUpdate = async () => {
        const trimmedLang = formData.preferredLanguage.trim();

        // Check if duplicate exists for another ID
        const isDuplicate = languages.some(
            (lang) => lang.id !== Number(formData.id) && lang.preferredLanguage && lang.preferredLanguage.toLowerCase() === trimmedLang.toLowerCase()
        );

        if (isDuplicate) {
            setMessage('Duplicate language! Another entry with this name already exists.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/UpdateLanguage`, {
                method: 'PUT',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    id: Number(formData.id),
                    preferredLanguage: trimmedLang
                })
            });

            if (res.ok) {
                setMessage('Language Updated successfully!');
                setFormData({ id: 0, preferredLanguage: '' });
                setIsEditing(false);
                fetchLanguages();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Update failed.');
            }
        } catch (err) {
            console.error("Error updating:", err);
            setMessage('Network error during update.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

    const handleEditClick = (item) => {
        setFormData({ id: item.id, preferredLanguage: item.preferredLanguage });
        setIsEditing(true);
        setDetailsItem(null);
    };

    // 4. DETAILS FUNCTION (GET)
    const handleDetails = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/DetailsLanguage?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setDetailsItem(data);
            } else {
                setMessage('Could not fetch details.');
            }
        } catch (err) {
            console.error("Error fetching details:", err);
        }
    };

    // 5. DELETE FUNCTION (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this language entry?")) return;

        try {
            const res = await fetch(`${API_BASE}/DeleteLanguage?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setMessage('Deleted successfully!');
                fetchLanguages();
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Delete failed.');
            }
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    // 6. SEARCH FILTER LOGIC
    const filteredLanguages = languages.filter((lang) => 
        lang.preferredLanguage && lang.preferredLanguage.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredLanguages.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLanguages = filteredLanguages.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const styles = {
        card: {
            backgroundColor: '#1a1d1e',
            border: '1px solid #2d3032',
            borderRadius: '6px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        },
        cardTitle: {
            color: '#28a745',
            fontWeight: '600',
            marginBottom: '20px',
            fontSize: '18px',
            textAlign: 'center'
        },
        tableTitle: {
            color: '#28a745',
            fontWeight: '600',
            marginBottom: '20px',
            fontSize: '18px',
        },
        label: {
            display: 'block',
            color: '#d1d1d1',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            backgroundColor: '#242729',
            border: '1px solid #3a3d40',
            borderRadius: '4px',
            color: '#fff',
            padding: '10px 12px',
            marginBottom: '20px',
            fontSize: '14px',
            outline: 'none'
        },
        submitBtn: {
            width: '100%',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
        },
        cancelBtn: {
            width: '100%',
            backgroundColor: 'transparent',
            color: '#dc3545',
            border: '1px solid #dc3545',
            padding: '10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '10px',
        },
        th: {
            color: '#a0a0a0',
            padding: '12px 15px',
            textAlign: 'left',
            fontWeight: '500',
            borderBottom: '1px solid #333',
            fontSize: '14px'
        },
        td: {
            color: '#e0e0e0',
            padding: '12px 15px',
            borderBottom: '1px solid #2d3032',
            fontSize: '14px'
        },
        editBtn: {
            backgroundColor: 'transparent',
            border: '1px solid #ffc107',
            color: '#ffc107',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginRight: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        },
        detailsBtn: {
            backgroundColor: 'transparent',
            border: '1px solid #17a2b8',
            color: '#17a2b8',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginRight: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        },
        deleteBtn: {
            backgroundColor: 'transparent',
            border: '1px solid #dc3545',
            color: '#dc3545',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        },
        paginationContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            paddingTop: '10px',
            borderTop: '1px solid #2d3032'
        },
        pageBtn: {
            backgroundColor: '#242729',
            border: '1px solid #3a3d40',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
        },
        pageBtnDisabled: {
            backgroundColor: '#1a1d1e',
            border: '1px solid #2d3032',
            color: '#555',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'not-allowed',
            fontSize: '13px'
        }
    };

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
                            <Link to="/languagemaster" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                <i className="fas fa-language"></i> Language Master
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

            {/* MAIN CONTENT AREA */}
            <div style={{ marginLeft: '260px', padding: '30px', width: 'calc(100% - 260px)', backgroundColor: '#121212', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    
                    {/* LEFT PANEL: Form Card (Create / Edit) */}
                    <div style={{ ...styles.card, width: '320px', flexShrink: 0 }}>
                        <h3 style={styles.cardTitle}>
                            {isEditing ? 'Edit Language' : 'Add Language'}
                        </h3>
                        
                        {message && <div style={{ color: message.includes('success') ? '#28a745' : '#dc3545', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{message}</div>}

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={styles.label}>Preferred Language:</label>
                                <input 
                                    type="text" 
                                    name="preferredLanguage" 
                                    value={formData.preferredLanguage} 
                                    onChange={handleChange} 
                                    placeholder="e.g., Hindi, English" 
                                    required 
                                    style={styles.input}
                                />
                            </div>
                            <button type="submit" style={styles.submitBtn}>
                                {isEditing ? 'Update Language' : 'Add Language'}
                            </button>
                            
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(false); setFormData({ id: 0, preferredLanguage: '' }); }} 
                                    style={styles.cancelBtn}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>

                    {/* RIGHT PANEL: Table Card (List & Search) */}
                    <div style={{ ...styles.card, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ ...styles.tableTitle, margin: 0 }}>Language Management Table</h3>
                            
                            {/* SEARCH INPUT */}
                            <input 
                                type="text" 
                                placeholder="Search language..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                style={{ ...styles.input, width: '250px', marginBottom: 0, padding: '8px 12px' }}
                            />
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Preferred Language</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLanguages.length > 0 ? (
                                    currentLanguages.map((lang) => (
                                        <tr key={lang.id} style={{ transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#242729'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='transparent'}>
                                            <td style={styles.td}>{lang.id}</td>
                                            <td style={styles.td}>{lang.preferredLanguage}</td>
                                            <td style={styles.td}>
                                                <button onClick={() => handleEditClick(lang)} style={styles.editBtn}>
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button onClick={() => handleDetails(lang.id)} style={styles.detailsBtn}>
                                                    <i className="fas fa-info-circle"></i> Details
                                                </button>
                                                <button onClick={() => handleDelete(lang.id)} style={styles.deleteBtn}>
                                                    <i className="fas fa-trash"></i> Del
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ ...styles.td, textAlign: 'center', color: '#888' }}>No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* PAGINATION CONTROLS */}
                        <div style={styles.paginationContainer}>
                            <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                                Showing {filteredLanguages.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredLanguages.length)} of {filteredLanguages.length} entries
                            </span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={currentPage === 1}
                                    style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}
                                >
                                    Previous
                                </button>
                                <span style={{ color: '#fff', fontSize: '13px', padding: '0 5px' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages}
                                    style={currentPage === totalPages ? styles.pageBtnDisabled : styles.pageBtn}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* DETAILS CARD VIEW */}
                {detailsItem && (
                    <div style={{ ...styles.card, maxWidth: '500px' }}>
                        <h3 style={{ ...styles.cardTitle, textAlign: 'left', marginBottom: '15px' }}>Language Details</h3>
                        <p style={{ color: '#d1d1d1', marginBottom: '8px' }}><strong>ID:</strong> {detailsItem.id}</p>
                        <p style={{ color: '#d1d1d1', marginBottom: '15px' }}><strong>Preferred Language:</strong> {detailsItem.preferredLanguage}</p>
                        <button onClick={() => setDetailsItem(null)} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                            Close Details
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}