import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaGoogle,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Component/User/AuthContext"; // ✅ IMPORTANT
import "./styles/logins.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ HOOK TOP LEVEL

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ================= LOGIN =================
  const handleSave = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      Swal.fire(
        "Warning",
        "Please enter Email or Mobile Number and Password",
        "warning"
      );
      return;
    }

    const payload = {
      Email: loginId,
      MobileNumber: loginId,
      Password: password,
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
       // "http://localhost:5256/api/USERMEDICINE/LOGINUserMedicine", 
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ SUCCESS
      if (response.data?.userMedicine) {
        // 🔐 SAVE TOKEN
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
// User different login access/Creditional  data storage  
        localStorage.setItem(
  "user",
  JSON.stringify(response.data.userMedicine)
);

        // ✅ VERY IMPORTANT (REAL USER DATA FROM API)
        const userData = {
          email: response.data.userMedicine.email, // ❗ EXACT
          firstName: response.data.userMedicine.firstName,
          lastName: response.data.userMedicine.lastName,
          userId: response.data.userMedicine.id,
        };

        // ✅ AuthContext LOGIN
        login(userData);

        Swal.fire("Success", "Login Successful", "success").then(() => {
          navigate("/dashboards");
        });
      } else {
        Swal.fire(
          "Login Failed",
          response.data?.responseMessage ||
            "Invalid Email / Mobile or Password",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };

  // ================= FORGET PASSWORD =================
  const handleForgetPasswordPopup = async () => {
    const { value } = await Swal.fire({
      title: "Forget Password",
      html: `
        <input id="fp-identity" class="swal2-input" placeholder="Email / Mobile / Username">
        <input id="fp-password" type="password" class="swal2-input" placeholder="New Password">
      `,
      showCancelButton: true,
      confirmButtonText: "Reset Password",
      preConfirm: () => {
        const identity = document.getElementById("fp-identity").value;
        const newPassword = document.getElementById("fp-password").value;

        if (!identity || !newPassword) {
          Swal.showValidationMessage(
            "Email / Mobile / Username and New Password are required"
          );
          return false;
        }
        return { identity, newPassword };
      },
    });

    if (!value) return;

    try {
      const payload = {
        Email: value.identity,
        PhoneNumber: value.identity,
        UserName: value.identity,
        NewPassword: value.newPassword,
      };

      const response = await axios.post(
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/ForgetPassword",
        
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.status === true) {
        Swal.fire("Success", "Password reset successful", "success");
      } else {
        Swal.fire(
          "Failed",
          response.data?.responseMessage ||
            "Invalid Email / Mobile / Username",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Server error", "error");
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
              <Link to="https://www.facebook.com" className="social-icon">
                <FaFacebook size={24} color="white" />
              </Link>
              <Link to="https://x.com/i/flow/login" className="social-icon">
                <FaTwitter size={24} color="white" />
              </Link>
              <Link to="https://www.google.com" className="social-icon">
                <FaGoogle size={24} color="white" />
              </Link>
              <Link to="https://www.linkedin.com" className="social-icon">
                <FaLinkedin size={24} color="white" />
              </Link>
              <Link to="https://www.instagram.com" className="social-icon">
                <FaInstagram size={24} color="white" />
              </Link>
            </div>
          </div>

          <div className="divider">
            <span>Or</span>
          </div>

          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Email address or Mobile Number"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
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

              <span
                className="forget-link"
                onClick={handleForgetPasswordPopup}
              >
                Forget password?
              </span>
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>

          <p className="register">
            Don’t have an account?{" "}
            <Link to="/registeration">Register</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        <span>Copyright © 2026. All rights reserved.</span>
          <div className="icons">
              <Link to="https://www.facebook.com" className="social-icon">
                <FaFacebook size={24} color="white" />
              </Link>
              <Link to="https://x.com/i/flow/login" className="social-icon">
                <FaTwitter size={24} color="white" />
              </Link>
              <Link to="https://www.google.com" className="social-icon">
                <FaGoogle size={24} color="white" />
              </Link>
              <Link to="https://www.linkedin.com" className="social-icon">
                <FaLinkedin size={24} color="white" />
              </Link>
              <Link to="https://www.instagram.com" className="social-icon">
                <FaInstagram size={24} color="white" />
              </Link>
            </div>
      </footer>
    </>
  );
}
