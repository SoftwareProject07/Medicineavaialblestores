// import React, { useState, useEffect } from 'react';

// export default function MedicationTracker() {
//   const [medications, setMedications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchMedications();
//   }, []);

//   const fetchMedications = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/GetAllMediciation');
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         setMedications(data);
//       } else {
//         setMedications([
//           { id: 1, medicationName: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day', startDate: '2026-09-01', endDate: '2026-09-10', status: 'Active' },
//           { id: 2, medicationName: 'Amoxicillin', dosage: '250mg', frequency: 'Thrice a day', startDate: '2026-09-05', endDate: '2026-09-12', status: 'Active' }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setMedications([
//         { id: 1, medicationName: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day', startDate: '2026-09-01', endDate: '2026-09-10', status: 'Active' },
//         { id: 2, medicationName: 'Amoxicillin', dosage: '250mg', frequency: 'Thrice a day', startDate: '2026-09-05', endDate: '2026-09-12', status: 'Active' }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredMedications = medications.filter(item =>
//     item.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.dosage?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openViewModal = (med) => {
//     setSelectedMed(med);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="customer-tracker">
//       <style>{`
//         .customer-tracker {
//           padding: 28px;
//           background-color: #f8fafc;
//           min-height: 100vh;
//           font-family: system-ui, -apple-system, sans-serif;
//         }
//         .page-title {
//           font-size: 1.75rem;
//           color: #1e293b;
//           font-weight: 700;
//           margin-bottom: 4px;
//         }
//         .page-subtitle {
//           color: #64748b;
//           font-size: 0.95rem;
//           margin-bottom: 24px;
//         }
//         .search-container {
//           margin-bottom: 24px;
//         }
//         .search-box {
//           width: 100%;
//           max-width: 400px;
//           padding: 12px 16px;
//           border: 1px solid #cbd5e1;
//           border-radius: 10px;
//           font-size: 0.95rem;
//           outline: none;
//           background: #ffffff;
//           box-shadow: 0 1px 2px rgba(0,0,0,0.05);
//           transition: all 0.2s;
//         }
//         .search-box:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
//         }
//         .card-table {
//           background: #ffffff;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           overflow: hidden;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           text-align: left;
//         }
//         th, td {
//           padding: 16px;
//           border-bottom: 1px solid #f1f5f9;
//           color: #334155;
//         }
//         th {
//           background-color: #f8fafc;
//           font-weight: 600;
//           font-size: 0.85rem;
//           color: #475569;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//         }
//         .btn-view {
//           background-color: #eff6ff;
//           color: #2563eb;
//           border: 1px solid #bfdbfe;
//           padding: 6px 14px;
//           border-radius: 6px;
//           font-weight: 600;
//           font-size: 0.85rem;
//           cursor: pointer;
//           transition: background 0.2s;
//         }
//         .btn-view:hover {
//           background-color: #dbeafe;
//         }
//         /* SweetAlert2 Style Popup */
//         .swal-overlay {
//           position: fixed;
//           top: 0; left: 0; right: 0; bottom: 0;
//           background-color: rgba(15, 23, 42, 0.6);
//           backdrop-filter: blur(4px);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//           animation: fadeIn 0.2s ease-out;
//         }
//         .swal-popup {
//           background: white;
//           padding: 32px;
//           border-radius: 16px;
//           width: 100%;
//           max-width: 420px;
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
//           text-align: center;
//         }
//         .swal-title {
//           font-size: 1.4rem;
//           font-weight: 700;
//           color: #1e293b;
//           margin-bottom: 16px;
//         }
//         .swal-body {
//           text-align: left;
//           background: #f8fafc;
//           padding: 16px;
//           border-radius: 8px;
//           margin-bottom: 20px;
//           font-size: 0.95rem;
//           color: #475569;
//           line-height: 1.6;
//         }
//         .swal-btn {
//           background-color: #2563eb;
//           color: white;
//           border: none;
//           padding: 10px 24px;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           width: 100%;
//         }
//         .swal-btn:hover { background-color: #1d4ed8; }
//       `}</style>

//       <h1 className="page-title">My Medication Tracker</h1>
//       <p className="page-subtitle">View your active prescriptions and dosage guidelines</p>

//       <div className="search-container">
//         <input
//           type="text"
//           className="search-box"
//           placeholder="🔍 Search medicine or dosage..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="card-table">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Medication Name</th>
//               <th>Dosage</th>
//               <th>Frequency</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading medications...</td></tr>
//             ) : filteredMedications.length > 0 ? (
//               filteredMedications.map((med) => (
//                 <tr key={med.id}>
//                   <td>#{med.id}</td>
//                   <td style={{ fontWeight: 600 }}>{med.medicationName}</td>
//                   <td>{med.dosage}</td>
//                   <td>{med.frequency}</td>
//                   <td>
//                     <span style={{
//                       padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
//                       backgroundColor: '#dcfce7', color: '#166534'
//                     }}>
//                       {med.status || 'Active'}
//                     </span>
//                   </td>
//                   <td>
//                     <button className="btn-view" onClick={() => openViewModal(med)}>View</button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No medications found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isModalOpen && selectedMed && (
//         <div className="swal-overlay" onClick={() => setIsModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💊</div>
//             <div className="swal-title">Medication Details</div>
//             <div className="swal-body">
//               <div><strong>Name:</strong> {selectedMed.medicationName}</div>
//               <div><strong>Dosage:</strong> {selectedMed.dosage}</div>
//               <div><strong>Frequency:</strong> {selectedMed.frequency}</div>
//               <div><strong>Start Date:</strong> {selectedMed.startDate || 'N/A'}</div>
//               <div><strong>End Date:</strong> {selectedMed.endDate || 'N/A'}</div>
//               <div><strong>Status:</strong> {selectedMed.status || 'Active'}</div>
//             </div>
//             <button className="swal-btn" onClick={() => setIsModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }