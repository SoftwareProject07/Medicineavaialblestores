import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

// Centralized API Base URL 
const API_BASE_URL = "https://ecommerencesite.onrender.com/api/TicketAPI";

export default function AdminCustomerticktRaiseList() {
    const [tickets, setTickets] = useState([]);
    const [executives, setExecutives] = useState([]); // Dynamic Executive List State
    const [loading, setLoading] = useState(true);
    const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
    
    // UI states
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Column Picker State Configuration
    const [visibleColumns, setVisibleColumns] = useState({
        ticketId: true,
        ticketNumber: true,
        customerName: true,
        customerId: false, 
        email: true,
        mobileNo: true,   
        orderId: true,
        medicineName: true,
        issueCategory: true,
        subject: false,    
        priority: true,
        status: true,
        assignedTo: true,
        departmentoption: false,
        attachment: false,
        createdDate: true,
    });

    // Modals visibility control states
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    // Update Form Controlled Inputs
    const [editForm, setEditForm] = useState({
        ticketNumber: "",
        customerName: "",
        email: "",
        mobileNo: "",
        issueCategory: "",
        priority: "",
        status: "",
        subject: "",
        description: "",
    });

    // Support Member Selection State
    const [assignMemberType, setAssignMemberType] = useState("");

    const handleShopToggle = () => {
        setIsShopOpen(!isShopOpen);
    };

    useEffect(() => {
        loadTickets();
        loadExecutives(); 
    }, []);

    // Reset to page 1 whenever search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const loadTickets = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/GetAllTickets`);
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading tickets routing stream:", error);
            setLoading(false);
        }
    };

    // --- FIX 1: Updated to correct API endpoint '/MasterAllAssignticket' ---
    const loadExecutives = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/MasterAllAssignticket`);
            console.log("=== API ASSIGNED DATA RECEIVED ===", response.data);
            setExecutives(response.data);
        } catch (error) {
            console.error("Error fetching dynamic executive data records:", error);
        }
    };

    const handleColumnToggle = (columnKey) => {
        setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
    };

    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    const handleOpenUpdate = (ticket) => {
        setSelectedTicket(ticket);
        setEditForm({
            ticketNumber: ticket.ticketNumber && ticket.ticketNumber !== "string" ? ticket.ticketNumber : "",
            customerName: ticket.customerName && ticket.customerName !== "string" ? ticket.customerName : "",
            email: ticket.email && ticket.email !== "string" ? ticket.email : "",
            mobileNo: (ticket.mobile || ticket.mobileNo) && (ticket.mobile !== "string" && ticket.mobileNo !== "string") ? (ticket.mobile || ticket.mobileNo) : "",
            issueCategory: ticket.issueCategory && ticket.issueCategory !== "string" ? ticket.issueCategory : "",
            priority: ticket.priority && ticket.priority !== "string" ? ticket.priority : "Medium",
            status: ticket.status && ticket.status !== "string" ? ticket.status : "Open",
            subject: ticket.subject && ticket.subject !== "string" ? ticket.subject : "",
            description: ticket.description && ticket.description !== "string" ? ticket.description : "",
        });
        setShowUpdateModal(true);
    };

    const sanitizeString = (val) => {
        if (!val || val === "string") return "";
        return String(val);
    };

    const sanitizeInt = (val) => {
        if (!val || val === "string" || isNaN(val)) return null;
        return parseInt(val, 10);
    };

    const executeUpdateRequest = async (payload, explicitAction = null) => {
        const id = payload.ticketId;
        
        const pathsToTry = explicitAction === "assign" ? [
            `${API_BASE_URL}/${id}`,
            `${API_BASE_URL}/AssignTicket/${id}`,
            `${API_BASE_URL}/Assign/${id}`,
            `${API_BASE_URL}/UpdateTicket`,
            `${API_BASE_URL}/Update/${id}`
        ] : [
            `${API_BASE_URL}/${id}`,
            `${API_BASE_URL}/UpdateTicket`,
            `${API_BASE_URL}/Update/${id}`
        ];

        for (let url of pathsToTry) {
            try {
                const res = await axios.put(url, payload);
                return res; 
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    continue; 
                }
                try {
                    if (url.includes("Ticket")) {
                        return await axios.post(url, payload);
                    }
                } catch(postErr) {
                     if (postErr.response && postErr.response.status === 404) continue;
                     throw postErr;
                }
                throw err;
            }
        }
        throw new Error("All designated controller routing schema paths returned 404.");
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ticketId: sanitizeInt(selectedTicket.ticketId),
                ticketNumber: sanitizeString(editForm.ticketNumber) || selectedTicket.ticketNumber || "N/A",
                customerName: sanitizeString(editForm.customerName) || "Default Customer",
                email: sanitizeString(editForm.email) || "info@example.com",
                mobileNo: sanitizeString(editForm.mobileNo) || "0000000000",
                issueCategory: sanitizeString(editForm.issueCategory) || "Other",
                priority: sanitizeString(editForm.priority) || "Medium",
                status: sanitizeString(editForm.status) || "Open",
                subject: sanitizeString(editForm.subject) || "No Subject",
                description: sanitizeString(editForm.description) || "N/A",
                orderId: sanitizeInt(selectedTicket.orderId),
                customerId: sanitizeInt(selectedTicket.customerId),
                medicineName: sanitizeString(selectedTicket.medicineName),
                assignedTo: sanitizeString(selectedTicket.assignedTo) || "",
                createdDate: selectedTicket.createdDate ? selectedTicket.createdDate : new Date().toISOString()
            };

            await executeUpdateRequest(payload, "update");
            setShowUpdateModal(false);
            loadTickets(); 
            alert("Ticket updated successfully!");
        } catch (error) {
            console.error("Critical Exception inside update stack:", error);
            alert("Failed to update ticket.");
        }
    };

    const handleOpenAssign = (ticket) => {
        setSelectedTicket(ticket);
        setAssignMemberType(ticket.assignedTo && ticket.assignedTo !== "string" ? ticket.assignedTo : "");
        setShowAssignModal(true);
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!assignMemberType) {
            alert("Please select a target team member option first.");
            return;
        }

        let rawMobile = selectedTicket.mobileNo || selectedTicket.mobile || selectedTicket.mobileNumber || "";
        let customerMobile = sanitizeString(rawMobile).trim().replace(/\D/g, '');
        const ticketNum = sanitizeString(selectedTicket.ticketNumber) || "N/A";
        const customerName = sanitizeString(selectedTicket.customerName) || "Customer";

        // Dynamic lookup: maps name directly to retrieve mobile key dynamically
        const matchedExecutive = executives.find((exec) => {
            const execName = exec.assignedTo || exec.assignedName || exec.assignedname || exec.name || "";
            return sanitizeString(execName) === sanitizeString(assignMemberType);
        });
        let careMobile = matchedExecutive ? sanitizeString(matchedExecutive.mobileNo || matchedExecutive.mobile) : "";

        try {
            const payload = {
                ticketId: sanitizeInt(selectedTicket.ticketId),
                ticketNumber: ticketNum,
                customerName: customerName,
                email: sanitizeString(selectedTicket.email) || "user@example.com",
                mobileNo: customerMobile || "0000000000", 
                issueCategory: sanitizeString(selectedTicket.issueCategory) || "Other",
                priority: sanitizeString(selectedTicket.priority) || "Medium",
                status: "Assigned", 
                subject: sanitizeString(selectedTicket.subject) || "Subject",
                description: sanitizeString(selectedTicket.description) || "N/A",
                orderId: sanitizeInt(selectedTicket.orderId),
                customerId: sanitizeInt(selectedTicket.customerId),
                medicineName: sanitizeString(selectedTicket.medicineName) || "",
                createdDate: selectedTicket.createdDate ? selectedTicket.createdDate : new Date().toISOString(),
                assignedTo: String(assignMemberType),
            };

            await executeUpdateRequest(payload, "assign");
            
            const gatewayApiKey = "YOUR_ACTUAL_API_KEY_HERE"; 
            const dltTemplateId = "YOUR_DLT_TEMPLATE_ID_HERE";
            const senderId = "AKMEDZ";
            const metaAccessToken = "YOUR_META_PERMANENT_ACCESS_TOKEN";
            const whatsappInstanceUrl = "https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages";

            if (careMobile && careMobile.length === 10) {
                const careCleanMobile = `91${careMobile}`;
                const careMessage = `Hello, a new ticket #${ticketNum} regarding '${selectedTicket.issueCategory}' has been assigned to you. Customer: ${customerName}. Team AKMedizo`;

                try {
                    const smsCareUrl = `https://api.bulksmsgateway.in/send?apikey=${gatewayApiKey}&to=${careMobile}&sender=${senderId}&message=${encodeURIComponent(careMessage)}&template_id=${dltTemplateId}`;
                    await axios.get(smsCareUrl);
                } catch (err) {
                    console.error("Care Member SMS routing failed:", err);
                }

                try {
                    const waCarePayload = {
                        messaging_product: "whatsapp",
                        to: careCleanMobile,
                        type: "template",
                        template: {
                            name: "care_assignment_alert", 
                            language: { code: "en_US" },
                            components: [
                                {
                                    type: "body",
                                    parameters: [
                                        { type: "text", text: ticketNum },
                                        { type: "text", text: customerName }
                                    ]
                                }
                            ]
                        }
                    };
                    await axios.post(whatsappInstanceUrl, waCarePayload, {
                        headers: { 'Authorization': `Bearer ${metaAccessToken}`, 'Content-Type': 'application/json' }
                    });
                } catch (waErr) {
                    console.error("Care Member WhatsApp routing failed:", waErr);
                }
            }

            if (customerMobile && customerMobile !== "0000000000" && customerMobile.length === 10) {
                const cleanCustomerMobile = `91${customerMobile}`;
                const customerMessage = `Dear Customer, your ticket #${ticketNum} has been successfully assigned to ${assignMemberType}. Update as soon. Team AKMedizo`;

                try {
                    const smsCustUrl = `https://api.bulksmsgateway.in/send?apikey=${gatewayApiKey}&to=${customerMobile}&sender=${senderId}&message=${encodeURIComponent(customerMessage)}&template_id=${dltTemplateId}`;
                    await axios.get(smsCustUrl);
                } catch (err) {
                    console.error("Customer SMS routing failed:", err);
                }

                try {
                    const waCustPayload = {
                        messaging_product: "whatsapp",
                        to: cleanCustomerMobile,
                        type: "template",
                        template: {
                            name: "ticket_assignment_update", 
                            language: { code: "en_US" },
                            components: [
                                {
                                    type: "body",
                                    parameters: [
                                        { type: "text", text: ticketNum },
                                        { type: "text", text: assignMemberType }
                                    ]
                                }
                            ]
                        }
                    };
                    await axios.post(whatsappInstanceUrl, waCustPayload, {
                        headers: { 'Authorization': `Bearer ${metaAccessToken}`, 'Content-Type': 'application/json' }
                    });
                } catch (waErr) {
                    console.error("Customer WhatsApp routing failed:", waErr);
                }
            }

            setShowAssignModal(false);
            loadTickets(); 
            alert(`Ticket #${ticketNum} successfully processed for ${assignMemberType}.`);
            
        } catch (error) {
            console.error("Critical Exception inside assignment pipeline:", error);
            alert("Failed to complete data routing.");
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm(`Are you sure you want to delete Ticket ID: ${ticketId}?`)) {
            try {
                await axios.delete(`${API_BASE_URL}/DeleteTicket/${ticketId}`);
                loadTickets(); 
                alert("Ticket deleted successfully!");
            } catch (error) {
                console.error("Error during deletion context execution:", error);
                alert("Failed to delete the selected ticket entity.");
            }
        }
    };

    // Filter and Pagination Pipeline Execution
    const filteredTickets = tickets.filter((ticket) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (ticket.ticketNumber && ticket.ticketNumber.toLowerCase().includes(searchLower)) ||
            (ticket.customerName && ticket.customerName.toLowerCase().includes(searchLower)) ||
            (ticket.email && ticket.email.toLowerCase().includes(searchLower)) ||
            (ticket.issueCategory && ticket.issueCategory.toLowerCase().includes(searchLower))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    return (
        <div style={{ display: "flex" }}>
            
            {/* --- SIDEBAR --- */}
            <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
                <div className="brand mb-4 d-flex align-items-center">
                    <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
                    <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
                </div>
                <div className="mb-3 border-bottom border-secondary pb-3">
                  <button 
                    onClick={() => setMasterDropdownOpen(!masterDropdownOpen)} 
                    className="btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center fw-bold mb-2" 
                    style={{ fontSize: '13px', borderStyle: 'dashed' }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className="fas fa-sliders-h"></i> Master Config
                    </span>
                    <i className={`fas ${masterDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: '11px' }}></i>
                  </button>
                  
                  {masterDropdownOpen && (
                    <div className="ps-1 mt-2">
                      <Link 
                        to="/adminissuetype" 
                        className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                        style={{ fontSize: '12px' }}
                      >
                        <i className="fas fa-plus-circle"></i> Add Item Type
                      </Link>


                        <Link 
                to="/adminmasterassignedto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddAssignedTO 
              </Link>


              <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                AddDoctorAssignTo
                              </Link>
            
               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                 
               <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Language Master           
                </Link>

                      

                    </div>
                  )}
                </div>
                <ul className="nav flex-column mt-4">
                   <li className="mb-3">
            <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
            </div>
          </li>
          <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails </Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start"> Registeartion Form </Link></li>
          <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
                            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                                      <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>


 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
             <li>      <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
        </Link></li>
         <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

          
          <li className="mt-3">
            <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </button>
          </li>
                </ul>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="container-fluid mt-4" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
                
                {/* Field Choice Picker */}
                <div className="card mb-3 shadow-sm border-secondary">
                    <div className="card-header bg-dark text-white py-2">
                        <h6 className="mb-0"><i className="fas fa-filter me-2"></i>Field Choice Grid Columns Controller</h6>
                    </div>
                    <div className="card-body py-2">
                        <div className="d-flex flex-wrap gap-3">
                            {Object.keys(visibleColumns).map((colKey) => (
                                <div className="form-check form-check-inline mb-0" key={colKey}>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id={`checkbox-${colKey}`}
                                        checked={visibleColumns[colKey]}
                                        onChange={() => handleColumnToggle(colKey)}
                                    />
                                    <label className="form-check-label text-capitalize font-monospace" style={{ fontSize: '13px', cursor: 'pointer' }} htmlFor={`checkbox-${colKey}`}>
                                        {colKey.replace(/([A-Z])/g, ' $1')}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card shadow">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">Customer Ticket List</h3>
                        <div style={{ width: "300px" }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search filtering data..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <h4 className="text-center">Loading Data Streams...</h4>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hover align-middle text-nowrap">
                                        <thead className="table-dark">
                                            <tr>
                                                {visibleColumns.ticketId && <th>Ticket Id</th>}
                                                {visibleColumns.ticketNumber && <th>Ticket No</th>}
                                                {visibleColumns.customerName && <th>Customer</th>}
                                                {visibleColumns.customerId && <th>Customer Id</th>}
                                                {visibleColumns.email && <th>Email</th>}
                                                {visibleColumns.mobileNo && <th>Mobile</th>}
                                                {visibleColumns.orderId && <th>Order Id</th>}
                                                {visibleColumns.medicineName && <th>Medicine</th>}
                                                {visibleColumns.issueCategory && <th>Issue</th>}
                                                {visibleColumns.subject && <th>Subject</th>}
                                                {visibleColumns.priority && <th>Priority</th>}
                                                {visibleColumns.departmentoption && <th>LoginCreditionremakrs</th>}
                                                {visibleColumns.attachment && <th>Attachment</th>}
                                                {visibleColumns.status && <th>Status</th>}
                                                {visibleColumns.assignedTo && <th>Assigned To</th>}
                                                {visibleColumns.createdDate && <th>Created Date</th>}
                                                <th className="text-center" style={{ position: "sticky", right: 0, backgroundColor: "#212529", zIndex: 5, minWidth: "320px" }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTickets.length > 0 ? (
                                                currentTickets.map((item) => (
                                                    <tr key={item.ticketId}>
                                                        {visibleColumns.ticketId && <td>{item.ticketId}</td>}
                                                        {visibleColumns.ticketNumber && <td>{sanitizeString(item.ticketNumber) || "N/A"}</td>}
                                                        {visibleColumns.customerName && <td>{sanitizeString(item.customerName) || "N/A"}</td>}
                                                        {visibleColumns.customerId && <td>{!item.customerId || item.customerId === "string" ? "N/A" : item.customerId}</td>}
                                                        {visibleColumns.email && <td>{sanitizeString(item.email) || "N/A"}</td>}
                                                        {visibleColumns.mobileNo && <td>{sanitizeString(item.mobile || item.mobileNo) || "N/A"}</td>}
                                                        {visibleColumns.orderId && <td>{!item.orderId || item.orderId === "string" ? "N/A" : item.orderId}</td>}
                                                        {visibleColumns.medicineName && <td>{!item.medicineName || item.medicineName === "string" ? "N/A" : item.medicineName}</td>}
                                                        {visibleColumns.issueCategory && <td>{sanitizeString(item.issueCategory) || "N/A"}</td>}
                                                        {visibleColumns.subject && <td>{sanitizeString(item.subject) || "N/A"}</td>}
                                                        {visibleColumns.priority && <td>{sanitizeString(item.priority) || "Medium"}</td>}
                                                        {visibleColumns.departmentoption && (
                                                            <td>{sanitizeString(item.departmentOption || item.departmentoption) || "N/A"}</td>
                                                        )}
                                                        {visibleColumns.attachment && <td>{sanitizeString(item.attachment) || "No Attachment"}</td>}
                                                        {visibleColumns.status && (
                                                            <td>
                                                                <span className={`badge ${item.status === 'Open' ? 'bg-warning' : item.status === 'Assigned' ? 'bg-info' : 'bg-success'}`}>
                                                                    {sanitizeString(item.status) || "Open"}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {visibleColumns.assignedTo && (
                                                            <td>
                                                                {item.assignedTo && item.assignedTo !== "string" ? (
                                                                    <span className="badge bg-primary p-2">{item.assignedTo}</span>
                                                                ) : (
                                                                    <span className="text-muted fst-italic">Not Assigned</span>
                                                                )}
                                                            </td>
                                                        )}
                                                        {visibleColumns.createdDate && (
                                                            <td>{item.createdDate ? new Date(item.createdDate).toLocaleDateString() : ""}</td>
                                                        )}
                                                        <td className="text-center" style={{ position: "sticky", right: 0, backgroundColor: "#fff", boxShadow: "-2px 0 5px rgba(0,0,0,0.05)" }}>
                                                            <div className="d-flex justify-content-center gap-1">
                                                                <button type="button" className="btn btn-sm btn-info text-white" onClick={() => handleViewDetails(item)}>Details</button>
                                                                <button type="button" className="btn btn-sm btn-primary" onClick={() => handleOpenAssign(item)}>Assign Task</button>
                                                                <button type="button" className="btn btn-sm btn-warning text-white" onClick={() => handleOpenUpdate(item)}>Edit</button>
                                                                <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteTicket(item.ticketId)}>Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="20" className="text-center py-3">No matching tickets found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} items
                                        </div>
                                        <nav>
                                            <ul className="pagination mb-0">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-item page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                                                </li>
                                                {[...Array(totalPages)].map((_, idx) => (
                                                    <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-item page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 1. VIEW DETAILS MODAL --- */}
            {showDetailsModal && selectedTicket && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h5 className="modal-title">Ticket details: {selectedTicket.ticketNumber}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6"><strong>Customer:</strong> {selectedTicket.customerName}</div>
                                    <div className="col-md-6"><strong>Email Address:</strong> {selectedTicket.email}</div>
                                    <div className="col-md-6"><strong>Contact Phone:</strong> {selectedTicket.mobileNo || selectedTicket.mobile}</div>
                                    <div className="col-md-6"><strong>Issue Domain:</strong> {selectedTicket.issueCategory}</div>
                                    <div className="col-md-6"><strong>Priority Rank:</strong> {selectedTicket.priority}</div>
                                    <div className="col-md-6"><strong>Current Status:</strong> {selectedTicket.status}</div>
                                    <div className="col-12"><strong>Subject:</strong> {selectedTicket.subject}</div>
                                    <div className="col-12"><strong>Description Notes:</strong><p className="border p-2 bg-light rounded">{selectedTicket.description}</p></div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Close View</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. EDIT/UPDATE TICKET MODAL --- */}
            {showUpdateModal && selectedTicket && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="modal-header bg-warning text-dark">
                                    <h5 className="modal-title">Modify Ticket Information</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Issue Category</label>
                                        <input type="text" className="form-control" value={editForm.issueCategory} onChange={(e) => setEditForm({...editForm, issueCategory: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Priority</label>
                                        <select className="form-select" value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ticket Status Mapping</label>
                                        <select className="form-select" value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                                            <option value="Open">Open</option>
                                            <option value="Assigned">Assigned</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Subject</label>
                                        <input type="text" className="form-control" value={editForm.subject} onChange={(e) => setEditForm({...editForm, subject: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Detailed Notes</label>
                                        <textarea className="form-control" rows="3" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-warning">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 3. FIX 2: DYNAMIC ASSIGN TASK MODAL WITH EXACT 'assignedTo' MATCH --- */}
          {/* --- DYNAMIC ASSIGN TASK MODAL (FIXED FOR NULL & DUPLICATES) --- */}
{showAssignModal && selectedTicket && (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <form onSubmit={handleAssignSubmit}>
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Dispatch Department Assignment</h5>
                        <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Assigning Ticket : <strong>#{selectedTicket.ticketNumber}</strong><p>issueCategory : <strong>{selectedTicket.issueCategory}</strong> </p> <p>for customer: <strong>{selectedTicket.customerName}</strong>.</p></p>
                        
                        <div className="mb-3">
                            <label className="form-label">Select Target Executive / Unit</label>
                            <select 
                                className="form-select" 
                                value={assignMemberType} 
                                onChange={(e) => setAssignMemberType(e.target.value)} 
                                required
                            >
                                <option value="">-- Choose Assigned Entity --</option>
                                
                                {/* 1. Pehle saare null/empty values ko filter kiya */}
                                {/* 2. Set ka use karke duplicates ko remove kiya */}
                                {Array.from(
                                    new Set(
                                        executives
                                            .map(exec => exec.assignedTo || exec.assignedName || exec.assignedname || exec.name)
                                            .filter(name => name && name !== "string" && name !== "null")
                                    )
                                ).map((finalName, idx) => (
                                    <option key={idx} value={finalName}>
                                        {finalName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <small className="text-muted d-block mt-2">
                            <i className="fas fa-info-circle me-1"></i> Submitting assignment will trigger automated integration SMS & WhatsApp alerts to both the customer and the chosen care professional.
                        </small>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Dismiss</button>
                        <button type="submit" className="btn btn-primary">Process Assignment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)}
        </div>
    );
}