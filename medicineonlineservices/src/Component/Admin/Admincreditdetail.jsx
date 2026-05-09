import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCreditDetail() {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('https://ecommerencesite.onrender.com/api/BankdetailsWebapi/GetAllBankDetails');
      setBankDetails(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); 
    return () => clearInterval(interval);
  }, []);

  // AUTOMATIC ACTION ENGINE
  useEffect(() => {
    const processAutomations = () => {
      const currentTime = new Date().getTime();

      bankDetails.forEach((item) => {
        if (item.status === "Pending" || !item.status) {
          // Transaction time check (API se timestamp hona chahiye)
          const transactionTime = new Date(item.timestamp || new Date()).getTime(); 
          const diffInMinutes = (currentTime - transactionTime) / 60000;

          // 5 Minute hone par automatic action
          if (diffInMinutes >= 5) {
            handleAutoAction(item);
          }
        }
      });
    };

    if (bankDetails.length > 0) processAutomations();
  }, [bankDetails]);

  const handleAutoAction = async (item) => {
    let finalStatus = "";
    let customerMsg = "";

    // 1. ROLLBACK LOGIC (GST Deduction)
    if (item.isRefundRequested) {
      const gstRate = 0.18;
      const deduction = item.amount * gstRate;
      const finalRefund = item.amount - deduction;
      finalStatus = "Refunded (Rollback)";
      customerMsg = `Rollback Successful: ₹${finalRefund.toFixed(2)} aapke account me bhej diye gaye hain (18% GST ₹${deduction.toFixed(2)} deducted).`;
    } 
    // 2. FAILED LOGIC
    else if (item.amount <= 0 || item.type === "invalid") {
      finalStatus = "Failed";
      customerMsg = "Transaction Failed: Kripya bank balance ya details check karein.";
    } 
    // 3. ACCEPTED LOGIC
    else {
      finalStatus = "Accepted";
      customerMsg = `Aapka ₹${item.amount} ka payment safaltapurvak prapt ho gaya hai!`;
    }

    await updateBackend(item.id, finalStatus, customerMsg);
  };

  const updateBackend = async (id, status, msg) => {
    try {
      await axios.post(`https://ecommerencesite.onrender.com/api/BankdetailsWebapi/UpdateStatus`, {
        id: id,
        status: status,
        message: msg
      });
      fetchTransactions(); 
    } catch (err) {
      console.error("Auto-update failed", err);
    }
  };

  if (loading) return <div className="text-center mt-5 text-white">Loading Automation System...</div>;

  return (
    <div className="container-fluid bg-dark min-vh-100 p-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3>Payment Automation Center</h3>
        <span className="badge bg-primary">Auto-Processing: 1 Minute Delay</span>
      </div>
      
      <div className="table-responsive">
        <table className="table table-dark table-hover border-secondary">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions (Automatic)</th>
            </tr>
          </thead>
          <tbody>
            {bankDetails.map((item) => (
              <tr key={item.id}>
                <td>{item.userId}</td>
                <td>{item.cardNumber ? "Credit/Debit Card" : "UPI"}</td>
                <td className="text-info fw-bold">₹{item.amount}</td>
                <td>
                  <span className={`badge ${item.status === 'Accepted' ? 'bg-success' : item.status === 'Failed' ? 'bg-danger' : 'bg-warning'}`}>
                    {item.status || "Pending"}
                  </span>
                </td>
                <td>
                  {item.status ? (
                    <span className="text-success small">✅ Message Sent to Customer</span>
                  ) : (
                    /* Error Fixed: Wrapped in a DIV */
                    <div className="d-flex align-items-center">
                      <div className="spinner-border spinner-border-sm text-light me-2" role="status"></div>
                      <span className="text-muted small">Auto-verifying in 1m...</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}