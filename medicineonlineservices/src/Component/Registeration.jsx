import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import "./styles/registerations.css";
//import API from "../Services/API";

export default function Registeration() {
  const navigate = useNavigate();

  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
 const [confirmpassword, setconfirmpassword] = useState("");

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
//const [photo ,setphoto]=useState("");
  // ✅ decimal safe
  const [found, setFound] = useState(0);
  const [type,setType] = useState("");
  const [createon,setCreateOn] = useState(null);
const [photo, setPhoto] = useState(null);

const handleSave = async () => {
  const formData = new FormData();
  formData.append("FirstName", firstname);
  formData.append("LastName", lastname);
  formData.append("Password", password);
  formData.append("ConfirmPassword", confirmpassword);
  formData.append("Email", email);
  formData.append("MobileNumber", mobile);
  formData.append("Type", "User");
  formData.append("CreateOn", new Date().toISOString());

  if (photo) {
    formData.append("Photo", photo); // ✅ FILE
  }


  try {
    const response = await axios.post(
      "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/CREATERegisterUser",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  if (
        response.data?.isSuccess ||
        response.data?.success ||
        response.data?.status
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
    // console.log("API Response:", response.data);

    // alert("Registration Successful");

    // navigate("/login");
   Swal.fire({
           icon: "success",
           title: "Registration Successful",
           text: "Welcome to Registration Customer",
         }).then(() => navigate("/login"));
       }
        else {
         Swal.fire(
           "Registration Customer Failed",
           response.data?.responseMessage ||
             response.data?.message ||
             "Invalid Registration Customer",
           "error"
         );
       }
      }
//catch (error) {
//     console.error("API Error:", error.response?.data || error.message);
//     alert("Registration Failed");
//   }
// };
catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };



  return (
    <Fragment>
      <div className="bg">
        {/* ❌ YAHAN // COMMENT NAHI LAGANA */}
        <section className="vh-100">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="card p-4" style={{ borderRadius: "15px" }}>
                  <h3 className="text-center mb-4">Create an account</h3>

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Middle Name"
                    value={middlename}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />

                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)  }
                  />
  <input
                    type="confirmpassword"
                    className="form-control mb-2"
                    placeholder="confirmpassword"
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                  />

                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                    <input
                    type="mobile"
                    className="form-control mb-3"
                    placeholder="MobileNumber"
                    value={mobile}
                                        maxLength={10}

                    onChange={(e) => setMobile(e.target.value)}
                  />
                    {/* <input
                    type="file"
                    className="form-control mb-3"
                    placeholder="photo"
                    value={photo}

                    onChange={(e) => setphoto(e.target.value)}
                  /> */}

                  <input
  type="file"
  className="form-control"
  onChange={(e) => setPhoto(e.target.files[0])}
/>

                  <input type="hidden"  value={found} onChange={(e)=>setFound(e.target.value)}  />
                                    <input type="hidden"  value={type} onChange={(e)=>setType(e.target.value)}  />
                                    <input type="hidden"  value={createon} onChange={(e)=>setCreateOn(e.target.value)}  />



                  <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handleSave}
                  >
                    Register
                  </button>

                  <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login">
                      <u>Login here</u>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}