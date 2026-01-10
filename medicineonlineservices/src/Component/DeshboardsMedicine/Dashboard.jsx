import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import "../styles/dashboardsprofiles.css";

/* ---------- SAMPLE DATA ---------- */
const weightData = [
  { date: "May 01", weight: 180 },
  { date: "May 10", weight: 178 },
  { date: "May 20", weight: 176 },
  { date: "Jun 01", weight: 175 }
];

const glucoseData = [
  { day: "Yesterday", value: 185 },
  { day: "2 Days Ago", value: 105 },
  { day: "Last Week", value: 115 },
  { day: "Today", value: 110 }
];

const bpData = [
  { label: "Normal", value: 40 },
  { label: "Elevated", value: 25 },
  { label: "High", value: 35 }
];

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

export default function Dashboard() {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [medications, setMedications] = useState([]);
  const [user, setUser] = useState(null);

  /* ---------- LOAD USER ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------- LOAD MEDICATIONS ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("medications");
    if (saved) {
      setMedications(JSON.parse(saved));
    } else {
      setMedications([
        {
          id: 1,
          name: "Kefalur 500mg",
          frequency: "8 hour",
          dosage: "1 Tablet",
          taken: true,
          meal: "After",
          nextDose: "8:00 AM",
          status: "On Time"
        }
      ]);
    }
  }, []);

  return (
    <div className="app-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45" />
          <span>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>

        <ul>
          <li className="menu-group">
            <button
              className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
            </button>

            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                <li><Link to="/test-reports">Test Reports</Link></li>
                <li><Link to="/health-history">Health History</Link></li>
                <li><Link to="/monthly-progress">Monthly Progress</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/support">Help & Support</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/medicinedisplay" className="btn btn-success mb-2">Medicines</Link></li>
          <li><Link to="/carts" className="btn btn-success mb-2">Medicine Cart</Link></li>
          <Link to="/customerdetails" className="btn btn-success mb-2">Patience Details</Link> 
                                                              <li>OrdersPayment</li>
          <li>CustomerTracking</li>

                       <li>OrderStatus</li>

            <li>customer  Profile</li>
          <li><Link to="/header"><i className="fas fa-sign-out-alt"></i>LogOut</Link></li>
        </ul>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="main-content">
        <header>
          <div className="header-right">
            {/* ✅ SAFE PROFILE IMAGE */}
           {user?.photo && (
              <img
              //  src={`http://localhost:5256/uploads/${user.photo}`}
              src= {`https://ecommerencesite-api.onrender.com/apiuploads/${user.photo}`}
                alt="Profile"
                className="nav-user-photo"
              />
            )} 

            {/* {user?.photo && (
  <img
    src={user.photo.startsWith("http")
      ? user.photo
      : `http://localhost:5256/uploads/${user.photo}`}
       //    : `https://ecommerencesite-api.onrender.com/apiuploads/${user.photo}`}

    alt="Profile"
    className="nav-user-photo"
  />
)} */}

            <span className="nav-icon">🔔</span>
            <span className="nav-icon">⚙️</span>
          </div>
        </header>

        <h2>
          Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
        </h2>

        {/* ---------- CARDS ---------- */}
        <div className="cards">
          <div className="card blue">Medication Tracker</div>
          <div className="card green">Test Reports</div>
          <div className="card pink">Health History</div>
          <div className="card purple">Monthly Progress</div>
        </div>

        {/* ---------- CHARTS ---------- */}
        <div className="reports">
          <div className="box">
            <h4>Blood Glucose</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={glucoseData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Weight Progress</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Blood Pressure Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bpData} dataKey="value" outerRadius={80} label>
                  {bpData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- MEDICATION TABLE ---------- */}
        <div className="table-container">
          <h3>Medication Tracker</h3>
          <table className="med-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Frequency</th>
                <th>Dosage</th>
                <th>Taken</th>
                <th>Meal</th>
                <th>Next Dose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.frequency}</td>
                  <td>{m.dosage}</td>
                  <td>{m.taken ? "Yes" : "No"}</td>
                  <td>{m.meal}</td>
                  <td>{m.nextDose}</td>
                  <td className={m.status === "Missed" ? "missed" : "ontime"}>
                    {m.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
