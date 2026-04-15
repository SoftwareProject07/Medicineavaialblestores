import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔹 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 NORMALIZE API DATA
  const normalizeUsers = (list) =>
    list.map((u) => ({
      id: u.id ?? u.Id,
      firstName: u.firstName ?? u.FirstName,
      lastName: u.lastName ?? u.LastName,
      email: u.email ?? u.Email,
      mobileNumber: u.mobileNumber ?? u.MobileNumber,
      fund: u.fund ?? u.Fund,
      type: u.type ?? u.Type,
      createdOn: u.createdOn ?? u.CreatedOn,
    }));

  // 🔹 GET USERS
  useEffect(() => {
    axios
      .get("https://ecommerencesite.onrender.com/api/USERMEDICINE/AllUserList")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data;
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

  // 🔹 PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45px" />
          <span>AKMedizostore</span>
        </div>
        <ul>
       <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                      <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                    <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>

               <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>

                      <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                      <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                     <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>

                       <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Admin Registeartion Form  </Link></li>

                                              <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>

                      <li className="mt-3">
                          <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                              <i className="fas fa-sign-out-alt"></i> LogOut
                          </button>
                      </li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">
        <h2>Customer User List</h2>

        <input
          className="form-control my-3"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>First Name</th>
              <th>Middlename</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Fund</th>
              <th>Type</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No customers found</td>
              </tr>
            ) : (
              currentItems.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName}</td>
                  <td>{u.middleName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.mobileNumber}</td>
                  <td>{u.fund}</td>
                  <td>{u.type}</td>
                  <td>{u.createdOn ? new Date(u.createdOn).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 🔹 PAGINATION CONTROLS */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries</span>
          
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
              </li>
              
              <li className="page-item active">
                <span className="page-link">{currentPage}</span>
              </li>

              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}