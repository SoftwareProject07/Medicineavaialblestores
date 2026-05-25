import React from 'react';
import LivenessFaceCapture from './LivenessFaceCapture';

export default function LivenessFaceWelcome({ onVerified }) {
    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
            <div className="card border-0 shadow-lg p-4 text-center" style={{ maxWidth: '450px', backgroundColor: '#1e1e1e' }}>
                <h1 className="fw-bold text-primary">AKMedizostore</h1>
                <h5 className="text-danger mb-4">Security Check Required</h5>
                
                <p className="small text-secondary mb-4">
                    Please blink your eyes naturally to verify your identity.
                </p>

                <LivenessFaceCapture onSuccess={onVerified} />

                <div className="mt-4 border-top border-secondary pt-3">
                    <small className="text-muted"><i className="bi bi-shield-lock"></i> Secure AI Check</small>
                </div>
            </div>
        </div>
    );
}