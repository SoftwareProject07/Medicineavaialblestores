import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Adminlogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter Email and Password");
      return;
    }

    const data = {
      Email: email,
      Password: password,
    };

    try {
      const response = await axios.post(
         "https://ecommerencesite-api.onrender.com/api/AdminApi/LOGINAdmin",
        //"http://localhost:5256/api/AdminApi/LOGINAdmin",

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

        alert("Admin Login Successful ✅");
        navigate("/deshboardpanel");
      } else {
        alert(response.data.message || "Invalid Email or Password");
      }
    } catch (error) {
      alert("Server error, please try again later");
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid">
        <div className="row">

          {/* LEFT SECTION */}
          <div className="col-sm-6 text-black">
            <div className="px-5 ms-xl-4">
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
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block w-100"
                    type="submit"
                  >
                    Login
                  </button>
                </div>

                <p className="small mb-4">
                  <a className="text-muted" href="#">
                    Forgot password?
                  </a>
                </p>

                <p>
                  Don’t have an account?{" "}
                  <a href="#" className="link-info">
                    Register here
                  </a>
                </p>

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
