import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminRegisteration() {
  const navigate = useNavigate();

  // States
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    if (!firstname || !lastname || !password || !email || !mobile) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("FirstName", firstname);
    formData.append("MiddleName", middlename || "");
    formData.append("LastName", lastname);
    formData.append("Password", password);
    formData.append("Email", email);
    formData.append("MobileNumber", mobile);
    formData.append("Fund", 0);
    formData.append("Type", "User");
    formData.append("CreateOn", new Date().toISOString());

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/AdminApi/CREATERegisterAdmin",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.isSuccess) {
        Swal.fire("Success", "Admin Registration Successful", "success")
          .then(() => navigate("/adminlogin"));
      } else {
        Swal.fire("Error", response.data?.message || "Failed", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };

  const handleReset = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPassword("");
    setEmail("");
    setMobile("");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR MENU */}
      <nav className="bg-light border-end p-3" style={{ width: "280px" }}>
 <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>        <ul className="list-unstyled">
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
      </nav>

      {/* MAIN CONTENT AREA */}
      <section className="flex-grow-1 bg-dark overflow-auto">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              <div className="card card-registration my-4 shadow-lg">
                <div className="row g-0">
                  {/* Image Section */}
                  <div className="col-xl-5 d-none d-xl-block">
                    <img 
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                      alt="Registration" 
                      className="img-fluid h-100"
                      style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem", objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Form Section */}
                  <div className="col-xl-7">
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-4 text-uppercase fw-bold">Admin Registration</h3>
                      <hr />

                      <div className="row mt-4">
                        <div className="col-md-4 mb-4">
                          <label className="form-label">First Name</label>
                          <input type="text" className="form-control" placeholder="First Name"
                            value={firstname} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="col-md-4 mb-4">
                          <label className="form-label">Middle Name</label>
                          <input type="text" className="form-control" placeholder="Middle Name"
                            value={middlename} onChange={(e) => setMiddleName(e.target.value)} />
                        </div>
                        <div className="col-md-4 mb-4">
                          <label className="form-label">Last Name</label>
                          <input type="text" className="form-control" placeholder="Last Name"
                            value={lastname} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} required
                          />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Email ID</label>
                        <input type="email" className="form-control" placeholder="Email ID"
                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Mobile Number</label>
                        <input type="text" className="form-control" placeholder="Mobile Number"
                          value={mobile} maxLength={10} onChange={(e) => setMobile(e.target.value)} required/>
                      </div>

                      <div className="d-flex justify-content-end pt-3">
                        <button type="button" className="btn btn-light btn-lg me-2" onClick={handleReset}>Reset</button>
                        <button type="button" className="btn btn-warning btn-lg px-5" onClick={handleSave}>Register Admin</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}