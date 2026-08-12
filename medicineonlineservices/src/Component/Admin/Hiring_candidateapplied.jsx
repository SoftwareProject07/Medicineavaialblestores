import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Hiring_candidateapplied() {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);
  
  // New State for Hiring ON/OFF Toggle
  const [isHiringActive, setIsHiringActive] = useState(true);

  // Sidebar dropdown states
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    jobTitle: '',
    jobDescription: '',
    department: '',
    experienceRequired: '',
    offeredCTC: '',
    location: '',
    noOfOpenings: 1,
    isActive: true,
    closingDate: ''
  });

  useEffect(() => {
    fetchHiringData();
  }, []);

  const fetchHiringData = async () => {
    try {
      const jobRes = await fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/get-all-jobs");
      const jobData = await jobRes.json();
      
      const appRes = await fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/get-all-applications");
      const appData = await appRes.json();

      setJobs(Array.isArray(jobData) ? jobData : []);
      setApplications(Array.isArray(appData) ? appData : []);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Could not fetch hiring data from server.',
        background: '#16161a',
        color: '#ffffff'
      });
      setLoading(false);
    }
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const handleHiringToggle = () => {
    const nextState = !isHiringActive;
    setIsHiringActive(nextState);
    Swal.fire({
      icon: 'success',
      title: nextState ? 'Hiring is now ON' : 'Hiring is now OFF',
      text: nextState ? 'Candidates can apply for jobs.' : 'Hiring portal is paused.',
      background: '#16161a',
      color: '#fff',
      confirmButtonColor: '#198754',
      timer: 1500
    });
  };

  const getNavLinkClass = (path) => {
    return `d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded ${
      location.pathname === path ? 'bg-success text-white fw-bold' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  const getSubLinkClass = (path) => {
    return `position-relative py-1.5 px-2 text-decoration-none d-block ${
      location.pathname === path ? 'text-success fw-bold' : 'text-white-50'
    }`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewJob({
      ...newJob,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();

    if (!isHiringActive) {
      Swal.fire({
        icon: 'warning',
        title: 'Hiring is OFF',
        text: 'Please turn ON Hiring status before creating a new job opening.',
        background: '#16161a',
        color: '#fff',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    const isDuplicate = jobs.some(job => 
      (job.jobTitle || job.title)?.trim().toLowerCase() === newJob.jobTitle.trim().toLowerCase()
    );

    if (isDuplicate) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Job',
        text: 'A job with this title already exists in the active openings.',
        background: '#16161a',
        color: '#fff',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...newJob,
        offeredCTC: Number(newJob.offeredCTC),
        noOfOpenings: Number(newJob.noOfOpenings),
        postedDate: new Date().toISOString(),
        closingDate: newJob.closingDate ? new Date(newJob.closingDate).toISOString() : new Date().toISOString()
      };

      const response = await fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/create-job", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowCreateJobModal(false);
        setNewJob({
          jobTitle: '',
          jobDescription: '',
          department: '',
          experienceRequired: '',
          offeredCTC: '',
          location: '',
          noOfOpenings: 1,
          isActive: true,
          closingDate: ''
        });
        
        await fetchHiringData();
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Job opening created successfully.',
          background: '#16161a',
          color: '#fff',
          confirmButtonColor: '#198754'
        });
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not create the job posting.',
        background: '#16161a',
        color: '#fff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminProfileClick = () => {
    Swal.fire({
      title: '<span style="color: #fff;">Admin Profile Details</span>',
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6;">
          <p><strong>Name:</strong> Super Admin</p>
          <p><strong>Role:</strong> HR Manager & Operations Head</p>
          <p><strong>Email:</strong> admin@akmedizo.com</p>
          <p><strong>Status:</strong> <span style="color: #198754; font-weight: bold;">Active Online</span></p>
        </div>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Close'
    });
  };

  const handleHiringStatsClick = () => {
    Swal.fire({
      title: '<span style="color: #fff;">Hiring Statistics Overview</span>',
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6;">
          <p><strong>Hiring Master Status:</strong> <span style="color: ${isHiringActive ? '#198754' : '#dc3545'}; font-weight: bold;">${isHiringActive ? 'ON (Active)' : 'OFF (Paused)'}</span></p>
          <p><strong>Total Active Job Openings:</strong> ${jobs.length}</p>
          <p><strong>Total Candidate Applications:</strong> ${applications.length}</p>
          <p><strong>Pending Reviews:</strong> ${applications.filter(a => (a.status || a.applicationStatus) === 'Applied').length}</p>
        </div>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Got it'
    });
  };

  const handleViewDetails = (app) => {
    const candidateName = app.fullName || app.name || app.candidateName || 'N/A';
    const emailVal = app.email || app.candidateEmail || 'N/A';
    const phoneVal = app.phoneNo || app.phone || app.mobile || 'N/A';
    const jobTitleVal = app.jobTitle || app.jobName || app.title || 'N/A';
    const currentCTCVal = app.currentCTC || app.ctc || 'N/A';
    const expectedCTCVal = app.expectedCTC || 'N/A';
    const noticePeriodVal = app.noticePeriod || 'N/A';
    const resumeLinkVal = app.resumeUrl || app.resume || app.cv || '#';
    const statusVal = app.status || app.applicationStatus || 'Applied';

    Swal.fire({
      title: `<span style="color: #fff;">Candidate Details</span>`,
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6;">
          <p><strong>Full Name:</strong> ${candidateName}</p>
          <p><strong>Applied For:</strong> ${jobTitleVal}</p>
          <p><strong>Email:</strong> ${emailVal}</p>
          <p><strong>Phone No:</strong> ${phoneVal}</p>
          <p><strong>Current CTC:</strong> ${currentCTCVal}</p>
          <p><strong>Expected CTC:</strong> ${expectedCTCVal}</p>
          <p><strong>Notice Period:</strong> ${noticePeriodVal}</p>
          <p><strong>Resume Link:</strong> <a href="${resumeLinkVal}" target="_blank" style="color: #198754;">View Resume</a></p>
          <p><strong>Current Status:</strong> <span style="color: #ffc107;">${statusVal}</span></p>
        </div>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Close'
    });
  };

  const handleUpdateStatus = (id, currentStatus) => {
    Swal.fire({
      title: '<span style="color: #fff;">Update Application Status</span>',
      input: 'select',
      inputOptions: {
        'Applied': 'Applied',
        'Shortlisted': 'Shortlisted',
        'Interview Scheduled': 'Interview Scheduled',
        'Selected': 'Selected',
        'Rejected': 'Rejected'
      },
      inputValue: currentStatus || 'Applied',
      background: '#16161a',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStatus = result.value;
        try {
          const response = await fetch(
            `https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/update-application-status/${id}`, 
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newStatus)
            }
          );

          if (response.ok) {
            setApplications(applications.map(app => (app.id === id || app._id === id) ? { ...app, status: newStatus, applicationStatus: newStatus } : app));
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `Candidate status changed to ${newStatus}`,
              background: '#16161a',
              color: '#fff',
              confirmButtonColor: '#198754',
              timer: 1500
            });
          } else {
            throw new Error('Failed to update on server');
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update status',
            background: '#16161a',
            color: '#fff'
          });
        }
      }
    });
  };

  const handleDeleteApplication = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this application record!",
      icon: 'warning',
      background: '#16161a',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setApplications(applications.filter(app => app.id !== id && app._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Application has been removed.',
            background: '#16161a',
            color: '#fff',
            confirmButtonColor: '#198754',
            timer: 1500
          });
        } catch (error) {
          Swal.fire('Error', 'Failed to delete application', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const uniqueJobs = jobs.filter((job, index, self) => {
    const title = job.jobTitle || job.title || '';
    return index === self.findIndex((j) => (
      (j.jobTitle || j.title || '').trim().toLowerCase() === title.trim().toLowerCase()
    ));
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

      {/* प्रीमियम ट्री-स्ट्रक्चर साइडबार */}
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
        {/* ब्रांड लोगो */}
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* ग्लोबल शॉप स्टेटस स्विच */}
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

        {/* नेविगेशन लिंक्स */}
        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          {/* 1. OPERATIONS CENTER DROPDOWN */}
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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Add Item Type
                </Link>

                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAssignedTO
                </Link>

                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/doctorassignto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddDoctorAssignTo
                </Link>

                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addadmintypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
                              </Link>
              </div>
            )}
          </div>

          {/* 2. OPERATIONS REGISTRY DROPDOWN */}
          <div className="mt-2">
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
              <div className="position-relative ms-3 mt-1 d-flex flex-column gap-1" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Dashboard</Link>
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">CustomerLIST</Link>
                <Link to="/" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">OrderPaymentList</Link>
                <Link to="/" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">OrderStatusLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-1 text-start btn-sm">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">bankselectMaster</Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">BankCreditAmountDetails</Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Registeartion Form</Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">LivenessimageList</Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">customerticketraiselist</Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-1 text-start btn-sm text-decoration-none">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Customer_DeliveryAddressList</Link>
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Livetracker</Link>
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Doctor_PatientdetailsLists</Link>
                <Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">HiringDATA</Link>
              </div>
            )}
          </div>

          {/* टर्मिनेट / लॉगआउट एक्शन */}
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
      <div style={{ marginLeft: '280px', flex: 1, padding: '24px', backgroundColor: '#121212', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* --- HEADER WITH HIRING ON/OFF TOGGLE --- */}
          <header style={{ 
            backgroundColor: '#16161a', 
            border: '1px solid #232329', 
            borderRadius: '12px', 
            padding: '20px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#198754', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                A
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Team Hiring & Applications</h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#8a8a98' }}>Manage job requisitions and candidate responses</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Hiring ON/OFF Toggle Widget */}
              <div 
                onClick={handleHiringToggle} 
                className="px-3 py-2 rounded d-flex align-items-center gap-3 transition-all" 
                style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: `1px solid ${isHiringActive ? '#198754' : '#dc3545'}`, borderRadius: '6px' }}
                title="Click to toggle Hiring ON/OFF"
              >
                <div className="d-flex flex-column text-end">
                  <span style={{ fontSize: '9px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Hiring Status</span>
                  <span className={`fw-bold ${isHiringActive ? 'text-success' : 'text-danger'}`} style={{ fontSize: '12px' }}>
                    {isHiringActive ? "Hiring: ON" : "Hiring: OFF"}
                  </span>
                </div>
                <i className={`fas fa-2xl ${isHiringActive ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '22px' }}></i>
              </div>

              <button 
                onClick={() => {
                  if(!isHiringActive) {
                    Swal.fire({ icon: 'warning', title: 'Hiring is OFF', text: 'Turn on Hiring status to add job details.', background: '#16161a', color: '#fff' });
                    return;
                  }
                  setShowCreateJobModal(true);
                }} 
                className="btn btn-success btn-sm px-3 fw-bold" 
                style={{ backgroundColor: '#198754', border: 'none', opacity: isHiringActive ? 1 : 0.6 }}
              >
                <i className="fas fa-plus-circle me-2"></i> + Add Job Details
              </button>

              <button onClick={handleAdminProfileClick} className="btn btn-outline-success btn-sm px-3 fw-bold">
                <i className="fas fa-user-shield me-2"></i> Admin Profile
              </button>
              
              <button onClick={handleHiringStatsClick} className="btn btn-outline-light btn-sm px-3 fw-bold">
                <i className="fas fa-chart-line me-2"></i> Hiring Stats
              </button>
            </div>
          </header>

          {/* --- CREATE JOB MODAL FORM --- */}
          {showCreateJobModal && isHiringActive && (
            <div style={{ backgroundColor: '#16161a', border: '1px solid #198754', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232329', paddingBottom: '10px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#198754' }}>Post a New Job Opening</h4>
                <button onClick={() => setShowCreateJobModal(false)} className="btn btn-sm btn-outline-secondary" style={{ color: '#fff' }}>✕</button>
              </div>

              <form onSubmit={handleCreateJobSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Job Title</label>
                  <input type="text" name="jobTitle" value={newJob.jobTitle} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="e.g. React Developer" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Department</label>
                  <input type="text" name="department" value={newJob.department} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="e.g. Engineering" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Experience Required</label>
                  <input type="text" name="experienceRequired" value={newJob.experienceRequired} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="e.g. 2-4 Years" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Offered CTC</label>
                  <input type="number" name="offeredCTC" value={newJob.offeredCTC} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="e.g. 600000" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Location</label>
                  <input type="text" name="location" value={newJob.location} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="e.g. Remote / Noida" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Number of Openings</label>
                  <input type="number" name="noOfOpenings" value={newJob.noOfOpenings} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Closing Date</label>
                  <input type="date" name="closingDate" value={newJob.closingDate} onChange={handleInputChange} required className="form-control form-control-sm bg-dark text-white border-secondary" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', color: '#8a8a98', display: 'block', marginBottom: '4px' }}>Job Description</label>
                  <textarea name="jobDescription" value={newJob.jobDescription} onChange={handleInputChange} required rows="3" className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Enter roles and responsibilities..."></textarea>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
                  <input type="checkbox" name="isActive" id="isActiveCheck" checked={newJob.isActive} onChange={handleInputChange} className="form-check-input" />
                  <label htmlFor="isActiveCheck" style={{ fontSize: '13px', color: '#fff', cursor: 'pointer' }}>Active Listing</label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowCreateJobModal(false)} className="btn btn-sm btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-sm btn-success fw-bold px-4">
                    {isSubmitting ? 'Saving...' : 'Save & Publish Job'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- ACTIVE JOB OPENINGS SECTION --- */}
          <section style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232329', paddingBottom: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                Active Job Openings (Employer Registry)
              </h4>
              <button 
                onClick={() => {
                  if(!isHiringActive) {
                    Swal.fire({ icon: 'warning', title: 'Hiring is OFF', text: 'Turn on Hiring status to add job details.', background: '#16161a', color: '#fff' });
                    return;
                  }
                  setShowCreateJobModal(true);
                }} 
                className="btn btn-sm btn-success fw-bold" 
                style={{ backgroundColor: '#198754', border: 'none' }}
              >
                + Add Job Details
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {uniqueJobs.length === 0 ? (
                <p style={{ color: '#8a8a98', fontSize: '13px' }}>No active job openings found.</p>
              ) : (
                uniqueJobs.map((job, idx) => (
                  <div key={job.id || job._id || idx} style={{ backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '8px', padding: '16px' }}>
                    <h5 style={{ color: '#198754', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', textTransform: 'uppercase' }}>{job.jobTitle || job.title || 'Untitled Job'}</h5>
                    <p style={{ fontSize: '13px', color: '#b1b1c0', margin: '4px 0' }}>Department: <span className="text-white">{job.department || 'N/A'}</span></p>
                    <p style={{ fontSize: '13px', color: '#b1b1c0', margin: '4px 0' }}>Openings: <span className="text-white">{job.noOfOpenings || job.openings || 0}</span></p>
                    <p style={{ fontSize: '13px', color: '#b1b1c0', margin: '4px 0' }}>Location: <span className="text-white">{job.location || 'N/A'}</span></p>
                    <p style={{ fontSize: '13px', color: '#b1b1c0', margin: '4px 0' }}>Offered Package: <span className="text-white">₹{job.offeredCTC || job.package || 0}</span></p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* --- CANDIDATE APPLICATIONS SECTION --- */}
          <section style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '20px 24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #232329', paddingBottom: '8px' }}>
              Candidate Applied Details
            </h4>
            
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '13.5px', width: '100%', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ color: '#8a8a98', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th>Candidate Name</th>
                    <th>Applied For</th>
                    <th>Contact Information</th>
                    <th>Current CTC</th>
                    <th>Expected CTC</th>
                    <th>Notice Period</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4" style={{ color: '#8a8a98' }}>No candidate applications found.</td>
                    </tr>
                  ) : (
                    applications.map((app, idx) => {
                      const candidateName = app.fullName || app.name || app.candidateName || 'N/A';
                      const appliedFor = app.jobTitle || app.jobName || app.title || (app.jobId ? `Job ID: ${app.jobId}` : 'N/A');
                      const email = app.email || app.candidateEmail || 'N/A';
                      const phoneNo = app.phoneNo || app.phone || app.mobile || '';
                      const currentCTC = app.currentCTC || app.ctc || 'N/A';
                      const expectedCTC = app.expectedCTC || 'N/A';
                      const noticePeriod = app.noticePeriod || 'N/A';
                      const status = app.status || app.applicationStatus || 'Applied';

                      return (
                        <tr key={app.id || app._id || idx}>
                          <td className="fw-bold text-white">{candidateName}</td>
                          <td>{appliedFor}</td>
                          <td>
                            <div>{email}</div>
                            {phoneNo && <div style={{ fontSize: '11px', color: '#8a8a98' }}>{phoneNo}</div>}
                          </td>
                          <td>{currentCTC}</td>
                          <td>{expectedCTC}</td>
                          <td>{noticePeriod}</td>
                          <td>
                            <span className={`badge ${
                              status === 'Selected' ? 'bg-success' : 
                              status === 'Rejected' ? 'bg-danger' : 
                              status === 'Shortlisted' ? 'bg-primary' : 'bg-warning text-dark'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="text-center">
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleViewDetails(app)}
                                className="btn btn-outline-info btn-sm"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id || app._id, status)}
                                className="btn btn-outline-success btn-sm"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                title="Update Status"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(app.id || app._id)}
                                className="btn btn-outline-danger btn-sm"
                                style={{ fontSize: '11px', padding: '4px 8px' }}
                                title="Delete Application"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}