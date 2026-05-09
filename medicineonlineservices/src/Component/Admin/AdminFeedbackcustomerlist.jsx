import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminFeedbackcustomerlist() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    // State to track which buttons should be disabled
    const [sentIds, setSentIds] = useState([]);
    const navigate = useNavigate();

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://ecommerencesite.onrender.com/api/FeedbackCustomerApi/GetAllFeedbacks`);
            if (Array.isArray(response.data)) {
                setFeedbacks(response.data);
            } else if (response.data && response.data.data) {
                setFeedbacks(response.data.data);
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
        // Page load par check karein ki pehle kinhe thanks bhej chuke hain
        const savedSentIds = JSON.parse(localStorage.getItem('sent_thanks_ids') || '[]');
        setSentIds(savedSentIds);
    }, []);

    // --- MAIN LOGIC: Send Thanks & Disable Button ---
    const sendThanksMessage = (customerId, customerName) => {
        // 1. Notification save karein Customer ke liye
        const newNotif = {
            id: Date.now(),
            customerId: customerId,
            message: "Feedback dene ke liye thanks!",
            time: new Date().toLocaleTimeString(),
            isRead: false
        };

        const existingNotifs = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
        existingNotifs.push(newNotif);
        localStorage.setItem('customer_notifications', JSON.stringify(existingNotifs));

        // 2. Button ko disable karne ke liye ID store karein
        const updatedSentIds = [...sentIds, customerId];
        setSentIds(updatedSentIds);
        localStorage.setItem('sent_thanks_ids', JSON.stringify(updatedSentIds));
        
        alert(`Thanks sent to ${customerName}`);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
            <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100 }}>
                <div className="brand mb-4 d-flex align-items-center">
                    <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
                    <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
                </div>
               <ul>
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

            <div style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                    <h2>Customer Feedbacks</h2>
                    <button className="btn btn-outline-info btn-sm" onClick={fetchFeedbacks}>Refresh Data</button>
                </div>

                <div className="table-responsive bg-dark rounded border border-secondary">
                    <table className="table table-dark table-hover mb-0">
                        <thead className="table-secondary">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Message</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading...</td></tr>
                            ) : feedbacks.map((item) => {
                                // Check karein agar ID pehle se sent list mein hai
                                const isAlreadySent = sentIds.includes(item.freedbackcustomerid);
                                
                                return (
                                    <tr key={item.freedbackcustomerid}>
                                        <td>{item.freedbackcustomerid}</td>
                                        <td className="text-info fw-bold">{item.name}</td>
                                        <td>{item.email}</td>
                                        <td><span className="text-warning">{'★'.repeat(Number(item.starStatus || 0))}</span></td>
                                        <td>{item.message}</td>
                                        <td>
                                            <button 
                                                className={`btn btn-sm ${isAlreadySent ? 'btn-secondary' : 'btn-success'}`}
                                                onClick={() => sendThanksMessage(item.freedbackcustomerid, item.name)}
                                                disabled={isAlreadySent} // Button disable logic
                                            >
                                                {isAlreadySent ? 'Thanks Sent' : 'Feedback Thanks'}
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
    );
}