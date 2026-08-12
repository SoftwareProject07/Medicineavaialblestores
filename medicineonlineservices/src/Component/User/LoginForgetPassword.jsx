// import React, { useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

// export default function LoginForgetPassword() {
//   const [email, setEmail] = useState("");
//     const[mobile, setMobile]=useState("");
//     const [first,setFirst]=useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !newPassword) {
//       Swal.fire("Error", "Email/MobileNumber/UserName and New Password are required", "error");
//       return;
//     }

//     // 🔥 IMPORTANT: Backend PascalCase expects
//     const payload = {
//      // Email: email,
//      //trim().toLowerCase()
//        Email: email,
//         UserName:first,
//         PhoneNumber:mobile,
//       NewPassword: newPassword,
//     };

//     try {
//       const response = await axios.post(
//       //  "http://localhost:5256/api/USERMEDICINE/ForgetPassword",
//        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/ForgetPassword",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data?.status === true) {
//         Swal.fire(
//           "Success",
//           "Password reset successful",
//           "success"
//         ).then(() => navigate("/login"));
//       } else {
//         Swal.fire(
//           "Failed",
//           response.data?.responseMessage || "Invalid Email/MobileNumber/UserName",
//           "error"
//         );
//       }
//     } catch (err) {
//       console.error("API Error 👉", err.response?.data);
//       Swal.fire(
//         "Error",
//         err.response?.data?.title || "Validation failed",
//         "error"
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Forget Password</h2>
//       <input
//         type="email ||mobile||first"
//         placeholder="Enter Email/PhoneNumber/UserrName"
//         value={email || PhoneNumber || UserrName}
//         onChange={(e) => setEmail(e.target.value)|| setMobile(e.target.value)|| setFirst(e.tartget.value)}
//       />
//       <input
//         type="password"
//         placeholder="New Password"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//       />

//       <button type="submit">Reset Password</button>

//     </form>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function LoginForgetPassword() {
  const [inputValue, setInputValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || !newPassword) {
      Swal.fire("Error", "Email/Mobile/UserName and New Password are required", "error");
      return;
    }

    const payload = {
      Email: inputValue,
      UserName: inputValue,
      PhoneNumber: inputValue,
      NewPassword: newPassword,
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/ForgetPassword",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === true) {
        Swal.fire(
          "Success",
          "Password reset successful",
          "success"
        ).then(() => navigate("/login"));
      } else {
        Swal.fire(
          "Failed",
          response.data?.responseMessage || "Invalid details",
          "error"
        );
      }
    } catch (err) {
      console.error("API Error 👉", err.response?.data);
      Swal.fire(
        "Error",
        err.response?.data?.title || "Validation failed",
        "error"
      );
    }
  };

  return (
    <div style={{
      backgroundColor: "#121212",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "450px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ marginBottom: "25px", textAlign: "center", fontWeight: "600" }}>Forget Password</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#bbb" }}>
              Email or Mobile
            </label>
            <input
              type="text"
              placeholder="Enter Email or Mobile"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "6px",
                border: "1px solid #444",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "15px",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#bbb" }}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 15px",
                  borderRadius: "6px",
                  border: "1px solid #444",
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  fontSize: "15px",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#6f42c1",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 20px",
                backgroundColor: "#495057",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}