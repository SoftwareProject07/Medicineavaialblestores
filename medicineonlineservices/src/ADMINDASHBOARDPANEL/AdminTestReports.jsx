


// import React, { useState, useEffect } from "react";

// export default function AdminTestReports() {
//   const [testReports, setTestReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modals State
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
//   // Selected / Active Item State
//   const [selectedReport, setSelectedReport] = useState(null);

//   // Form Data State for Create & Update (including id and laboratory)
//   const [formData, setFormData] = useState({
//     id: "",
//     testName: "",
//     date: "",
//     status: "",
//     resultSummary: "",
//     laboratory: ""
//   });

//   // Correct Localhost Base URL & Controller Route
//   const API_BASE_URL = 'http://localhost:5256/api/TestingDashBoardPanelAPI';

//   // 1. FETCH ALL TEST REPORTS (Endpoint: /AllTestReports)
//   const fetchTestReports = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/AllTestReports`);
//       if (!response.ok) throw new Error("Failed to fetch reports");
//       const data = await response.json();
//       setTestReports(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching test reports:', error);
//       setTestReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTestReports();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // 2. CREATE TEST REPORT (Endpoint: /CreateTestReport)
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/CreateTestReport`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           testName: formData.testName,
//           date: formData.date,
//           status: formData.status,
//           resultSummary: formData.resultSummary,
//           laboratory: formData.laboratory
//         })
//       });
//       if (response.ok) {
//         setIsCreateModalOpen(false);
//         setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
//         fetchTestReports();
//       }
//     } catch (error) {
//       console.error('Error creating test report:', error);
//     }
//   };

//   // 3. GET SINGLE TEST REPORT DETAILS (Endpoint: /DetailsTestReport?id=...)
//   const handleViewDetails = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/DetailsTestReport?id=${id}`);
//       const data = await response.json();
//       setSelectedReport(data);
//       setIsDetailModalOpen(true);
//     } catch (error) {
//       console.error('Error fetching test report details:', error);
//     }
//   };

//   // Open Update Modal and prefill data including ID and laboratory
//   const handleOpenUpdate = (report) => {
//     setSelectedReport(report);
//     setFormData({
//       id: report.id,
//       testName: report.testName || "",
//       date: report.date ? report.date.split('T')[0] : "",
//       status: report.status || "",
//       resultSummary: report.resultSummary || "",
//       laboratory: report.laboratory || ""
//     });
//     setIsUpdateModalOpen(true);
//   };

//   // 4. UPDATE TEST REPORT (Endpoint: /UpdateTestReport)
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE_URL}/UpdateTestReport`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       if (response.ok) {
//         setIsUpdateModalOpen(false);
//         setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
//         fetchTestReports();
//       }
//     } catch (error) {
//       console.error('Error updating test report:', error);
//     }
//   };

//   // 5. DELETE TEST REPORT (Endpoint: /DeleteTestReport?id=...)
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this test report?")) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/DeleteTestReport?id=${id}`, {
//           method: 'DELETE'
//         });
//         if (response.ok) {
//           fetchTestReports();
//         }
//       } catch (error) {
//         console.error('Error deleting test report:', error);
//       }
//     }
//   };

//   const filteredReports = testReports.filter(item =>
//     (item.testName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
//       <style>{`
//         .admin-container {
//           margin-left: 280px;
//           width: calc(100% - 280px);
//           padding: 30px;
//           box-sizing: border-box;
//         }
//         .table-card {
//           background: #ffffff;
//           border-radius: 12px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
//           padding: 24px;
//         }
//         .custom-table {
//           width: 100%;
//           border-collapse: collapse;
//           text-align: left;
//           margin-top: 15px;
//         }
//         .custom-table th {
//           background-color: #f1f5f9;
//           color: #334155;
//           font-weight: 700;
//           padding: 12px 16px;
//           border-bottom: 2px solid #e2e8f0;
//           font-size: 0.9rem;
//         }
//         .custom-table td {
//           padding: 14px 16px;
//           color: #1e293b !important;
//           background-color: transparent !important;
//           border-bottom: 1px solid #f1f5f9;
//           font-size: 0.9rem;
//           font-weight: 500;
//         }
//         .custom-table tbody tr:hover {
//           background-color: #f8fafc;
//         }
//         .add-btn {
//           background-color: #0fa462;
//           color: white;
//           border: none;
//           padding: 10px 18px;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .add-btn:hover { background-color: #0b824f; }
        
//         .modal-overlay {
//           position: fixed;
//           top: 0; left: 0; right: 0; bottom: 0;
//           background-color: rgba(15, 23, 42, 0.6);
//           backdrop-filter: blur(4px);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 9999;
//           padding: 20px;
//         }
//         .modal-box {
//           background: white;
//           padding: 32px;
//           border-radius: 16px;
//           width: 100%;
//           max-width: 550px;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           max-height: 90vh;
//           overflow-y: auto;
//         }
//         .form-control-custom {
//           width: 100%;
//           padding: 10px 14px;
//           border: 1px solid #cbd5e1;
//           border-radius: 8px;
//           margin-bottom: 16px;
//           outline: none;
//           box-sizing: border-box;
//           font-size: 0.95rem;
//           color: #1e293b;
//         }
//         .action-btn-view { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; margin-right: 5px; }
//         .action-btn-edit { background: #fef9c3; color: #ca8a04; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; margin-right: 5px; }
//         .action-btn-del { background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; }
//       `}</style>

//       {/* Main Content Area */}
//       <div className="admin-container">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
//           <h2 style={{ color: "#1e293b", fontWeight: "700", fontSize: "1.5rem" }}>Admin Panel - Test Reports Management</h2>
//           <button className="add-btn" onClick={() => {
//             setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
//             setIsCreateModalOpen(true);
//           }}>
//             + Add New Test Report
//           </button>
//         </div>

//         <div className="table-card">
//           <input
//             type="text"
//             className="form-control-custom"
//             placeholder="🔍 Search test reports..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ maxWidth: '350px' }}
//           />

//           <div style={{ overflowX: 'auto' }}>
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Test Name</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading reports...</td>
//                   </tr>
//                 ) : filteredReports.length > 0 ? (
//                   filteredReports.map((report, index) => (
//                     <tr key={report.id || index}>
//                       <td>#{report.id || index + 1}</td>
//                       <td style={{ fontWeight: 600 }}>{report.testName || 'N/A'}</td>
//                       <td>{report.date ? report.date.split('T')[0] : 'N/A'}</td>
//                       <td>
//                         <span style={{
//                           padding: '4px 10px',
//                           borderRadius: '6px',
//                           fontSize: '0.8rem',
//                           fontWeight: 600,
//                           background: report.status?.toLowerCase() === 'normal' ? '#e8f7f0' : '#fff5f5',
//                           color: report.status?.toLowerCase() === 'normal' ? '#0fa462' : '#e53e3e'
//                         }}>
//                           {report.status || 'Pending'}
//                         </span>
//                       </td>
//                       <td>
//                         <button className="action-btn-view" onClick={() => handleViewDetails(report.id)}>View</button>
//                         <button className="action-btn-edit" onClick={() => handleOpenUpdate(report)}>Edit</button>
//                         <button className="action-btn-del" onClick={() => handleDelete(report.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No reports found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* 1. Create Test Report Modal */}
//       {isCreateModalOpen && (
//         <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             <h3 style={{ marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Create Test Report</h3>
//             <form onSubmit={handleCreateSubmit}>
//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Test Name</label>
//               <input type="text" name="testName" className="form-control-custom" placeholder="Enter test name" value={formData.testName} onChange={handleInputChange} required />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Date</label>
//               <input type="date" name="date" className="form-control-custom" value={formData.date} onChange={handleInputChange} required />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status</label>
//               <input type="text" name="status" className="form-control-custom" placeholder="Status (e.g. Normal)" value={formData.status} onChange={handleInputChange} />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Laboratory</label>
//               <input type="text" name="laboratory" className="form-control-custom" placeholder="Laboratory name" value={formData.laboratory} onChange={handleInputChange} />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Result Summary</label>
//               <textarea name="resultSummary" className="form-control-custom" placeholder="Result Summary" rows="3" value={formData.resultSummary} onChange={handleInputChange}></textarea>

//               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                 <button type="submit" style={{ flex: 1, background: '#0fa462', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
//                 <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 2. Update Test Report Modal */}
//       {isUpdateModalOpen && (
//         <div className="modal-overlay" onClick={() => setIsUpdateModalOpen(false)}>
//           <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//             <h3 style={{ marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Update Test Report</h3>
//             <form onSubmit={handleUpdateSubmit}>
//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Test Name</label>
//               <input type="text" name="testName" className="form-control-custom" value={formData.testName} onChange={handleInputChange} required />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Date</label>
//               <input type="date" name="date" className="form-control-custom" value={formData.date} onChange={handleInputChange} required />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status</label>
//               <input type="text" name="status" className="form-control-custom" value={formData.status} onChange={handleInputChange} />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Laboratory</label>
//               <input type="text" name="laboratory" className="form-control-custom" value={formData.laboratory} onChange={handleInputChange} />

//               <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Result Summary</label>
//               <textarea name="resultSummary" className="form-control-custom" rows="3" value={formData.resultSummary} onChange={handleInputChange}></textarea>

//               <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                 <button type="submit" style={{ flex: 1, background: '#ca8a04', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
//                 <button type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 3. View Details Modal */}
//       {isDetailModalOpen && selectedReport && (
//         <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
//           <div className="modal-box" style={{ maxWidth: '450px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
//             <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
//             <h3 style={{ marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Test Report Details</h3>
//             <div style={{ textAlign: 'left', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
//               <div><strong>ID:</strong> #{selectedReport.id}</div>
//               <div><strong>Test Name:</strong> {selectedReport.testName || 'N/A'}</div>
//               <div><strong>Date:</strong> {selectedReport.date ? selectedReport.date.split('T')[0] : 'N/A'}</div>
//               <div><strong>Status:</strong> {selectedReport.status || 'N/A'}</div>
//               <div><strong>Laboratory:</strong> {selectedReport.laboratory || 'N/A'}</div>
//               <div><strong>Summary:</strong> {selectedReport.resultSummary || 'N/A'}</div>
//             </div>
//             <button onClick={() => setIsDetailModalOpen(false)} style={{ background: '#0fa462', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminTestReports() {
  const navigate = useNavigate();
  const [testReports, setTestReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sidebar States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  // Pagination State (10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Selected / Active Item State
  const [selectedReport, setSelectedReport] = useState(null);

  // Form Data State for Create & Update (including id and laboratory)
  const [formData, setFormData] = useState({
    id: "",
    testName: "",
    date: "",
    status: "",
    resultSummary: "",
    laboratory: ""
  });

  // Correct Localhost Base URL & Controller Route
  const API_BASE_URL = 'https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI'
  //'http://localhost:5256/api/TestingDashBoardPanelAPI';

  // 1. FETCH ALL TEST REPORTS (Endpoint: /AllTestReports)
  const fetchTestReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/AllTestReports`);
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setTestReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching test reports:', error);
      setTestReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. CREATE TEST REPORT (Endpoint: /CreateTestReport)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/CreateTestReport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: formData.testName,
          date: formData.date,
          status: formData.status,
          resultSummary: formData.resultSummary,
          laboratory: formData.laboratory
        })
      });
      if (response.ok) {
        setIsCreateModalOpen(false);
        setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
        fetchTestReports();
      }
    } catch (error) {
      console.error('Error creating test report:', error);
    }
  };

  // 3. GET SINGLE TEST REPORT DETAILS (Endpoint: /DetailsTestReport?id=...)
  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DetailsTestReport?id=${id}`);
      const data = await response.json();
      setSelectedReport(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching test report details:', error);
    }
  };

  // Open Update Modal and prefill data including ID and laboratory
  const handleOpenUpdate = (report) => {
    setSelectedReport(report);
    setFormData({
      id: report.id,
      testName: report.testName || "",
      date: report.date ? report.date.split('T')[0] : "",
      status: report.status || "",
      resultSummary: report.resultSummary || "",
      laboratory: report.laboratory || ""
    });
    setIsUpdateModalOpen(true);
  };

  // 4. UPDATE TEST REPORT (Endpoint: /UpdateTestReport)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/UpdateTestReport`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsUpdateModalOpen(false);
        setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
        fetchTestReports();
      }
    } catch (error) {
      console.error('Error updating test report:', error);
    }
  };

  // 5. DELETE TEST REPORT (Endpoint: /DeleteTestReport?id=...)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test report?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/DeleteTestReport?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchTestReports();
        }
      } catch (error) {
        console.error('Error deleting test report:', error);
      }
    }
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => {
    return window.location.pathname === path 
      ? "btn btn-success w-100 mb-2 text-start d-flex align-items-center gap-3 px-3 py-2" 
      : "btn btn-outline-secondary w-100 mb-2 text-start d-flex align-items-center gap-3 px-3 py-2 text-white";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path
      ? "text-success fw-bold py-1 text-decoration-none"
      : "text-white-50 py-1 text-decoration-none";
  };

  // Filtered & Paginated Data Logic
  const filteredReports = testReports.filter(item =>
    (item.testName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      <style>{`
        .admin-container {
          margin-left: 280px;
          width: calc(100% - 280px);
          padding: 30px;
          box-sizing: border-box;
        }
        .table-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          padding: 24px;
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          margin-top: 15px;
        }
        .custom-table th {
          background-color: #f1f5f9;
          color: #334155;
          font-weight: 700;
          padding: 12px 16px;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.9rem;
        }
        .custom-table td {
          padding: 14px 16px;
          color: #1e293b !important;
          background-color: transparent !important;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .custom-table tbody tr:hover {
          background-color: #f8fafc;
        }
        .add-btn {
          background-color: #0fa462;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .add-btn:hover { background-color: #0b824f; }
        
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-box {
          background: white;
          padding: 32px;
          border-radius: 16px;
          width: 100%;
          max-width: 550px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
        }
        .form-control-custom {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          margin-bottom: 16px;
          outline: none;
          box-sizing: border-box;
          font-size: 0.95rem;
          color: #1e293b;
        }
        .action-btn-view { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; margin-right: 5px; }
        .action-btn-edit { background: #fef9c3; color: #ca8a04; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; margin-right: 5px; }
        .action-btn-del { background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.8rem; }
      `}</style>

      {/* Side Menu Component */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329'
      }}>
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2.5 rounded d-flex align-items-center justify-content-between transition-all" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-sliders-h"></i> Master Config
              </span>
              <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {masterDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link> 
                <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>Accountant Master Types</Link> 
              </div>
            )}
          </div>

          <div>
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
                <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form </Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> 
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> 
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link> 
                <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link>
                <Link to="/qrcodeupload" className="btn btn-outline-success w-100 mb-2 text-start">qrcodeupload</Link>
                <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded hover-sidebar-logout"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: "#1e293b", fontWeight: "700", fontSize: "1.5rem" }}>Admin Panel - Test Reports Management</h2>
          <button className="add-btn" onClick={() => {
            setFormData({ id: "", testName: "", date: "", status: "", resultSummary: "", laboratory: "" });
            setIsCreateModalOpen(true);
          }}>
            + Add New Test Report
          </button>
        </div>

        <div className="table-card">
          <input
            type="text"
            className="form-control-custom"
            placeholder="🔍 Search test reports..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            style={{ maxWidth: '350px' }}
          />

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Test Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading reports...</td>
                  </tr>
                ) : currentReports.length > 0 ? (
                  currentReports.map((report, index) => (
                    <tr key={report.id || index}>
                      <td>#{report.id || indexOfFirstItem + index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{report.testName || 'N/A'}</td>
                      <td>{report.date ? report.date.split('T')[0] : 'N/A'}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: report.status?.toLowerCase() === 'normal' ? '#e8f7f0' : '#fff5f5',
                          color: report.status?.toLowerCase() === 'normal' ? '#0fa462' : '#e53e3e'
                        }}>
                          {report.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn-view" onClick={() => handleViewDetails(report.id)}>View</button>
                        <button className="action-btn-edit" onClick={() => handleOpenUpdate(report)}>Edit</button>
                        <button className="action-btn-del" onClick={() => handleDelete(report.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No reports found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (10 items per page) */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} entries
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage === 1 ? '#f1f5f9' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: currentPage === i + 1 ? '#0fa462' : 'white',
                      color: currentPage === i + 1 ? 'white' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: currentPage === totalPages ? '#f1f5f9' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. Create Test Report Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Create Test Report</h3>
            <form onSubmit={handleCreateSubmit}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Test Name</label>
              <input type="text" name="testName" className="form-control-custom" placeholder="Enter test name" value={formData.testName} onChange={handleInputChange} required />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Date</label>
              <input type="date" name="date" className="form-control-custom" value={formData.date} onChange={handleInputChange} required />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status</label>
              <input type="text" name="status" className="form-control-custom" placeholder="Status (e.g. Normal)" value={formData.status} onChange={handleInputChange} />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Laboratory</label>
              <input type="text" name="laboratory" className="form-control-custom" placeholder="Laboratory name" value={formData.laboratory} onChange={handleInputChange} />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Result Summary</label>
              <textarea name="resultSummary" className="form-control-custom" placeholder="Result Summary" rows="3" value={formData.resultSummary} onChange={handleInputChange}></textarea>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#0fa462', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Update Test Report Modal */}
      {isUpdateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', fontWeight: 700 }}>Update Test Report</h3>
            <form onSubmit={handleUpdateSubmit}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Test Name</label>
              <input type="text" name="testName" className="form-control-custom" value={formData.testName} onChange={handleInputChange} required />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Date</label>
              <input type="date" name="date" className="form-control-custom" value={formData.date} onChange={handleInputChange} required />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Status</label>
              <input type="text" name="status" className="form-control-custom" value={formData.status} onChange={handleInputChange} />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Laboratory</label>
              <input type="text" name="laboratory" className="form-control-custom" value={formData.laboratory} onChange={handleInputChange} />

              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Result Summary</label>
              <textarea name="resultSummary" className="form-control-custom" rows="3" value={formData.resultSummary} onChange={handleInputChange}></textarea>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#ca8a04', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Update</button>
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ flex: 1, background: '#e2e8f0', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. View Details Modal */}
      {isDetailModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-box" style={{ maxWidth: '450px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontWeight: 700 }}>Test Report Details</h3>
            <div style={{ textAlign: 'left', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
              <div><strong>ID:</strong> #{selectedReport.id}</div>
              <div><strong>Test Name:</strong> {selectedReport.testName || 'N/A'}</div>
              <div><strong>Date:</strong> {selectedReport.date ? selectedReport.date.split('T')[0] : 'N/A'}</div>
              <div><strong>Status:</strong> {selectedReport.status || 'N/A'}</div>
              <div><strong>Laboratory:</strong> {selectedReport.laboratory || 'N/A'}</div>
              <div><strong>Summary:</strong> {selectedReport.resultSummary || 'N/A'}</div>
            </div>
            <button onClick={() => setIsDetailModalOpen(false)} style={{ background: '#0fa462', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}