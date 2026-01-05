import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/logins.css";
// import Popup from './Popup';

export default function Login() {
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
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login Response 👉", response.data);

      if (
        response.data?.isSuccess === true ||
        response.data?.success === true ||
        response.data?.status === true
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        alert("Login Successful ✅");
        navigate("/dashboards");
      } else {
        alert(
          response.data.responseMessage ||
            response.data.message ||
            "Invalid Email or Password"
        );
      }
    } catch (error) {
      console.error("Login Error 👉", error);
      alert("Server error, please try again later");
    }
  };



  return (
    <>
      <div className="login-page">
        {/* LEFT IMAGE */}
        <div className="login-left">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="illustration"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="login-right">
          <div className="social">
            <span>Sign in with</span>
            <div className="icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-linkedin-in"></i>
            </div>
          </div>

          <div className="divider">
            <span>Or</span>
          </div>

          {/* ✅ ONLY onSubmit */}
          <form onSubmit={handleSave}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
                  {/* {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />} */}
          </form>

          <p className="register">
            Don’t have an account?
            <Link to="/registeration"> Register</Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span>Copyright © 2026. All rights reserved.</span>
        <div className="footer-icons">
      <i className="fab fa-facebook">  <Link to="/https://www.google.com/"/>  </i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-google"></i>
          <i className="fab fa-linkedin-in"></i>
        </div>
      </footer>
    </>
  );
}
