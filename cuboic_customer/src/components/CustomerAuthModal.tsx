import React, { useState } from 'react';
import { customersApi, type Customer } from '../api/customers';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (customer: Customer) => void;
}

export function CustomerAuthModal({ open, onClose, onSuccess }: Props) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (phone.length < 5) return setError('Invalid phone number');
        setLoading(true);
        try {
            await customersApi.sendOtp(phone);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.length < 4) return setError('Invalid OTP');
        setLoading(true);
        try {
            const data = await customersApi.verifyOtp(phone, otp);
            if (data.customer) {
                onSuccess(data.customer);
            } else {
                setStep(3);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) return setError('Name is required');
        setLoading(true);
        try {
            const customer = await customersApi.register(phone, name);
            onSuccess(customer);
        } catch (err: any) {
            setError('Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100000 }}>
            <div className="modal-content fade-up" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Welcome to Cuboic</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                
                <div className="modal-body">
                    {error && <div className="co-error" style={{marginBottom: 16, color: '#ef4444', backgroundColor: '#fef2f2', padding: 8, borderRadius: 8}}>{error}</div>}
                    
                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <p style={{marginBottom: 16, color: 'var(--text-muted)'}}>Enter your phone number to proceed with your order.</p>
                            <input
                                autoFocus
                                type="tel"
                                placeholder="Phone number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="checkout-notes-input"
                                disabled={loading}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 16}} disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <p style={{marginBottom: 16, color: 'var(--text-muted)'}}>Enter the OTP sent to {phone}.</p>
                            <input
                                autoFocus
                                type="text"
                                placeholder="4-digit OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                className="checkout-notes-input"
                                disabled={loading}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 16}} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleRegister}>
                            <p style={{marginBottom: 16, color: 'var(--text-muted)'}}>Welcome! What's your name?</p>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="checkout-notes-input"
                                disabled={loading}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 16}} disabled={loading}>
                                {loading ? 'Saving...' : 'Continue to Order'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
