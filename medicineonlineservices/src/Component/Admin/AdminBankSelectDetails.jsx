import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BASE_URL = "https://ecommerencesite.onrender.com/api/bankselectmodelsAPI";
//const LOCAL_URL = "http://localhost:5256/api/bankselectmodelsAPI";
const API_URL = BASE_URL; 

export default function AdminBankSelectDetails() {
    const [banks, setBanks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ bankselectedid: 0, bankName: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/GetAllBankSelect`);
            // DEBUG: See exactly what the keys are named (e.g., bankId vs id)
            console.log("API Data received:", res.data);
            setBanks(res.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBanks(); }, []);

    const handleDelete = async (id) => {
        // Validation check
        if (id === undefined || id === null || id === 0) {
            alert("Error: ID is missing or 0! Check console for data structure.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this bank?")) return;

        try {
            const response = await axios.delete(`${API_URL}/DeleteBankSelectModel?id=${id}`);

            if (response.status === 200 || response.status === 204) {
                // UI update: logic matches the fallback used in the map
                setBanks((prev) => prev.filter(bank => 
                    (bank.bankselectedid || bank.id || bank.bankselectid || bank._id) !== id
                ));
                alert("🗑️ Deleted Successfully!");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert("❌ Delete failed!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_URL}/UpdateBankSelectModel`, formData);
                alert("✅ Updated!");
            } else {
                await axios.post(`${API_URL}/AddBankSelect`, formData);
                alert("✅ Saved!");
            }
            resetForm();
            fetchBanks();
        } catch (err) {
            alert("Action failed.");
        }
    };

    const resetForm = () => {
        setFormData({ bankselectedid: 0, bankName: '' });
        setIsEditing(false);
    };

    const filteredBanks = banks.filter(bank =>
        bank.bankName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh' }}>
                <h5 className="text-success fw-bold">AKMedizo Admin</h5>
                <ul className="nav flex-column mt-4">
 <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                               <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                             <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
         
                        <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
         
                               <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                               <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                              <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
                                         <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>

                                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Admin Registeartion Form  </Link></li>
         
                                                       <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
         
                               <li className="mt-3">
                                   <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                                       <i className="fas fa-sign-out-alt"></i> LogOut
                                   </button>
                               </li>
       
        </ul>
          </div>

            {/* Main Content */}
            <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 className="mb-4 fw-bold">Bank Management Master</h2>

                    <input
                        type="text"
                        className="form-control mb-4 bg-dark text-white border-secondary"
                        placeholder="🔍 Search bank name..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Entry Form */}
                    <div className="card bg-dark border-secondary mb-5 shadow">
                        <div className="card-header border-secondary text-center fw-bold">
                            {isEditing ? "EDIT BANK RECORD" : "ADD NEW BANK"}
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} className="d-flex gap-3">
                                <input
                                    type="text"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Enter Bank Name"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn btn-success px-5 fw-bold">
                                    {isEditing ? "UPDATE" : "SAVE"}
                                </button>
                                {isEditing && (
                                    <button type="button" className="btn btn-outline-light" onClick={resetForm}>Cancel</button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive shadow">
                        <table className="table table-dark table-hover border-secondary">
                            <thead>
                                <tr>
                                    <th>BANK NAME</th>
                                    <th className="text-end px-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="2" className="text-center">Loading...</td></tr>
                                ) : filteredBanks.map((bank) => {
                                    // EXTRACT ID: Check every possible naming convention
                                    const currentId = bank.bankselectedid || bank.id || bank.bankselectid || bank._id;

                                    return (
                                        <tr key={currentId} className="border-secondary">
                                            <td className="align-middle fw-bold">{bank.bankName}</td>
                                            <td className="text-end px-4">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => { setFormData(bank); setIsEditing(true); }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(currentId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}