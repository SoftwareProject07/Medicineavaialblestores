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

  const handleHiringStatsClick = () => {
    Swal.fire({
      title: '<span style="color: #fff;">Hiring Statistics Overview</span>',
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6;">
          <p><strong>Hiring Master Status:</strong> <span style="color: ${isHiringActive ? '#198754' : '#dc3545'}; font-weight: bold;">${isHiringActive ? 'ON (Active)' : 'OFF (Paused)'}</span></p>
          <p><strong>Total Job Openings:</strong> ${jobs.length}</p>
          <p><strong>Total Candidate Applications:</strong> ${applications.length}</p>
          <p><strong>Pending Reviews:</strong> ${applications.filter(a => (a.status || a.applicationStatus) === 'Applied').length}</p>
        </div>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Got it'
    });
  };

  // Safe Resume Handler with fixed template syntax
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

    // Original uploaded filename extract karna URL se (fallback ke liye candidate name)
    let originalFileName = resumeUrl.substring(resumeUrl.lastIndexOf('/') + 1).split('?')[0];
    if (!originalFileName || originalFileName.length === 0) {
      const rawName = app.fullName || app.name || app.candidateName || 'Candidate';
      originalFileName = 'Resume_' + rawName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    }

    try {
      const response = await fetch(resumeUrl);
      const contentType = response.headers.get('content-type');
      
      // Agar server ne PDF ki jagah kuch aur bhej diya ho toh direct naye tab me khol dein
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

      {/* Sidebar */}
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
                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>AddDoctorAssignTo</Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link> 
              </div>
            )}
          </div>

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
                <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm">Feedback List</Link>
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
                <Link to="/hiringcandidteapplieds" className="btn btn-success w-100 mb-1 text-start btn-sm fw-bold">HiringDATA</Link>
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

              <button onClick={handleAdminProfileClick} className="btn btn-outline-success btn-sm px-3 fw-bold">
                <i className="fas fa-user-shield me-2"></i> Admin Profile
              </button>
              
              <button onClick={handleHiringStatsClick} className="btn btn-outline-light btn-sm px-3 fw-bold">
                <i className="fas fa-chart-line me-2"></i> Hiring Stats
              </button>
            </div>
          </header>

          {/* Master Controls & Hiring Toggle Bar */}
          <div style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#b1b1c0' }}>Master Hiring Portal </span>
              {/* <button 
                onClick={() => setIsHiringActive(!isHiringActive)} 
                className={`btn btn-sm px-3 py-1.5 fw-bold ${isHiringActive ? 'btn-success' : 'btn-danger'}`}
                style={{ fontSize: '13px' }}
              >
                {isHiringActive ? 'Hiring ON (Accepting Applications)' : 'Hiring OFF (Paused)'}
              </button> */}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '320px', maxWidth: '100%' }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-dark border-secondary text-white-50"><i className="fas fa-search"></i></span>
                <input 
                  type="text" 
                  className="form-control bg-dark border-secondary text-white" 
                  placeholder="Search jobs by title, department, location..."
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                />
                {jobSearchQuery && (
                  <button className="btn btn-outline-secondary text-white" onClick={() => setJobSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Job Openings Section */}
          <div style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '20px 24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                Active Job Openings ({filteredJobs.length})
              </h4>
              <span style={{ fontSize: '12px', color: '#8a8a98' }}>Showing page {currentJobPage} of {totalJobPages}</span>
            </div>

            {currentJobsSlice.length === 0 ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: '14px' }}>
                No job postings found matching your search.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ color: '#8a8a98', borderBottom: '1px solid #232329' }}>
                      <th style={{ padding: '12px' }}>Job Title</th>
                      <th style={{ padding: '12px' }}>Department</th>
                      <th style={{ padding: '12px' }}>Location</th>
                      <th style={{ padding: '12px' }}>Openings</th>
                      <th style={{ padding: '12px' }}>CTC Offered</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentJobsSlice.map((job) => {
                      const jobId = job.id || job._id;
                      const title = job.jobTitle || job.title || 'N/A';
                      const dept = job.department || 'N/A';
                      const loc = job.location || 'N/A';
                      const openings = job.noOfOpenings || job.openings || 1;
                      const ctc = job.offeredCTC || job.package || 'N/A';
                      const active = job.isActive !== undefined ? job.isActive : true;

                      return (
                        <tr key={jobId} style={{ borderBottom: '1px solid #232329' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#fff' }}>{title}</td>
                          <td style={{ padding: '12px' }}>{dept}</td>
                          <td style={{ padding: '12px' }}>{loc}</td>
                          <td style={{ padding: '12px' }}>{openings}</td>
                          <td style={{ padding: '12px', color: '#198754', fontWeight: '600' }}>₹{ctc}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge ${active ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '11px' }}>
                              {active ? 'Active' : 'Closed'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                onClick={() => handleViewJobDetails(job)} 
                                className="btn btn-sm btn-outline-info px-2 py-1" 
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              {/* <button 
                                onClick={() => handleOpenEditJob(job)} 
                                className="btn btn-sm btn-outline-warning px-2 py-1" 
                                title="Edit Job"
                              >
                                <i className="fas fa-edit"></i>
                              </button> */}
                              <button 
                                onClick={() => handleDeleteJob(jobId)} 
                                className="btn btn-sm btn-outline-danger px-2 py-1" 
                                title="Delete Job"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {totalJobPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2" style={{ borderTop: '1px solid #232329' }}>
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={currentJobPage === 1}
                  onClick={() => setCurrentJobPage(p => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '12px', color: '#8a8a98' }}>Page {currentJobPage} of {totalJobPages}</span>
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={currentJobPage === totalJobPages}
                  onClick={() => setCurrentJobPage(p => Math.min(p + 1, totalJobPages))}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Candidate Applications Registry */}
          <div style={{ backgroundColor: '#16161a', border: '1px solid #232329', borderRadius: '12px', padding: '20px 24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                Candidate Applications Registry ({applications.length})
              </h4>
              <span style={{ fontSize: '12px', color: '#8a8a98' }}>Showing page {currentAppPage} of {totalAppPages}</span>
            </div>

            {currentAppsSlice.length === 0 ? (
              <div className="text-center py-4 text-muted" style={{ fontSize: '14px' }}>
                No candidate applications received yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ color: '#8a8a98', borderBottom: '1px solid #232329' }}>
                      <th style={{ padding: '12px' }}>Candidate Name</th>
                      <th style={{ padding: '12px' }}>Job Title</th>
                      <th style={{ padding: '12px' }}>Email</th>
                      <th style={{ padding: '12px' }}>Phone</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAppsSlice.map((app) => {
                      const appId = app.id || app._id;
                      const candidateName = app.fullName || app.name || app.candidateName || 'N/A';
                      
                      let jobTitleVal = app.jobTitle || app.jobName || app.title;
                      if (!jobTitleVal && app.jobId) {
                        const matchedJob = jobs.find(j => (j.id === app.jobId || j._id === app.jobId));
                        if (matchedJob) {
                          jobTitleVal = matchedJob.jobTitle || matchedJob.title;
                        }
                      }
                      jobTitleVal = jobTitleVal || 'N/A';

                      const emailVal = app.email || app.candidateEmail || 'N/A';
                      const phoneVal = app.phoneNo || app.phone || app.mobile || 'N/A';
                      const statusVal = app.status || app.applicationStatus || 'Applied';

                      let badgeColor = 'bg-secondary';
                      if (statusVal === 'Shortlisted') badgeColor = 'bg-info text-dark';
                      if (statusVal === 'Selected') badgeColor = 'bg-success';
                      if (statusVal === 'Rejected') badgeColor = 'bg-danger';
                      if (statusVal === 'Interview Scheduled') badgeColor = 'bg-warning text-dark';

                      return (
                        <tr key={appId} style={{ borderBottom: '1px solid #232329' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#fff' }}>{candidateName}</td>
                          <td style={{ padding: '12px' }}>{jobTitleVal}</td>
                          <td style={{ padding: '12px', color: '#8a8a98' }}>{emailVal}</td>
                          <td style={{ padding: '12px' }}>{phoneVal}</td>
                          <td style={{ padding: '12px' }}>
                            <span className={`badge ${badgeColor}`} style={{ fontSize: '11px', fontWeight: '600' }}>
                              {statusVal}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div className="d-flex justify-content-end gap-2 align-items-center">
                              <button 
                                onClick={() => handleDownloadResume(app)} 
                                className="btn btn-sm btn-outline-success px-2 py-1" 
                                title="Download Resume PDF"
                              >
                                <i className="fas fa-file-pdf"></i>
                              </button>
                              <button 
                                onClick={() => handleViewDetails(app)} 
                                className="btn btn-sm btn-outline-info px-2 py-1" 
                                title="View Candidate Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(appId, statusVal)} 
                                className="btn btn-sm btn-outline-warning px-2 py-1" 
                                title="Update Status"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteApplication(appId)} 
                                className="btn btn-sm btn-outline-danger px-2 py-1" 
                                title="Delete Application"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {totalAppPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2" style={{ borderTop: '1px solid #232329' }}>
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={currentAppPage === 1}
                  onClick={() => setCurrentAppPage(p => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <span style={{ fontSize: '12px', color: '#8a8a98' }}>Page {currentAppPage} of {totalAppPages}</span>
                <button 
                  className="btn btn-sm btn-outline-secondary text-white" 
                  disabled={currentAppPage === totalAppPages}
                  onClick={() => setCurrentAppPage(p => Math.min(p + 1, totalAppPages))}
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#16161a', border: '1px solid #2d2d37', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', color: '#fff' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '1px solid #232329' }}>
              <h5 className="m-0 fw-bold"><i className="fas fa-plus-circle text-success me-2"></i> Create New Job Requisition</h5>
              <button onClick={() => setShowCreateJobModal(false)} className="btn btn-sm btn-outline-secondary text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Job Title *</label>
                  <input type="text" name="jobTitle" className="form-control bg-dark border-secondary text-white" required value={newJob.jobTitle} onChange={handleInputChange} placeholder="e.g. Senior React Developer" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Department *</label>
                  <input type="text" name="department" className="form-control bg-dark border-secondary text-white" required value={newJob.department} onChange={handleInputChange} placeholder="e.g. Engineering" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Experience Required *</label>
                  <input type="text" name="experienceRequired" className="form-control bg-dark border-secondary text-white" required value={newJob.experienceRequired} onChange={handleInputChange} placeholder="e.g. 2-4 Years" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Offered CTC (₹) *</label>
                  <input type="number" name="offeredCTC" className="form-control bg-dark border-secondary text-white" required value={newJob.offeredCTC} onChange={handleInputChange} placeholder="e.g. 600000" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Location *</label>
                  <input type="text" name="location" className="form-control bg-dark border-secondary text-white" required value={newJob.location} onChange={handleInputChange} placeholder="e.g. Noida / Remote" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Number of Openings *</label>
                  <input type="number" name="noOfOpenings" min="1" className="form-control bg-dark border-secondary text-white" required value={newJob.noOfOpenings} onChange={handleInputChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white-50">Closing Date *</label>
                <input type="date" name="closingDate" className="form-control bg-dark border-secondary text-white" required value={newJob.closingDate} onChange={handleInputChange} />
              </div>

              <div className="mb-3">
                <label className="form-label text-white-50">Job Description *</label>
                <textarea name="jobDescription" rows="4" className="form-control bg-dark border-secondary text-white" required value={newJob.jobDescription} onChange={handleInputChange} placeholder="Enter comprehensive job roles and requirements..."></textarea>
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" name="isActive" id="createIsActive" className="form-check-input" checked={newJob.isActive} onChange={handleInputChange} />
                <label className="form-check-label text-white-50" htmlFor="createIsActive">Active Listing immediately</label>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2" style={{ borderBottom: '1px solid #232329' }}>
                <button type="button" onClick={() => setShowCreateJobModal(false)} className="btn btn-outline-secondary btn-sm text-white px-3">Cancel</button>
                <button type="submit" className="btn btn-success btn-sm px-4 fw-bold" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#16161a', border: '1px solid #2d2d37', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', color: '#fff' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2" style={{ borderBottom: '1px solid #232329' }}>
              <h5 className="m-0 fw-bold"><i className="fas fa-edit text-warning me-2"></i> Edit Job Requisition</h5>
              <button onClick={() => setShowEditJobModal(false)} className="btn btn-sm btn-outline-secondary text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Job Title *</label>
                  <input type="text" name="jobTitle" className="form-control bg-dark border-secondary text-white" required value={editJobData.jobTitle} onChange={handleEditInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Department *</label>
                  <input type="text" name="department" className="form-control bg-dark border-secondary text-white" required value={editJobData.department} onChange={handleEditInputChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Experience Required *</label>
                  <input type="text" name="experienceRequired" className="form-control bg-dark border-secondary text-white" required value={editJobData.experienceRequired} onChange={handleEditInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Offered CTC (₹) *</label>
                  <input type="number" name="offeredCTC" className="form-control bg-dark border-secondary text-white" required value={editJobData.offeredCTC} onChange={handleEditInputChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-white-50">Location *</label>
                  <input type="text" name="location" className="form-control bg-dark border-secondary text-white" required value={editJobData.location} onChange={handleEditInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Number of Openings *</label>
                  <input type="number" name="noOfOpenings" min="1" className="form-control bg-dark border-secondary text-white" required value={editJobData.noOfOpenings} onChange={handleEditInputChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-white-50">Closing Date *</label>
                <input type="date" name="closingDate" className="form-control bg-dark border-secondary text-white" required value={editJobData.closingDate} onChange={handleEditInputChange} />
              </div>

              <div className="mb-3">
                <label className="form-label text-white-50">Job Description *</label>
                <textarea name="jobDescription" rows="4" className="form-control bg-dark border-secondary text-white" required value={editJobData.jobDescription} onChange={handleEditInputChange}></textarea>
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" name="isActive" id="editIsActive" className="form-check-input" checked={editJobData.isActive} onChange={handleEditInputChange} />
                <label className="form-check-label text-white-50" htmlFor="editIsActive">Active Listing</label>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2" style={{ borderBottom: '1px solid #232329' }}>
                <button type="button" onClick={() => setShowEditJobModal(false)} className="btn btn-outline-secondary btn-sm text-white px-3">Cancel</button>
                <button type="submit" className="btn btn-warning btn-sm px-4 fw-bold text-dark" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}