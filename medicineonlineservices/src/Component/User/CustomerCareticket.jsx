import React, { useState } from 'react';
import axios from 'axios';

export default function CustomerCareticket() {
    // 1. State Management for the Ticket Form
    const [ticket, setTicket] = useState({
        customerName: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    // 2. Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prev => ({ ...prev, [name]: value }));
    };

    // 3. Submit to .NET Web API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            // URL matches your Controller [Route("api/[controller]")]
            const response = await axios.post('http://localhost:5256/api/CustomerCareTicketAPI/chat', ticket);
            
            if (response.status === 200) {
                setStatus({ loading: false, success: true, error: null });
                setTicket({ customerName: '', email: '', message: '' }); // Clear form
            }
        } catch (err) {
            setStatus({ 
                loading: false, 
                success: false, 
                error: "Failed to submit ticket. Please check your connection." 
            });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-primary text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h4 className="mb-0"><i className="fa-solid fa-ticket-alt me-2"></i>Raise a Support Ticket</h4>
                        </div>
                        <div className="card-body p-4">
                            {status.success && (
                                <div className="alert alert-success border-0 shadow-sm">
                                    Your ticket has been submitted! We will contact you soon.
                                </div>
                            )}
                            {status.error && (
                                <div className="alert alert-danger border-0 shadow-sm">
                                    {status.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0" 
                                        name="customerName"
                                        placeholder="Enter your name"
                                        value={ticket.customerName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-light border-0" 
                                        name="email"
                                        placeholder="name@example.com"
                                        value={ticket.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Describe Your Issue</label>
                                    <textarea 
                                        className="form-control bg-light border-0" 
                                        name="message"
                                        rows="4" 
                                        placeholder="How can we help you?"
                                        value={ticket.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                                    disabled={status.loading}
                                >
                                    {status.loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                    ) : 'Submit Ticket'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


