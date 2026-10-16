import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

//const BASE_URL = 'http://localhost:5256/api/HappyClientAPI';
  const BASE_URL=  "https://ecommerencesite.onrender.com/api/HappyClientAPI";

export default function HAPPYCLIENT() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sidebar Dropdown States
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  // Modals & States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const initialFormState = {
    id: 0,
    clientName: '',
    designation: '',
    company: '',
    testimonialText: '',
    rating: 5,
    imageUrl: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Sidebar links helper classes
  const getNavLinkClass = (path) => {
    return window.location.pathname === path
      ? "d-flex align-items-center gap-3 px-3 py-2 text-white bg-dark rounded text-decoration-none"
      : "d-flex align-items-center gap-3 px-3 py-2 text-white-50 rounded text-decoration-none hover-sidebar-menu";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path
      ? "text-white text-decoration-none py-1.5 fw-bold"
      : "text-white-50 text-decoration-none py-1.5";
  };

  // 1. Fetch All Clients
  const fetchAllClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/AllHappyClient`);
      setClients(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Server se data load karne mein samasya aayi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 2. Create or Update Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/UpdateHappyClient`, formData);
        alert('Client updated successfully!');
      } else {
        await axios.post(`${BASE_URL}/CreateHappyClient`, formData);
        alert('Client created successfully!');
      }
      setShowFormModal(false);
      resetForm();
      fetchAllClients();
    } catch (err) {
      console.error('Error saving client:', err);
      alert('Data save karte samay error aaya.');
    }
  };

  // 3. Details View Handler
  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/DetailsHappyClient?id=${id}`);
      setSelectedClient(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching details:', err);
      alert('Details fetch karne mein asafal rahe.');
    }
  };

  const handleEditClick = (client) => {
    setFormData(client);
    setIsEditing(true);
    setShowFormModal(true);
  };

  // 4. Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Kya aap is client testimonial ko delete karna chahte hain?')) {
      try {
        await axios.delete(`${BASE_URL}/DeleteHappyClient?id=${id}`);
        alert('Client deleted successfully!');
        fetchAllClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Delete karne mein error aaya.');
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <div className="d-none d-lg-block bg-dark text-white p-3" style={{ width: '280px', minHeight: '100vh', flexShrink: 0 }}>
        <div className="mb-4 px-2">
          <h4 className="text-white fw-bold m-0" style={{ fontSize: '16px' }}>AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span></h4>
        </div>

        <div className="mb-3 px-2 py-1.5 bg-secondary rounded d-flex justify-content-between align-items-center">
          <span className="text-white-50" style={{ fontSize: '11px' }}>STORE STATUS</span>
          <span className="badge bg-success" style={{ fontSize: '10px' }}>Open for Orders</span>
        </div>

        <div className="text-white-50 text-uppercase px-2 mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>CORE NAVIGATION</div>

        <div className="d-flex flex-column gap-1">
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-sliders-h"></i> Master Config
              </span>
              <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
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
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start py-1">Mediciationtrackers</Link> 
                <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminTestReports</Link>
                <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminMonthlyProgress</Link>
                <Link to="/adminprescriptions" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminPrescriptions</Link>
                <Link to="/adminhistorymanagers" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminHistoryManager</Link>
                <Link to="/adminhelpsupports" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminHelpSupport</Link>
                <Link to="/adminandcustomerofferapps" className="btn btn-outline-success w-100 mb-2 text-start py-1">AdminLabTest</Link>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start py-1">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start py-1">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-2 text-start py-1">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start py-1">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start py-1">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start py-1">bankselectMaster</Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start py-1">BankCreditAmountDetails</Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start py-1">Registration Form</Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start py-1">LivenessimageList</Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start py-1">customerticketraiselist</Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none py-1">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start py-1">Customer_DeliveryAddressList</Link> 
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start py-1">Livetracker</Link> 
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start py-1">Doctor_PatientdetailsLists</Link> 
                <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start py-1">HiringDATALIst</Link>
                <Link to="/qrcodeupload" className="btn btn-outline-success w-100 mb-2 text-start py-1">qrcodeupload</Link>
                <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start py-1">AccountantManagerPanelLists</Link>
                <Link to="/happyclients" className="btn btn-success w-100 mb-2 text-start py-1 fw-bold">HappyClients</Link>  
              </div>
            )}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 p-4" style={{ overflowX: 'auto', width: 'calc(100% - 280px)' }}>
        <div className="container-fluid p-0">
          
          {/* Top Header Section */}
          <div className="bg-white p-4 rounded shadow-sm border mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="h5 fw-bold text-dark mb-1">Happy Clients Management</h2>
              <p className="text-muted small mb-0">Full CRUD control panel for client reviews and testimonials</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowFormModal(true);
              }}
              className="btn btn-primary btn-sm px-3 fw-semibold"
            >
              + Add Happy Client
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded shadow-sm border mb-3">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control form-control-sm"
              style={{ maxWidth: '300px' }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          {/* Data Table View */}
          <div className="bg-white rounded shadow-sm border overflow-hidden mb-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead className="table-light text-secondary text-uppercase" style={{ fontSize: '11px' }}>
                  <tr>
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Client Name</th>
                    <th className="py-3 px-3">Designation & Company</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">Loading records...</td>
                    </tr>
                  ) : currentClients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No records found.</td>
                    </tr>
                  ) : (
                    currentClients.map((client, index) => (
                      <tr key={client.id}>
                        <td className="px-3 fw-semibold text-muted">#{indexOfFirstItem + index + 1}</td>
                        <td className="px-3 fw-bold text-dark d-flex align-items-center gap-2">
                          <img 
                            src={client.imageUrl || 'https://via.placeholder.com/30'} 
                            alt="" 
                            className="rounded-circle border"
                            style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                          />
                          {client.clientName}
                        </td>
                        <td className="px-3 text-secondary">
                          {client.designation} {client.company ? `at ${client.company}` : ''}
                        </td>
                        <td className="px-3 fw-bold text-warning">
                          {client.rating} / 5 ★
                        </td>
                        <td className="px-3">
                          <span className={`badge ${client.isActive ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px' }}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-3 text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => handleViewDetails(client.id)}
                              className="btn btn-outline-secondary py-0 px-2"
                              style={{ fontSize: '11px' }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditClick(client)}
                              className="btn btn-outline-primary py-0 px-2"
                              style={{ fontSize: '11px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="btn btn-outline-danger py-0 px-2"
                              style={{ fontSize: '11px' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="py-2 px-3 border-top d-flex justify-content-between align-items-center bg-white text-muted small">
              <div>
                Showing {filteredClients.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} entries
              </div>
              <div className="btn-group btn-group-sm">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline-secondary"
                >
                  Previous
                </button>
                <button className="btn btn-primary disabled" style={{ opacity: 1 }}>
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="btn btn-outline-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* BOOTSTRAP MODAL: Create / Edit Form */}
          {showFormModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                  <div className="modal-header py-2">
                    <h5 className="modal-title fs-6 fw-bold">
                      {isEditing ? 'Update Client Record' : 'Add New Client Record'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowFormModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body py-2">
                      <div className="mb-2">
                        <label className="form-label small fw-bold">Client Name *</label>
                        <input
                          type="text"
                          name="clientName"
                          required
                          value={formData.clientName}
                          onChange={handleInputChange}
                          className="form-control form-control-sm"
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div className="row">
                        <div className="col-6 mb-2">
                          <label className="form-label small fw-bold">Designation</label>
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="e.g. CEO"
                          />
                        </div>
                        <div className="col-6 mb-2">
                          <label className="form-label small fw-bold">Company</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="e.g. Tech Ltd"
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 mb-2">
                          <label className="form-label small fw-bold">Rating (1-5)</label>
                          <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            required
                            value={formData.rating}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div className="col-6 mb-2">
                          <label className="form-label small fw-bold">Image URL</label>
                          <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                            placeholder="Image link"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="form-label small fw-bold">Testimonial Text *</label>
                        <textarea
                          name="testimonialText"
                          rows="2"
                          required
                          value={formData.testimonialText}
                          onChange={handleInputChange}
                          className="form-control form-control-sm"
                          placeholder="Write feedback..."
                        ></textarea>
                      </div>

                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="form-check-input"
                        />
                        <label htmlFor="isActive" className="form-check-label small fw-semibold">Is Active Status</label>
                      </div>
                    </div>
                    <div className="modal-footer py-2">
                      <button
                        type="button"
                        onClick={() => setShowFormModal(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                      >
                        {isEditing ? 'Save Changes' : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* BOOTSTRAP MODAL: View Details */}
          {showDetailsModal && selectedClient && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content shadow">
                  <div className="modal-header py-2">
                    <h5 className="modal-title fs-6 fw-bold">Client Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDetailsModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body text-center py-3">
                    <img
                      src={selectedClient.imageUrl || 'https://via.placeholder.com/60'}
                      alt=""
                      className="rounded-circle border mb-2 shadow-sm"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <h6 className="fw-bold mb-0 text-dark">{selectedClient.clientName}</h6>
                    <p className="text-primary small mb-2">
                      {selectedClient.designation} {selectedClient.company && `at ${selectedClient.company}`}
                    </p>

                    <div className="text-start bg-light p-2 rounded small border mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted fw-semibold">Rating:</span>
                        <span className="text-warning fw-bold">{selectedClient.rating} / 5 ★</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted fw-semibold">Status:</span>
                        <span className={`badge ${selectedClient.isActive ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '10px' }}>
                          {selectedClient.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted fw-semibold d-block mb-1">Testimonial:</span>
                        <p className="text-dark fst-italic bg-white p-2 rounded border mb-0">
                          "{selectedClient.testimonialText}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="btn btn-dark btn-sm w-100"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}