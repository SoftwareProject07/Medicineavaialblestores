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

// Sample chart data
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
          nextDose: "8.00 am",
          status: "On Time",
        
          // id: 2,
          // name: "paracitamol 500mg",
          // frequency: " 6hour",
          // dosage: "2 Tablet",
          // taken: true,
          // meal: "Before",
          // nextDose: "6.00 am",
          // status: "On Time"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  return (
    <div className="app-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
<div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45px" />
          {/* <span>AKMedizostore</span> */}
                    {user ? `${user.firstName} ${user.lastName}` : "User"}

        </div>        <ul>
          {/* Dashboard Dropdown */}
          <li className="menu-group">
            {/* <span
              className="menu-title   btn btn-success mb-2"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard {openDashboard ? "▾" : "▸"}
            </span> */}

            <Link
              to="/dashboards"
              className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard
              <span>{openDashboard ? "▾" : "▸"}</span>
            </Link>
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

          {/* Other menu items */}
                      <Link to="/medicinedisplay" className="btn btn-success mb-2">Medicines</Link><br></br>
            <Link  to="/carts" className="btn btn-success mb-2">Medicine Cart</Link><br></br>
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

    {/* ✅ USER IMAGE */}
    {/* <img
      src={
        user?.photoUrl && user.photoUrl.startsWith("http")
          ? user.photoUrl
          : "/default-user.png"
      }
      alt="User"
      className="nav-user-photo"
      onError={(e) => {
        e.target.src = "/default-user.png";
      }}
    /> */}
    <img
  src={user?.photoUrl || "/default-user.png"}
  alt="User"
  className="nav-user-photo"
  onError={(e) => {
    e.target.src = "/default-user.png";
  }}
/>


    <span className="nav-icon">🔔</span>
    <span className="nav-icon">⚙️</span>

  </div>
        </header>

        <div className="medicines-page">
          {/* <h2>Welcome back, Suvashini</h2> */}
             {/* <h2>  Welcome back, ${user?.firstName} ${user?.lastName}</h2> */}

           <h2>  Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"} </h2>

          {/* Summary Cards */}
          <div className="cards">
            <div className="card blue">Medication Tracker</div>
            <div className="card green">Test Reports</div>
            <div className="card pink">Health History</div>
            <div className="card purple">Monthly Progress</div>
          </div>

          {/* Charts */}
          <div className="reports">
            <div className="box">
              <h4>Blood Glucose</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={glucoseData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
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
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="box">
              <h4>Blood Pressure Status</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={bpData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {bpData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Medication Table */}
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
                {medications.length > 0 ? (
                  medications.map((m) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No medications saved</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
