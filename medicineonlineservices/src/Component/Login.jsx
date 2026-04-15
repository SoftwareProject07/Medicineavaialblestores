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
// const handleForgetPasswordPopup = async () => {
//   const { value } = await Swal.fire({
//     title: "Forget Password",
//     html: `
//       <div style="text-align: left; padding: 10px;">
//         <label style="font-weight: bold; color: #fff;">Email or Mobile Number</label>
//         <input id="fp-identity" class="swal2-input" placeholder="shivam12@gmail.com" style="width: 90%; margin-bottom: 15px;">
        
//         <label style="font-weight: bold; color: #fff;">New Password</label>
//         <input id="fp-password" type="password" class="swal2-input" placeholder="Enter New Password" style="width: 90%;">
//       </div>
//     `,
//     showCancelButton: true,
//     confirmButtonText: "Reset Password",
//     showLoaderOnConfirm: true,
//     preConfirm: () => {
//       // Comparison ke liye email ko lowercase aur trim karna best practice hai
//       const identity = document.getElementById("fp-identity").value.trim().toLowerCase();
//       const newPassword = document.getElementById("fp-password").value.trim();
      
//       if (!identity || !newPassword) {
//         Swal.showValidationMessage("Dono fields bharna zaroori hai!");
//         return false;
//       }
//       return { identity, newPassword };
//     },
//   });

//   if (!value) return;

//   // Loader start karein taaki user ko lage ki process ho raha hai
//   Swal.fire({
//     title: "Verifying Email...",
//     text: "Database se compare ho raha hai...",
//     allowOutsideClick: false,
//     didOpen: () => Swal.showLoading(),
//   });

//   const isEmail = value.identity.includes("@");

//   // Dynamic Payload: Backend ko wahi field bhej rahe hain jo zaruri hai
//   const payload = {
//     Email: isEmail ? value.identity : "", 
//     PhoneNumber: !isEmail ? value.identity : "", 
//     NewPassword: value.newPassword,
//   };

//   try {
//     // ⚠️ SABSE BADA FIX: axios.get ko axios.post mein badal diya gaya hai
//     const response = await axios.post(
//     //  "http://localhost:5256/api/USERMEDICINE/ForgetPassword", // Local testing ke liye
//        "https://ecommerencesite.onrender.com/api/USERMEDICINE/ForgetPassword", // Live ke liye
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     // Backend success check (Response code 200 ya status true)
//     if (response.data.status === true || response.status === 200) {
//       Swal.fire("Success", "shivam12@gmail.com ka password successfully badal gaya!", "success");
//     } else {
//       Swal.fire("Error", response.data.responseMessage || "User match nahi hua.", "error");
//     }

//   } catch (error) {
//     console.error("API Error Detail:", error.response?.data);
    
//     // Agar server 404 ya 400 error bhejta hai toh message yaha se aayega
//     const errorMsg = error.response?.data?.responseMessage || "User nahi mila ya database comparison fail ho gaya.";
//     Swal.fire("Error", errorMsg, "error");
//   }
// };



// FORGET PASSWORD
// ================================
// const handleForgetPasswordPopup = async () => {
//   const { value } = await Swal.fire({
//     title: "Forget Password",
//     html: `
//       <div style="text-align: left;">
//         <label style="color: gray; font-size: 12px;">Email or Mobile</label>
//         <input id="fp-identity" class="swal2-input" placeholder="example@gmail.com">
//         <label style="color: gray; font-size: 12px;">New Password</label>
//         <input id="fp-password" type="password" class="swal2-input" placeholder="********">
//          <span onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//       </div>
//     `,
//     showCancelButton: true,
//     confirmButtonText: "Reset Password",
//     showLoaderOnConfirm: true,
//     preConfirm: async () => {
//       const identity = document.getElementById("fp-identity").value.trim();
//       const newPassword = document.getElementById("fp-password").value.trim();

//       if (!identity || !newPassword) {
//         Swal.showValidationMessage("Both fields are required");
//         return false;
//       }

//       const isEmail = identity.includes("@");
      
//       // PAYLOAD: Ensure keys match C# DTO exactly
//       const payload = {
//         Email: isEmail ? identity : "",
//         PhoneNumber: !isEmail ? identity : "",
//         NewPassword: newPassword,
//         UserName: "" 
//       };

//       try {
//         const response = await axios.post(
//           "https://ecommerencesite.onrender.com/api/USERMEDICINE/ForgetPassword",
//         //  "http://localhost:5256/api/USERMEDICINE/ForgetPassword",
//           payload,
//           { 
//             headers: { "Content-Type": "application/json" },
//             timeout: 30000 // Render wake-up time
//           }
//         );
//         return response.data;
//       } catch (error) {
//         const msg = error.response?.data?.message || "Server Error";
//         Swal.showValidationMessage(`Request failed: ${msg}`);
//       }
//     }
//   });


//   if (value && value.status === true) {
//     Swal.fire("Success", "Password reset successfully!", "success");
//   }
// };

// =================FORGET PASSWORD with Password Toggle in Swal===========================
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
      // Password toggle logic inside Swal
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
            Don’t have an account? <Link to="/registeration">Register</Link>
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