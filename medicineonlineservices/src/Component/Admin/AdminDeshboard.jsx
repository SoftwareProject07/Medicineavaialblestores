import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");

  const handleLinkClick = (e) => {
    e.preventDefault(); // stop default navigation
    setShowPopup(true); // show popup
  };

  const handleSubmit = () => {
    if (password === "admin123") {
      setIsAuthenticated(true); // ✅ show dashboard
      setShowPopup(false); // close popup
    } else {
      alert("Sorry, click the password Admin profile"); // ❌ wrong password
    }
    setPassword(""); // reset input
  };

  return (
    <div>
      {/* Admin Dashboard Link */}
      <Link
        to="/deshboardpanel"
        className="btn btn-success mb-2"
        onClick={handleLinkClick}
      >
        Admin Dashboard
      </Link>

      {/* Password Popup */}
      {showPopup && !isAuthenticated && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h4>Enter Admin Password</h4>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ marginRight: "10px" }}
            >
              Submit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Data */}
      {isAuthenticated && (
        <div style={{ marginTop: "20px" }}>
          <h2>Admin Dashboard Panel</h2>
          <p>Welcome Admin! Here is your dashboard data:</p>
          <ul>
            <li>📊 User Statistics</li>
            <li>💊 Medication Tracking</li>
            <li>🧾 Reports & Logs</li>
            <li>⚙️ Settings</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
