import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 NORMALIZE API DATA (MOST IMPORTANT)
  const normalizeUsers = (list) =>
    list.map((u) => ({
      id: u.id ?? u.Id,
      firstName: u.firstName ?? u.FirstName,
      lastName: u.lastName ?? u.LastName,
      email: u.email ?? u.Email,
      mobileNumber: u.mobileNumber ?? u.MobileNumber,
      fund: u.fund ?? u.Fund,
      type: u.type ?? u.Type,
    //  photoUrl: u.photoUrl ?? u.PhotoUrl,
      createdOn: u.createdOn ?? u.CreatedOn,
    }));

  // 🔹 GET USERS
  useEffect(() => {
    axios
      .get(
        //"http://localhost:5256/api/USERMEDICINE/AllUserList"
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/AllUserList"
      )
      .then((res) => {
        console.log("API FULL RESPONSE 👉", res.data);

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data;

        console.log("FINAL USER LIST 👉", list);

        setUsers(Array.isArray(list) ? normalizeUsers(list) : []);
      })
      .catch((err) => {
        console.error("API ERROR 👉", err);
        setUsers([]);
      });
  }, []);

  // 🔹 SEARCH FILTER
  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   <div className="dashboard-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45px" />
          <span>AKMedizostore</span>
        </div>

        <ul>
         {/* <li className="menu-group">  
            <span
              className="menu-title btn btn-success mb-2"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard {openDashboard ? "▾" : "▸"}
            </span> 


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
          </li> */}

           <Link to="/deshboardpanel" className="btn btn-success mb-2">Admin Dashboard</Link>
                                         <li>Cart</li>
                                        {/* <Link to="/customerdetails" className="btn btn-success mb-2">Patience Details</Link>  */}
                                         

          <li>OrdersPayment</li>

     <li><Link  to="/customerlists" className="btn btn-success mb-2">   CustomerLIST </Link></li>

          <li>OrderList</li>

          {/* <li>Customer Profile</li> */}
           {/* className="btn btn-success mb-2" */}
          <li><Link to="/adminlogin"><i class="fas fa-sign-out-alt"></i> LogOut</Link></li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">
        <h2>Customer User List</h2>

        <input
          className="form-control my-3"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Fund</th>
              <th>Type</th>
                          {/* <th>Photo</th> */}

              <th>Created On</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  {/* <td>
                    {u.photoUrl ? (
                      <img
                        src={u.photoUrl}
                        alt="user"
                        width="50"
                        height="50"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      "No Photo"
                    )}
                  </td> */}
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.mobileNumber}</td>
                  <td>{u.fund}</td>
                  <td>{u.type}</td>
                  <td>
                    {u.createdOn
                      ? new Date(u.createdOn).toLocaleDateString()
                      : "N/A"}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
