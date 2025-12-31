import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Component/Login.jsx";
import Registeration from "./Component/Registeration.jsx";
import Header from "./Component/User/Header.jsx";
import DeshboardPanel from "./Component/User/DeshboardPanel.jsx";
import Contact from "./Component/Contact.jsx";
import Medicine from "./Component/Admin/Medicine.jsx";
import Dashboard from "./Component/DeshboardsMedicine/Dashboard.jsx";
import AdminDashboard from "./Component/Admin/AdminDeshboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/header" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registeration" element={<Registeration />} />
      <Route path="/header" element={<Header />} />
      <Route path="/deshboardpanel" element={<DeshboardPanel />} />
        <Route path="/deshboardpanel/medicines" element={<Medicine />} />
        <Route path="/dashboards" element={<Dashboard />} />

      <Route path="/contact" element={<Contact />} />
              <Route Path="/admindashboard" element={<AdminDashboard  />} />

    </Routes>
  );
}

export default App;
