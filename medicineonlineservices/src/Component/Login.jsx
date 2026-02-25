import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaGoogle, FaLinkedin, FaInstagram } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Component/User/AuthContext";
import { useCart } from "../Component/User/CartContext";
import "./styles/logins.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { syncUserCart } = useCart();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
  const handleSave = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      Swal.fire("Warning", "Email / Mobile & Password required", "warning");
      return;
    }

    const payload = {
      Email: loginId,
      MobileNumber: loginId,
      Password: password,
    };

    setLoading(true);

    try {
      const res = await axios.post(
        "https://ecommerencesite.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
        payload,
        { 
          headers: { "Content-Type": "application/json" },
          timeout: 25000 // Render wake-up time allowance
        }
      );

      if (res.data?.status === true) {
        const user = res.data.userMedicine;

        // 1. Save Token
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // 2. Format and Save User Data
        const userData = {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        // 3. Update Auth & Sync Cart
        await login(userData);
        if (syncUserCart) {
            syncUserCart(); // Ab ye user-specific key se data uthayega
        }

        Swal.fire("Success", "Login Successful", "success").then(() => {
          navigate("/dashboards");
        });
      } else {
        Swal.fire("Login Failed", res.data?.responseMessage || "Invalid Credentials", "error");
      }
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire("Server Error", "Unable to connect. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGET PASSWORD =================
  const handleForgetPasswordPopup = async () => {
    const { value } = await Swal.fire({
      title: "Forget Password",
      html: `
        <input id="fp-identity" class="swal2-input" placeholder="Email / Mobile">
        <input id="fp-password" type="password" class="swal2-input" placeholder="New Password">
      `,
      showCancelButton: true,
      confirmButtonText: "Reset",
      preConfirm: () => {
        const identity = document.getElementById("fp-identity").value;
        const newPassword = document.getElementById("fp-password").value;
        if (!identity || !newPassword) {
          Swal.showValidationMessage("All fields required");
          return false;
        }
        return { identity, newPassword };
      },
    });

    if (!value) return;

    try {
      await axios.post(
        "https://ecommerencesite.onrender.com/api/USERMEDICINE/ForgetPassword",
        {
          Email: value.identity,
          PhoneNumber: value.identity,
          NewPassword: value.newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      Swal.fire("Success", "Password Reset Successful", "success");
    } catch {
      Swal.fire("Error", "Reset Failed", "error");
    }
  };

  return (
    <>
      <div className="login-page">
        <i className="fas fa-times close-icon" onClick={() => navigate("/header")} />

        <div className="login-left">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="login" />
        </div>

        <div className="login-right">
          <div className="social">
            <span>Sign in with</span>
            <div className="icons">
              <FaFacebook /> <FaTwitter /> <FaGoogle /> <FaLinkedin /> <FaInstagram />
            </div>
          </div>

          <div className="divider"><span>Or</span></div>

          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Email or Mobile"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={loading}
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" /> <span> Remember </span>me
              </label>
              <span className="forget-link" onClick={handleForgetPasswordPopup}>
                Forget password?
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "PROCESSING..." : "LOGIN"}
            </button>
          </form>

          <p className="register">
            Don’t have an account? <Link to="/registeration">Register</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        Copyright © 2025-2027 Ultra IT Solutions! All rights reserved.
        <span> - Developed by Gautam Dev vite v5.4.21</span>
      </footer>
    </>
  );
}