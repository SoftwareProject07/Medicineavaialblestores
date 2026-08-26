import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function HiringDATALIst() {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);
  
  const [deletedAppIds, setDeletedAppIds] = useState(() => {
    try {
      const saved = localStorage.getItem('deletedAppIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editJobData, setEditJobData] = useState({
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
  
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [currentAppPage, setCurrentAppPage] = useState(1);
  const itemsPerPage = 5;

  const [isHiringActive, setIsHiringActive] = useState(true);

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
      
      if (Array.isArray(appData)) {
        const filteredApps = appData.filter(app => {
          const appId = app.id || app._id;
          const candidateName = (app.fullName || app.name || app.candidateName || '').toLowerCase();
          const email = (app.email || app.candidateEmail || '').toLowerCase();
          
          if (candidateName === 'string' || email === 'user@example.com') return false;
          if (deletedAppIds.includes(appId)) return false;
          return true;
        });
        setApplications(filteredApps);
      } else {
        setApplications([]);
      }

      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Loading Failed',
        text: 'Could not fetch hiring data from server.',
        background: '#16161a',
        color: '#ffffff',
        confirmButtonColor: '#198754'
      });
      setLoading(false);
    }
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewJob({
      ...newJob,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditJobData({
      ...editJobData,
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
        color: '#fff',
        confirmButtonColor: '#198754'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewJobDetails = (job) => {
    const rawClosingDate = job.closingDate || job.endDate || job.validTill;
    let formattedDate = 'N/A';
    if (rawClosingDate) {
      const parsedDate = new Date(rawClosingDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      } else {
        formattedDate = String(rawClosingDate).split('T')[0];
      }
    }

    Swal.fire({
      title: `<span style="color: #fff; text-transform: uppercase;">${job.jobTitle || job.title || 'Job Details'}</span>`,
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6;">
          <p><strong>Department:</strong> ${job.department || 'N/A'}</p>
          <p><strong>Experience Required:</strong> ${job.experienceRequired || 'N/A'}</p>
          <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
          <p><strong>Openings:</strong> ${job.noOfOpenings || job.openings || 0}</p>
          <p><strong>Offered CTC:</strong> ₹${job.offeredCTC || job.package || 'N/A'}</p>
          <p><strong>Closing Date:</strong> ${formattedDate}</p>
          <p><strong>Job Description:</strong><br/><span style="color: #fff;">${job.jobDescription || 'No description provided.'}</span></p>
        </div>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Close'
    });
  };

  const handleOpenEditJob = (job) => {
    setEditingJobId(job.id || job._id);
    let formattedClosing = '';
    if (job.closingDate) {
      formattedClosing = job.closingDate.split('T')[0];
    }
    setEditJobData({
      jobTitle: job.jobTitle || job.title || '',
      jobDescription: job.jobDescription || '',
      department: job.department || '',
      experienceRequired: job.experienceRequired || '',
      offeredCTC: job.offeredCTC || '',
      location: job.location || '',
      noOfOpenings: job.noOfOpenings || 1,
      isActive: job.isActive !== undefined ? job.isActive : true,
      closingDate: formattedClosing
    });
    setShowEditJobModal(true);
  };

  const handleUpdateJobSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id: editingJobId,
        ...editJobData,
        offeredCTC: Number(editJobData.offeredCTC),
        noOfOpenings: Number(editJobData.noOfOpenings),
        closingDate: editJobData.closingDate ? new Date(editJobData.closingDate).toISOString() : new Date().toISOString()
      };

      let response = await fetch(`https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/update-job`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        response = await fetch(`https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/update-job/${editingJobId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok || response.status === 200) {
        setShowEditJobModal(false);
        await fetchHiringData();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Job opening updated successfully.',
          background: '#16161a',
          color: '#fff',
          confirmButtonColor: '#198754',
          timer: 1500
        });
      } else {
        throw new Error('Failed to update job');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not update the job posting.',
        background: '#16161a',
        color: '#fff',
        confirmButtonColor: '#198754'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = (jobId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this job opening!",
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
          await fetch(`https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/delete-job/${jobId}`, {
            method: 'DELETE'
          });
          setJobs(prevJobs => prevJobs.filter(j => (j.id !== jobId && j._id !== jobId)));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Job opening has been deleted.',
            background: '#16161a',
            color: '#fff',
            confirmButtonColor: '#198754',
            timer: 1500
          });
        } catch (error) {
          setJobs(prevJobs => prevJobs.filter(j => (j.id !== jobId && j._id !== jobId)));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Job opening has been removed.',
            background: '#16161a',
            color: '#fff',
            confirmButtonColor: '#198754',
            timer: 1500
          });
        }
      }
    });
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

  const handleDownloadResume = async (app) => {
    let resumeUrl = app.resumeUrl || app.resume || app.cv;

    if (!resumeUrl || resumeUrl === '#' || resumeUrl === 'string') {
      Swal.fire({
        icon: 'info',
        title: 'No Resume Available',
        text: 'This candidate has not uploaded a valid resume.',
        background: '#16161a',
        color: '#fff',
        confirmButtonColor: '#198754'
      });
      return;
    }

    if (resumeUrl.startsWith('/')) {
      resumeUrl = 'https://ecommerencesite.onrender.com' + resumeUrl;
    }

    let originalFileName = resumeUrl.substring(resumeUrl.lastIndexOf('/') + 1).split('?')[0];
    if (!originalFileName || originalFileName.length === 0) {
      const rawName = app.fullName || app.name || app.candidateName || 'Candidate';
      originalFileName = 'Resume_' + rawName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    }

    try {
      const response = await fetch(resumeUrl);
      const contentType = response.headers.get('content-type');
      
      if (!response.ok || (contentType && contentType.includes('text/html'))) {
        window.open(resumeUrl, '_blank');
        return;
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = originalFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(resumeUrl, '_blank');
    }
  };

  const handleViewDetails = (app) => {
    const candidateName = app.fullName || app.name || app.candidateName || 'N/A';
    const emailVal = app.email || app.candidateEmail || 'N/A';
    const phoneVal = app.phoneNo || app.phone || app.mobile || 'N/A';
    
    let jobTitleVal = app.jobTitle || app.jobName || app.title;
    if (!jobTitleVal && app.jobId) {
      const matchedJob = jobs.find(j => (j.id === app.jobId || j._id === app.jobId));
      if (matchedJob) {
        jobTitleVal = matchedJob.jobTitle || matchedJob.title;
      }
    }
    jobTitleVal = jobTitleVal || 'N/A';

    const currentCTCVal = app.currentCTC || app.ctc || 'N/A';
    const expectedCTCVal = app.expectedCTC || 'N/A';
    const noticePeriodVal = app.noticePeriod || 'N/A';
    
    let resumeLinkVal = app.resumeUrl || app.resume || app.cv || '#';
    if (resumeLinkVal.startsWith('/')) {
      resumeLinkVal = 'https://ecommerencesite.onrender.com' + resumeLinkVal;
    }

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
          <p><strong>Resume:</strong> 
            <a href="${resumeLinkVal !== '#' ? resumeLinkVal : '#'}" target="_blank" rel="noopener noreferrer" style="color: #198754; text-decoration: underline; margin-right: 12px;">View Resume PDF</a>
          </p>
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
      cancelButtonColor: '#d33',
      didOpen: () => {
        const selectElement = Swal.getPopup().querySelector('select');
        if (selectElement) {
          selectElement.style.backgroundColor = '#22222a';
          selectElement.style.color = '#fff';
          selectElement.style.padding = '8px';
          selectElement.style.borderRadius = '6px';
          selectElement.style.border = '1px solid #3d3d4d';
          
          const options = selectElement.querySelectorAll('option');
          options.forEach(opt => {
            opt.style.color = '#000';
            opt.style.backgroundColor = '#fff';
          });
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStatus = result.value;
        try {
          await fetch(
            `https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/update-application-status/${id}`, 
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newStatus)
            }
          );
        } catch (err) {}

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
      }
    });
  };

  const handleDeleteApplication = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this application record permanently!",
      icon: 'warning',
      background: '#16161a',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await fetch(`https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/delete-application/${id}`, {
          method: 'DELETE'
        });
      } catch (err) {}

      const updatedDeletedIds = [...deletedAppIds, id];
      setDeletedAppIds(updatedDeletedIds);
      try {
        localStorage.setItem('deletedAppIds', JSON.stringify(updatedDeletedIds));
      } catch (e) {}

      setApplications(prevApps => prevApps.filter(app => (app.id !== id && app._id !== id)));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Application has been removed permanently.',
        background: '#16161a',
        color: '#fff',
        confirmButtonColor: '#198754',
        timer: 1500
      });
    }
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

  const filteredJobs = jobs.filter(job => {
    const q = jobSearchQuery.toLowerCase();
    const title = (job.jobTitle || job.title || '').toLowerCase();
    const dept = (job.department || '').toLowerCase();
    const loc = (job.location || '').toLowerCase();
    const desc = (job.jobDescription || '').toLowerCase();
    return title.includes(q) || dept.includes(q) || loc.includes(q) || desc.includes(q);
  });

  const totalJobPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const indexOfLastJob = currentJobPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobsSlice = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalAppPages = Math.ceil(applications.length / itemsPerPage) || 1;
  const indexOfLastApp = currentAppPage * itemsPerPage;
  const indexOfFirstApp = indexOfLastApp - itemsPerPage;
  const currentAppsSlice = applications.slice(indexOfFirstApp, indexOfLastApp);

  return (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
        
        {/* SIDEBAR NAVIGATION */}
        <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
          <div className="brand mb-4 d-flex align-items-center">
            <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
            <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
          </div>
  
          <div className="mb-3 border-bottom border-secondary pb-3">
            <button 
              type="button"
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
                <Link to="/adminissuetype" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                  <i className="fas fa-plus-circle"></i> Add Item Type
                </Link>
                <Link to="/adminmasterassignedto" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                  <i className="fas fa-plus-circle"></i> AddAssignedTO 
                </Link>
                {/* <Link to="/doctorassignto" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                  <i className="fas fa-plus-circle"></i> AddDoctorAssignTo 
                </Link> */}
                <Link to="/addadmintypes" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                  <i className="fas fa-plus-circle"></i> AddAdminTypes 
                </Link>
                  <Link to="/languagematerpanels" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                                <i className="fas fa-language"></i> Language Master
                                            </Link>
                                                <Link to="/statenamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                                <i className="fas fa-language"></i> StateName Master
                                            </Link>  
                                              <Link to="/citynamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                                <i className="fas fa-language"></i>      CityName Master 
                                            </Link>

                                                 <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addaccountmastertypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Accountant Master Types             
                              </Link> 
 
              </div>
            )}
          </div>
  
          <ul className="nav flex-column">
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
            {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li> */}
            <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
            <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
            <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
            <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>
            <li><Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists</Link></li>
<li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
 <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>  
            <li className="mt-3">
              <button type="button" onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                <i className="fas fa-sign-out-alt"></i> LogOut
              </button>
            </li>
          </ul>
        </div>
 

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '24px', backgroundColor: '#121212', color: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
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
              <button 
                onClick={() => {
                  if(!isHiringActive) {
                    Swal.fire({ icon: 'warning', title: 'Hiring is OFF', text: 'Turn on Hiring status to add job details.', background: '#16161a', color: '#fff', confirmButtonColor: '#198754' });
                    return;
                  }
                  setShowCreateJobModal(true);
                }} 
                className="btn btn-success btn-sm px-3 fw-bold" 
                style={{ backgroundColor: '#198754', border: 'none', opacity: isHiringActive ? 1 : 0.6 }}
              >
                <i className="fas fa-plus-circle me-2"></i> + Add Job Details
              </button>

              <button onClick={handleAdminProfileClick} className="btn btn-outline-secondary btn-sm px-3 text-white border-secondary">
                <i className="fas fa-user-shield me-2"></i> Profile
              </button>
            </div>
          </header>

          {/* Jobs List Section */}
          <div style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Active Job Openings</h3>
              <div className="input-group" style={{ width: '300px' }}>
                <input 
                  type="text" 
                  className="form-control form-control-sm bg-dark text-white border-secondary" 
                  placeholder="Search jobs..."
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr style={{ color: '#8a8a98', fontSize: '12px', borderBottom: '1px solid #232329' }}>
                    <th>JOB TITLE</th>
                    <th>DEPARTMENT</th>
                    <th>LOCATION</th>
                    <th>OPENINGS</th>
                    <th>CTC</th>
                    <th className="text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJobsSlice.length > 0 ? (
                    currentJobsSlice.map((job) => {
                      const jobId = job.id || job._id;
                      return (
                        <tr key={jobId} style={{ borderBottom: '1px solid #232329' }}>
                          <td className="fw-bold">{job.jobTitle || job.title}</td>
                          <td>{job.department || 'N/A'}</td>
                          <td>{job.location || 'N/A'}</td>
                          <td>{job.noOfOpenings || job.openings || 1}</td>
                          <td>₹{job.offeredCTC || job.package || 'N/A'}</td>
                          <td className="text-end">
                            <button onClick={() => handleViewJobDetails(job)} className="btn btn-sm btn-outline-info me-2" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button onClick={() => handleOpenEditJob(job)} className="btn btn-sm btn-outline-warning me-2" title="Edit Job">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDeleteJob(jobId)} className="btn btn-sm btn-outline-danger" title="Delete Job">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No job openings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Jobs */}
            {totalJobPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span style={{ fontSize: '12px', color: '#8a8a98' }}>Page {currentJobPage} of {totalJobPages}</span>
                <div className="btn-group">
                  <button 
                    className="btn btn-sm btn-outline-secondary text-white" 
                    disabled={currentJobPage === 1}
                    onClick={() => setCurrentJobPage(p => p - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary text-white" 
                    disabled={currentJobPage === totalJobPages}
                    onClick={() => setCurrentJobPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Applications List Section */}
          <div style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Candidate Applications</h3>
              <span className="badge bg-success">{applications.length} Applications</span>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr style={{ color: '#8a8a98', fontSize: '12px', borderBottom: '1px solid #232329' }}>
                    <th>CANDIDATE NAME</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>STATUS</th>
                    <th className="text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppsSlice.length > 0 ? (
                    currentAppsSlice.map((app) => {
                      const appId = app.id || app._id;
                      const appStatus = app.status || app.applicationStatus || 'Applied';
                      return (
                        <tr key={appId} style={{ borderBottom: '1px solid #232329' }}>
                          <td className="fw-bold">{app.fullName || app.name || app.candidateName || 'N/A'}</td>
                          <td>{app.email || app.candidateEmail || 'N/A'}</td>
                          <td>{app.phoneNo || app.phone || app.mobile || 'N/A'}</td>
                          <td>
                            <span className="badge bg-warning text-dark" style={{ cursor: 'pointer' }} onClick={() => handleUpdateStatus(appId, appStatus)}>
                              {appStatus}
                            </span>
                          </td>
                          <td className="text-end">
                            <button onClick={() => handleViewDetails(app)} className="btn btn-sm btn-outline-info me-2" title="View Candidate Info">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button onClick={() => handleDownloadResume(app)} className="btn btn-sm btn-outline-success me-2" title="Download Resume">
                              <i className="fas fa-file-download"></i>
                            </button>
                            <button onClick={() => handleDeleteApplication(appId)} className="btn btn-sm btn-outline-danger" title="Delete Application">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No candidate applications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Applications */}
            {totalAppPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span style={{ fontSize: '12px', color: '#8a8a98' }}>Page {currentAppPage} of {totalAppPages}</span>
                <div className="btn-group">
                  <button 
                    className="btn btn-sm btn-outline-secondary text-white" 
                    disabled={currentAppPage === 1}
                    onClick={() => setCurrentAppPage(p => p - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary text-white" 
                    disabled={currentAppPage === totalAppPages}
                    onClick={() => setCurrentAppPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Create Job Opening</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateJobModal(false)}></button>
              </div>
              <form onSubmit={handleCreateJobSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="jobTitle" value={newJob.jobTitle} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="department" value={newJob.department} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience Required</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="experienceRequired" value={newJob.experienceRequired} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Offered CTC (₹)</label>
                    <input type="number" className="form-control bg-secondary text-white border-0" name="offeredCTC" value={newJob.offeredCTC} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="location" value={newJob.location} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Number of Openings</label>
                    <input type="number" className="form-control bg-secondary text-white border-0" name="noOfOpenings" value={newJob.noOfOpenings} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Closing Date</label>
                    <input type="date" className="form-control bg-secondary text-white border-0" name="closingDate" value={newJob.closingDate} onChange={handleInputChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Job Description</label>
                    <textarea className="form-control bg-secondary text-white border-0" rows="3" name="jobDescription" value={newJob.jobDescription} onChange={handleInputChange} required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCreateJobModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Edit Job Opening</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditJobModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateJobSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Job Title</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="jobTitle" value={editJobData.jobTitle} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="department" value={editJobData.department} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience Required</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="experienceRequired" value={editJobData.experienceRequired} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Offered CTC (₹)</label>
                    <input type="number" className="form-control bg-secondary text-white border-0" name="offeredCTC" value={editJobData.offeredCTC} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="location" value={editJobData.location} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Number of Openings</label>
                    <input type="number" className="form-control bg-secondary text-white border-0" name="noOfOpenings" value={editJobData.noOfOpenings} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Closing Date</label>
                    <input type="date" className="form-control bg-secondary text-white border-0" name="closingDate" value={editJobData.closingDate} onChange={handleEditInputChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Job Description</label>
                    <textarea className="form-control bg-secondary text-white border-0" rows="3" name="jobDescription" value={editJobData.jobDescription} onChange={handleEditInputChange} required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditJobModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}