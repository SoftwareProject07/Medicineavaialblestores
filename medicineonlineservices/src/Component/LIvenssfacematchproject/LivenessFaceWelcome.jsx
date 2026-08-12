// import React from 'react';
// import LivenessFaceCapture from './LivenessFaceCapture';

// export default function LivenessFaceWelcome({ onVerified }) {
//     return (
//         <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
//             <div className="card border-0 shadow-lg p-4 text-center" style={{ maxWidth: '450px', backgroundColor: '#1e1e1e' }}>
//                 <h1 className="fw-bold text-primary">AKMedizostore</h1>
//                 <h5 className="text-danger mb-4">Security Check Required</h5>
                
//                 <p className="small text-secondary mb-4">
//                     Please blink your eyes naturally to verify your identity.
//                 </p>

//                 <LivenessFaceCapture onSuccess={onVerified} />

//                 <div className="mt-4 border-top border-secondary pt-3">
//                     <small className="text-muted"><i className="bi bi-shield-lock"></i> Secure AI Check</small>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from "react";
import LivenessFaceCapture from "./LivenessFaceCapture";

export default function LivenessFaceWelcome() {

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark">

            <div
                className="card shadow-lg p-4 text-center"
                style={{
                    width: "420px",
                    background: "#1e1e1e",
                    color: "#fff"
                }}
            >

                <h2 className="text-primary fw-bold">
                    AKMedizostore
                </h2>

                <h5 className="text-danger">
                    Security Check Required
                </h5>

                <p className="text-secondary">
                    Please blink your eyes naturally to verify your identity.
                </p>

                <LivenessFaceCapture />

                <hr />

                <small className="text-secondary">
                    Secure AI Check
                </small>

            </div>

        </div>
    );
}