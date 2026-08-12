import React, { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaGoogle, FaLinkedin, FaInstagram, FaSyncAlt } from "react-icons/fa";
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

  // --- Captcha States ---
  const [captchaText, setCaptchaText] = useState("");
  const [userInputCaptcha, setUserInputCaptcha] = useState("");

  // Random Captcha Generator Function
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInputCaptcha(""); // Reset input on refresh
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // ================= LOGIN =================
  const handleSave = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      Swal.fire("Warning", "Email / Mobile & Password required", "warning");
      return;
    }

    // Captcha Validation Check
    if (!userInputCaptcha.trim()) {
      Swal.fire("Warning", "Please enter the Captcha code", "warning");
      return;
    }

    if (userInputCaptcha !== captchaText) {
      Swal.fire("Error", "Invalid Captcha Code. Please try again.", "error");
      generateCaptcha(); // Refresh captcha on failure
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
            syncUserCart(); 
        }

        Swal.fire("Success", "Login Successful", "success").then(() => {
          navigate("/dashboards");
        });
      } else {
        Swal.fire("Login Failed", res.data?.responseMessage || "Invalid Credentials", "error");
        generateCaptcha(); // Refresh captcha on invalid login
      }
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire("Server Error", "Unable to connect. Please try again later.", "error");
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // =================FORGET PASSWORD ===========================
  const handleForgetPasswordPopup = async () => {
    const { value } = await Swal.fire({
      title: "Forget Password",
      background: '#1a1a1a',
      color: '#fff',
      html: `
        <div style="text-align: left; padding: 10px; position: relative;">
          <label style="color: gray; font-size: 12px; display: block; margin-bottom: 5px;">Email or Mobile</label>
          <input id="fp-identity" class="swal2-input" placeholder="example@gmail.com" style="width: 90%; margin-bottom: 15px;">
          
          <label style="color: gray; font-size: 12px; display: block; margin-bottom: 5px;">New Password</label>
          <div style="position: relative;">
            <input id="fp-password" type="password" class="swal2-input" placeholder="********" style="width: 90%; padding-right: 40px;">
            <span id="togglePassword" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 18px; z-index: 10;">
              👁️
            </span>
          </div>
        </div>
      `,
      didOpen: () => {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('fp-password');
        
        toggleBtn.addEventListener('click', () => {
          const isPassword = passwordInput.getAttribute('type') === 'password';
          passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
          toggleBtn.textContent = isPassword ? '🙈' : '👁️';
        });
      },
      showCancelButton: true,
      confirmButtonText: "Reset Password",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const identity = document.getElementById("fp-identity").value.trim();
        const newPassword = document.getElementById("fp-password").value.trim();

        if (!identity || !newPassword) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }

        const isEmail = identity.includes("@");
        const payload = {
          Email: isEmail ? identity : "",
          PhoneNumber: !isEmail ? identity : "",
          NewPassword: newPassword,
          UserName: "" 
        };

        try {
          const response = await axios.post(
            "https://ecommerencesite.onrender.com/api/USERMEDICINE/ForgetPassword",
            payload,
            { headers: { "Content-Type": "application/json" }, timeout: 30000 }
          );
          
          if (response.data.status === true) return response.data;
          else throw new Error(response.data.message || "User not found");
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message || "Server Error"}`);
        }
      }
    });

    if (value && value.status === true) {
      Swal.fire("Success", "Password reset successfully!", "success");
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

            {/* --- Captcha Section Added as per Screenshot --- */}
            <div className="captcha-container mb-3" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div 
                className="captcha-display form-control bg-light text-center fw-bold text-dark user-select-none" 
                style={{ 
                  letterSpacing: "4px", 
                  fontSize: "18px", 
                  fontFamily: "monospace",
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {captchaText}
              </div>
              <button 
                type="button" 
                className="btn btn-secondary d-flex align-items-center justify-content-center" 
                onClick={generateCaptcha}
                title="Refresh Captcha"
                style={{ height: "38px", width: "38px", padding: 0 }}
              >
                <FaSyncAlt />
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter Captcha Code"
              value={userInputCaptcha}
              onChange={(e) => setUserInputCaptcha(e.target.value)}
              disabled={loading}
              className="form-control mb-3"
            />
            {/* --------------------------------------------- */}

            <div className="options">
              <label className="remember-me">
                <input type="checkbox" /> <span> Remember </span>me
              </label>
              <span className="forget-link" onClick={handleForgetPasswordPopup} style={{ cursor: 'pointer', color: 'blue' }}>
                Forget password?
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "PROCESSING..." : "LOGIN"}
            </button>
          </form>

          <p className="register">
            Don’t have an account? <Link to="/registeration" className="btn btn-info">
              Register
            </Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        Copyright © 2025-2027 Ultra IT Solutions! All rights reserved.
        <span> - Developed by Gautam Dev  v5.4.21</span>
      </footer>
    </>
  );
}