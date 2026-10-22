// import React, { Component, useState, useEffect } from 'react';
// import ErrorPage from './ErrorPage';

// // 1. React Error Boundary Class for runtime/app crashes
// class ClassErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("App Crash Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <ErrorPage isOffline={false} onRetry={() => window.location.reload()} />;
//     }
//     return this.props.children;
//   }
// }

// // 2. Main Wrapper Component to handle Online/Offline and Crashes
// export default function GlobalErrorProvider({ children }) {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Agar internet disconnected hai to offline error page dikhao
//   if (!isOnline) {
//     return <ErrorPage isOffline={true} onRetry={() => window.location.reload()} />;
//   }

//   // Agar internet on hai to Error Boundary ke andar children render karo
//   return <ClassErrorBoundary>{children}</ClassErrorBoundary>;
// }


//2/
// import React, { Component, useState, useEffect } from 'react';
// import ErrorPage from './ErrorPage';

// // 1. React Error Boundary Class for runtime/app crashes
// class ClassErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("App Crash Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <ErrorPage isOffline={false} onRetry={() => window.location.reload()} />;
//     }
//     return this.props.children;
//   }
// }

// // 2. Main Wrapper Component to handle Online/Offline, License & Crashes
// export default function GlobalErrorProvider({ children }) {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isAllowed, setIsAllowed] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Online/Offline status listeners
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     // Remote License / Kill-Switch Check
//     // (Yahan apna actual GitHub raw URL ya .NET backend ka URL dalein)
//     fetch('YOUR_API_OR_GITHUB_RAW_URL_HERE')
//       .then((res) => res.json())
//       .then((data) => {
//         setIsAllowed(data.isAllowed); // true ya false milega
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("License check failed", err);
//         setLoading(false); // Agar fetch fail ho toh app chalne dein ya block karein
//       });

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Jab tak remote license check ho raha hai, loading dikhayein
//   if (loading) {
//     return (
//       <div style={{ background: '#202124', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
//         Loading software...
//       </div>
//     );
//   }

//   // Agar internet disconnected hai to offline error page dikhao
//   if (!isOnline) {
//     return <ErrorPage isOffline={true} onRetry={() => window.location.reload()} />;
//   }

//   // Agar aapne remote file ya backend se 'isAllowed' ko false kar diya, toh software band ho jayega
//   if (!isAllowed) {
//     return (
//       <div style={{ backgroundColor: '#202124', color: '#e8eaed', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
//         <h2>Software License Expired or Suspended</h2>
//         <p style={{ color: '#9aa0a6', marginTop: '10px' }}>Please contact the developer/admin to renew your access.</p>
//       </div>
//     );
//   }

//   // Sab kuch theek hai toh Error Boundary ke andar children render karo
//   return <ClassErrorBoundary>{children}</ClassErrorBoundary>;
// }



//3///
// import React, { Component, useState, useEffect } from 'react';
// import ErrorPage from './ErrorPage';

// // 1. React Error Boundary Class for runtime/app crashes
// class ClassErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("App Crash Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <ErrorPage isOffline={false} onRetry={() => window.location.reload()} />;
//     }
//     return this.props.children;
//   }
// }

// // 2. Main Wrapper Component to handle Online/Offline, License & Crashes
// export default function GlobalErrorProvider({ children }) {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isAllowed, setIsAllowed] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Online/Offline status listeners
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     // Remote License / Kill-Switch Check (Aapka actual API URL yahan lag gaya hai)
//     // fetch('https://ecommerencesite.onrender.com/api/License/ValidateClientLicenseS?clientId=0')
//     //   .then((res) => res.json())
//     //   .then((data) => {
//     //     setIsAllowed(data.isAllowed); // Server se true ya false milega
//     //     setLoading(false);
//     //   })
//     //   .catch((err) => {
//     //     console.error("License check failed", err);
//     //     // Agar server down ho ya fetch fail ho aur aap app block karna chahte hain, toh yahan 'setIsAllowed(false)' kar sakte hain
//     //     setLoading(false);
//     //   });



//     const clientId = localStorage.getItem('clientId') || '1'; // Agar na mile toh default 1 rahega

// fetch(`https://ecommerencesite.onrender.com/api/License/ValidateClientLicenseS?clientId=${clientId}`)
//   .then((res) => res.json())
//   .then((data) => {
//     setIsAllowed(data.isAllowed);
//     setLoading(false);
//   })
//   .catch((err) => {
//     console.error("License check failed", err);
//     setLoading(false);
//   });
//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Jab tak remote license check ho raha hai, loading dikhayein
//   if (loading) {
//     return (
//       <div style={{ background: '#202124', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
//         Loading software...
//       </div>
//     );
//   }

//   // Agar internet disconnected hai to offline error page dikhao
//   if (!isOnline) {
//     return <ErrorPage isOffline={true} onRetry={() => window.location.reload()} />;
//   }

//   // Agar server se 'isAllowed' ki value false aayi, toh software turant lock ho jayega
//   if (!isAllowed) {
//     return (
//       <div style={{ backgroundColor: '#202124', color: '#e8eaed', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
//         <h2>Software License Expired or Suspended</h2>
//         <p style={{ color: '#9aa0a6', marginTop: '10px' }}>Please contact the developer/admin to renew your access.</p>
//       </div>
//     );
//   }

//   // Sab kuch theek hai toh Error Boundary ke andar children render karo
//   return <ClassErrorBoundary>{children}</ClassErrorBoundary>;
// }



//3///
// import React, { Component, useState, useEffect } from 'react';
// import ErrorPage from './ErrorPage'; // Ensure karein ErrorPage.jsx isi folder me ho

// // 1. React Error Boundary Class for runtime/app crashes
// class ClassErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("App Crash Error:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <ErrorPage isOffline={false} onRetry={() => window.location.reload()} />;
//     }
//     return this.props.children;
//   }
// }

// // 2. Main Wrapper Component to handle Online/Offline, License & Crashes
// export default function GlobalErrorProvider({ children }) {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [isAllowed, setIsAllowed] = useState(true);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Online/Offline status listeners
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     const clientId = localStorage.getItem('clientId') || '1'; // Agar na mile toh default 1 rahega

//     fetch(`https://ecommerencesite.onrender.com/api/License/ValidateClientLicenseS?clientId=${clientId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setIsAllowed(data.isAllowed);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("License check failed", err);
//         setLoading(false);
//       });

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Jab tak remote license check ho raha hai, loading dikhayein
//   if (loading) {
//     return (
//       <div style={{ background: '#202124', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
//         Loading software...
//       </div>
//     );
//   }

//   // Agar internet disconnected hai to offline error page dikhao
//   if (!isOnline) {
//     return <ErrorPage isOffline={true} onRetry={() => window.location.reload()} />;
//   }

//   // Agar server se 'isAllowed' ki value false aayi, toh software turant lock ho jayega
//   if (!isAllowed) {
//     return (
//       <div style={{ backgroundColor: '#202124', color: '#e8eaed', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
//         <h2>Software License Expired or Suspended</h2>
//         <p style={{ color: '#9aa0a6', marginTop: '10px' }}>Please contact the developer/admin to renew your access.</p>
//       </div>
//     );
//   }

//   // Sab kuch theek hai toh Error Boundary ke andar children render karo
//   return <ClassErrorBoundary>{children}</ClassErrorBoundary>;
// }



//4.

import React, { Component, useState, useEffect } from 'react';
import ErrorPage from './ErrorPageFOlDER/ErrorPage';

class ClassErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage isOffline={false} onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

export default function GlobalErrorProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAllowed, setIsAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const clientId = localStorage.getItem('clientId') || '1';

    fetch(`https://ecommerencesite.onrender.com/api/License/ValidateClientLicenseS?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setIsAllowed(data.isAllowed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("License check failed", err);
        setLoading(false);
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#202124', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        Loading software...
      </div>
    );
  }

  if (!isOnline) {
    return <ErrorPage isOffline={true} onRetry={() => window.location.reload()} />;
  }

  if (!isAllowed) {
    return (
      <div style={{ backgroundColor: '#202124', color: '#e8eaed', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
        <h2>Software License Expired or Suspended</h2>
        <p style={{ color: '#9aa0a6', marginTop: '10px' }}>Please contact the developer/admin to renew your access.</p>
      </div>
    );
  }

  return <ClassErrorBoundary>{children}</ClassErrorBoundary>;
}