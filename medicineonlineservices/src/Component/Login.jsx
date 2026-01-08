import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaGoogle, FaLinkedin, FaInstagram } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/logins.css";

export default function Login() {
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
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
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
 // ✅ Save user info
    // if (response.data.user) {
    //   localStorage.setItem("user", JSON.stringify(response.data.user));
    // }
    // Username show the dashboard side
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

    <Link  to="https://x.com/i/flow/login" className="social-icon">     <FaTwitter size={24} color="white" />
  </Link>
          {/* <i className="fab fa-google"></i> */}
           <Link  to="https://www.google.com" className="social-icon">     <FaGoogle size={24} color="white" />
  </Link>
          {/* <i className="fab fa-linkedin-in"></i> */}
      <Link  to="https://www.linkedin.com" className="social-icon"> <FaLinkedin size={24} color="white" /></Link>
      <Link  to="https://www.instagram.com" className="social-icon"> <FaInstagram size={24} color="white" /></Link>

            </div>
          </div>

          <div className="divider">
            <span>Or</span>
          </div>

          <form onSubmit={handleSave}>
            <input
              type="email || mobile"
              placeholder="Email address/MobileNumber"
              value={email || mobile}
              
              onChange={(e) => (setEmail(e.target.value)|| setMobile(e.target.value))}
            />

            {/* PASSWORD WITH SHOW/HIDE */}
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
                <input type="checkbox" /> 
                <span >Remember</span> me
              </label>
              <Link to="/loginforgetpasswords">Forget password?</Link>
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>

          <p className="register">
            Don’t have an account? <Link to="/registeration">Register</Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span>Copyright © 2026. All rights reserved.</span> 
        
        <div className="footer-icons">
     <Link to="https://www.facebook.com" className="social-icon">
    <FaFacebook size={24} color="white" />

</Link>

    <Link  to="https://x.com/i/flow/login" className="social-icon">     <FaTwitter size={24} color="white" />
  </Link>
          {/* <i className="fab fa-google"></i> */}
           <Link  to="https://www.google.com" className="social-icon">     <FaGoogle size={24} color="white" />
  </Link>
          {/* <i className="fab fa-linkedin-in"></i> */}
      <Link  to="https://www.linkedin.com" className="social-icon"> <FaLinkedin size={24} color="white" /></Link>
      <Link  to="https://www.instagram.com" className="social-icon"> <FaInstagram size={24} color="white" /></Link>

        </div>
      </footer>
    </>
  );
}
