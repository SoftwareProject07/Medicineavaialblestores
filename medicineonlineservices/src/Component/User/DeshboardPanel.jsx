import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DeshboardPanel() {//medicine admin panel deshboard
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDashboard, setOpenDashboard] = useState(false);

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const firstPageSize = 5;
  const pageSize = 10;

  // 🔹 Edit Form
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    unitPrice: "",
    discount: "",
    quantity: "",
    expiryDate: "",
    image: null,
    imageurl: ""
  });

  // 🔹 Normalize API response
  const normalize = (list) =>
    list.map((m) => ({
      id: m.id ?? m.Id,
      name: m.name ?? m.Name,
      manufacturer: m.manufacturer ?? m.Manufacturer,
      unitPrice: m.unitPrice ?? m.UnitPrice,
      discount: m.discount ?? m.Discount,
      quantity: m.quantity ?? m.Quantity,
      expiryDate: m.expiryDate ?? m.ExpiryDate,
      imageurl: m.image ?? m.Image ?? m.imageurl ?? m.ImageUrl
    }));

  // 🔹 GET Medicines
  useEffect(() => {
    axios
      .get(
        "https://ecommerencesite-api.onrender.com/api/MEDICINE/AllListMedicineProduct"
     //   "http://localhost:5256/api/MEDICINE/AllListMedicineProduct"
      )
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        setMedicines(Array.isArray(list) ? normalize(list) : []);
      })
      .catch(() => setMedicines([]));
  }, []);

  // 🔹 Search Filter
  const filteredMedicines = medicines.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Pagination Logic
  const getPageSize = (page) => (page === 1 ? firstPageSize : pageSize);
  const startIndex =
    currentPage === 1 ? 0 : firstPageSize + (currentPage - 2) * pageSize;
  const endIndex = startIndex + getPageSize(currentPage);
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex);
  const remainingItems = Math.max(filteredMedicines.length - firstPageSize, 0);
  const totalPages =
    filteredMedicines.length <= firstPageSize
      ? 1
      : 1 + Math.ceil(remainingItems / pageSize);

  // 🔹 Edit Click
  const handleEditClick = (med) => {
    setEditingMedicine(med.id);
    setFormData({
      name: med.name,
      manufacturer: med.manufacturer,
      unitPrice: med.unitPrice,
      discount: med.discount,
      quantity: med.quantity,
      expiryDate: med.expiryDate?.split("T")[0] || "",
      image: null,
      imageurl: med.imageurl
    });
  };

  // 🔹 Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Update Medicine
  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      data.append("Id", id);
      data.append("Name", formData.name);
      data.append("Manufacturer", formData.manufacturer);
      data.append("UnitPrice", formData.unitPrice);
      data.append("Discount", formData.discount);
      data.append("Quantity", formData.quantity);
      data.append("ExpiryDate", formData.expiryDate);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.put(
        "https://ecommerencesite-api.onrender.com/api/MEDICINE/UpdateMedicine",
      //"http://localhost:5256/api/MEDICINE/UpdateMedicine",
        data
      );


      if (res.data?.status) {
        setMedicines((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...formData,
                  imageurl:
                    res.data.imageUrl ||
                    res.data.ImageUrl ||
                    m.imageurl
                }
              : m
          )
        );
        setEditingMedicine(null);
        alert("Updated successfully");
      } else {
        alert(res.data?.responseMessage || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // 🔹 Delete Medicine
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await axios.delete(
        `https://ecommerencesite-api.onrender.com/api/MEDICINE/DeleteMedicine/${id}`
       // `http://localhost:5256/api/MEDICINE/DeleteMedicine/${id}`
      );
      if (res.data?.status) {
        setMedicines((prev) => prev.filter((m) => m.id !== id));
        alert("Deleted successfully");
      } else {
        alert(res.data?.responseMessage || "Delete failed");
      }
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="dashboard-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45px" />
          <span>AKMedizostore</span>
        </div>

        <ul>
         {/* <li className="menu-group">  
            <span
              className="menu-title btn btn-success mb-2"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard {openDashboard ? "▾" : "▸"}
            </span> 


<Link
  to="/dashboards"
  className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
  onClick={() => setOpenDashboard(!openDashboard)}
>
  Dashboard
  <span>{openDashboard ? "▾" : "▸"}</span>
</Link>

            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                <li><Link to="/test-reports">Test Reports</Link></li>
                <li><Link to="/health-history">Health History</Link></li>
                <li><Link to="/monthly-progress">Monthly Progress</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/support">Help & Support</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            )}
          </li> */}

           <Link to="/deshboardpanel" className="btn btn-success mb-2">Admin Dashboard</Link>
                                         <li>Cart</li>
                                        {/* <Link to="/customerdetails" className="btn btn-success mb-2">Patience Details</Link>  */}
                                         

          <li>OrdersPayment</li>

     <li><Link  to="/customerlists" className="btn btn-success mb-2">   CustomerLIST </Link></li>

          <li>OrderList</li>

          {/* <li>Customer Profile</li> */}
           {/* className="btn btn-success mb-2" */}
          <li><Link to="/adminlogin"><i class="fas fa-sign-out-alt"></i> LogOut</Link></li>
        </ul>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="content">
        <div className="topbar d-flex justify-content-between">
          <h2>Medicines</h2>
          <Link to="/deshboardpanel/medicines" className="btn btn-success">
            Add Medicine
          </Link>
        </div>

        <input
          className="form-control my-3"
          placeholder="Search by name or manufacturer"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Qty</th>
              <th>Expiry</th>
              <th>Photo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No medicines found
                </td>
              </tr>
            ) : (
              paginatedMedicines.map((med) => (
                <tr key={med.id}>
                  <td>{editingMedicine === med.id ? <input name="name" value={formData.name} onChange={handleChange} /> : med.name}</td>
                  <td>{editingMedicine === med.id ? <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} /> : med.manufacturer}</td>
                  <td>{editingMedicine === med.id ? <input name="unitPrice" value={formData.unitPrice} onChange={handleChange} /> : med.unitPrice}</td>
                  <td>{editingMedicine === med.id ? <input name="discount" value={formData.discount} onChange={handleChange} /> : med.discount}</td>
                  <td>{editingMedicine === med.id ? <input name="quantity" value={formData.quantity} onChange={handleChange} /> : med.quantity}</td>
                  <td>
                    {editingMedicine === med.id ? (
                      <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                    ) : med.expiryDate ? (
                      new Date(med.expiryDate).toLocaleDateString()
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {editingMedicine === med.id ? (
                      <>
                        <input type="file" name="image" onChange={handleChange} />
                        {formData.imageurl && (
                          <img src={formData.imageurl} alt="preview" width="60" height="60" />
                        )}
                      </>
                    ) : med.imageurl ? (
                      <img src={med.imageurl} alt="medicine" width="60" height="60" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {editingMedicine === med.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate(med.id)}>Update</button>{" "}
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingMedicine(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(med)}>Edit</button>{" "}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(med.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ fontWeight: currentPage === i + 1 ? "bold" : "normal" }}>
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
