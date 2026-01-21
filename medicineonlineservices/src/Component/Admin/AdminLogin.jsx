import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Adminlogin.css";
import Swal from "sweetalert2";

 //import "../styles/responsive-common.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const[mobile, setMobile]=useState("");
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
         Swal.fire("Warning", "Please enter Email Address  or  MobileNumber and Password", "warning");
         return;
       }
   

    const data = {
      Email: email,
      Password: password,
            MobileNumber:mobile

    };

    try {
      const response = await axios.post(
         "https://ecommerencesite.onrender.com/api/AdminApi/LOGINAdmin",
       // "http://localhost:5256/api/AdminApi/LOGINAdmin",

        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data?.isSuccess ||
        response.data?.success ||
        response.data?.status
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }


   Swal.fire({
            icon: "success",
            title: "Admin Login Successful",
            text: "Welcome to deshboardpanel",
          }).then(() => navigate("/deshboardpanel"));
        } else {
          Swal.fire(
            "Admin Login Failed",
            response.data?.responseMessage ||
              response.data?.message ||
              "Invalid Email/MobileNumber or Password",
            "error"
          );
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Server Error", "Please try again later", "error");
      }
    };

  return (
    <section className="vh-100">
      <div className="container-fluid">




        <div className="row">

          {/* LEFT SECTION */}
          <div className="col-sm-6 text-black">
           
            <div className="px-5 ms-xl-4">
                <span
        className="d-flex align-items-center text-secondary fw-semibold"
        style={{ cursor: "pointer" }}
        onClick={() => console.log("Skip clicked")}
      >
        {/* <i className="fas fa-times me-2"></i>skip  */}
      {/* <Link to="/login">   </Link> */}
        {/* <Link to=" ">Skip</Link> */}
        <i
      className="fas fa-times me-2"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/header")}
    >
      {/* skip */}
    </i>
      </span>
              <i
                className="fas fa-crow fa-2x me-3 pt-5 mt-xl-4"
                style={{ color: "#709085" }}
              ></i>
              <span className="h1 fw-bold mb-0">Logo</span>
            </div>

            <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
              {/* ✅ ONLY CHANGE: onSubmit */}
              <form style={{ width: "23rem" }} onSubmit={handleSave}>

                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Admin Login
                </h3>

                <div className="form-outline mb-4">
                  <input
                    type="email || mobile"
                    className="form-control form-control-lg"
                    placeholder="Email address/MobileNumber"
                    value={email || mobile}
                    onChange={(e) => (setEmail(e.target.value)|| setMobile(e.target.value))}
                  />
                </div>

           
                        <div style={{ position: "relative", width: "370px" }}>

            <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
         className="form-control form-control-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", paddingRight: "40px" }}
      />
   <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {showPassword ? "🙈" : "👁️"}
      </span>
    </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block w-100"
                    type="submit"
                  >
                    Admin Login
                  </button>
                </div>

               

              </form>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
              alt="Admin Login"
              className="w-100 vh-100"
              style={{ objectFit: "cover", objectPosition: "left" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
