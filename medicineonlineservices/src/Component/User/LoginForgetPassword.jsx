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
//         "http://localhost:5256/api/USERMEDICINE/ForgetPassword",
//       //  "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/ForgetPassword",
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
