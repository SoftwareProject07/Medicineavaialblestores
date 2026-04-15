import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminCustomerHelpIssueList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://ecommerencesite.onrender.com/api/CustomerHelpIssueAPI/GetAllCustomerHelpIssues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching help issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTickClick = async (issue) => {
    const issueId = issue.customerhelpissueid || issue.customerHelpIssueId;
    const customerEmail = issue.customerHelpEmail || issue.CustomerHelpEmail;

    // 1. UI Status Update
    setIssues(prev => prev.map(item => 
      (item.customerhelpissueid || item.customerHelpIssueId) === issueId 
      ? { ...item, customerHelpStatus: "Confirm Sending", CustomerHelpStatus: "Confirm Sending" } 
      : item
    ));

    // 2. Create Notification for Customer in LocalStorage
    const newNotification = {
      id: Date.now(),
      message: "Your request is confirmed. 24 to 48 hrs connected to call.",
      time: new Date().toLocaleTimeString(),
      forEmail: customerEmail,
      isRead: false
    };

    const existingNotifs = JSON.parse(localStorage.getItem("customer_notifications") || "[]");
    localStorage.setItem("customer_notifications", JSON.stringify([...existingNotifs, newNotification]));

    alert("Status Updated & Message sent to Customer!");

    // 3. API Update (Background)
    try {
      await axios.put(`https://ecommerencesite.onrender.com/api/CustomerHelpIssueAPI/UpdateCustomerHelpIssueStatus/${issueId}`, {
        customerHelpIssueId: issueId,
        customerHelpStatus: "Confirm Sending"
      });
    } catch (error) {
      console.warn("API Update failed, but notification sent locally.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh' }}>
        <h5 className="text-success fw-bold">AKMedizo Admin</h5>
        <ul className="nav flex-column mt-4">
          <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-success w-100 mb-2">Help Issue List</Link></li>
          <li><button onClick={() => navigate('/header')} className="btn btn-danger w-100">LogOut</button></li>
        </ul>
      </div>

      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px' }}>
        <h2>Help Issues (Admin)</h2>
        <table className="table table-hover mt-4 shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => {
              const status = issue.customerHelpStatus || issue.CustomerHelpStatus || "Pending";
              return (
                <tr key={index}>
                  <td>{issue.customerhelpissueid || issue.customerHelpIssueId}</td>
                  <td>{issue.customerHelpName || issue.CustomerHelpName}</td>
                  <td>{issue.customerHelpEmail || issue.CustomerHelpEmail}</td>
                  <td><span className={`badge ${status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>{status}</span></td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm" 
                      onClick={() => handleTickClick(issue)}
                      disabled={status !== "Pending"}
                    >
                      <i className="fas fa-check"></i> Tick
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}