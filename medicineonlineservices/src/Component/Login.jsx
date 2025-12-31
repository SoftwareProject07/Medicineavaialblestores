import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/logins.css";
//localStorage.setItem("token", response.token);


export default function Login() {
 // const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    // 🔹 Blank check
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter Email and Password");
      return;
    }

    // 🔹 Email format check
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailPattern.test(email)) {
    //   alert("Please enter a valid Email ID");
    //   return;
    // }

    // // 🔹 Password length check
    // if (password.length < 6) {
    //   alert("Password must be at least 6 characters");
    //   return;
    // }

    // ✅ API Data
    const data = {
      Email: email,
      Password: password,
    };

    console.log("Sending 👉", data);

    axios
      .post(
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/LOGINUserMedicine",
        data,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        console.log("Response 👉", response.data);

       if (
  response.data.isSuccess === true ||
  response.data.success === true ||
  response.data.status === true
) {
  alert("Login Successful ✅");
 // navigate("/deshboardpanel");
  navigate("/dashboards");
}
 else {
          alert(
            response.data.responseMessage ||
              response.data.message ||
              "Invalid Email or Password"
          );
        }
      })
      .catch((error) => {
        console.error("API Error 👉", error);
        alert("Server error, please try again later");
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <div className="input-group">
          <label>Email/Mobile</label>
          <input
            type="email"
            placeholder="Enter Email/Mobile"
            value={email}  
            onChange={(e) => setEmail(e.target.value) }  required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  
          />
        </div>

        <button className="login-btn" onClick={handleSave}>
          Login
        </button>

        <p className="register-text">
          Don't have an account?
          <Link to="/registeration"> Register </Link>
        </p>
      </div>
    </div>
  );
}
