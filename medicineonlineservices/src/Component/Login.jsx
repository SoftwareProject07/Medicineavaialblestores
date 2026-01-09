import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaGoogle, FaLinkedin, FaInstagram } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/logins.css";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email or mobile
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      Swal.fire("Warning", "Please enter Email/Mobile and Password", "warning");
      return;
    }

    // Decide whether identifier is email or mobile
    const isEmail = identifier.includes("@");
    const data = {
      Email: isEmail ? identifier : null,
      MobileNumber: !isEmail ? identifier : null,
      Password: password,
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.isSuccess || response.data?.success || response.data?.status) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data.userMedicine) {
          localStorage.setItem("user", JSON.stringify(response.data.userMedicine));
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to Dashboard",
        }).then(() => navigate("/dashboards"));
      } else {
        Swal.fire(
          "Login Failed",
          response.data?.responseMessage ||
            response.data?.message ||
            "Invalid Email/Mobile or Password",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-left">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            alt="illustration"
          />
        </div>

        <div className="login-right">
          <div className="social">
            <span>Sign in with</span>
            <div className="icons">
              <Link to="https://www.facebook.com" className="social-icon"><FaFacebook size={24} color="white" /></Link>
              <Link to="https://x.com/i/flow/login" className="social-icon"><FaTwitter size={24} color="white" /></Link>
              <Link to="https://www.google.com" className="social-icon"><FaGoogle size={24} color="white" /></Link>
              <Link to="https://www.linkedin.com" className="social-icon"><FaLinkedin size={24} color="white" /></Link>
              <Link to="https://www.instagram.com" className="social-icon"><FaInstagram size={24} color="white" /></Link>
            </div>
          </div>

          <div className="divider"><span>Or</span></div>

          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Email address or Mobile Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" /> <span>Remember</span> me
              </label>
              <Link to="/loginforgetpasswords">Forget password?</Link>
            </div>

            <button type="submit" className="login-btn">LOGIN</button>
          </form>

          <p className="register">
            Don’t have an account? <Link to="/registeration">Register</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        <span>Copyright © 2026. All rights reserved.</span>
        <div className="footer-icons">
          <Link to="https://www.facebook.com" className="social-icon"><FaFacebook size={24} color="white" /></Link>
          <Link to="https://x.com/i/flow/login" className="social-icon"><FaTwitter size={24} color="white" /></Link>
          <Link to="https://www.google.com" className="social-icon"><FaGoogle size={24} color="white" /></Link>
          <Link to="https://www.linkedin.com" className="social-icon"><FaLinkedin size={24} color="white" /></Link>
          <Link to="https://www.instagram.com" className="social-icon"><FaInstagram size={24} color="white" /></Link>
        </div>
      </footer>
    </>
  );
}
