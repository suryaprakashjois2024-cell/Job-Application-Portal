import React, { useState } from 'react';
import axios from 'axios';

export default function ApplyModal({ job, onClose })
{
    const [applicantName, setApplicantName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [resumeLink, setResumeLink] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError('');
        try
        {
            await axios.post('http://localhost:5000/api/applications', {
                jobId: job.Job_ID,
                applicantName,
                email,
                phone,
                resumeLink: resumeLink || null
            });
            setSuccess(true);
            setTimeout(() =>
            {
                onClose();
            }, 1500);
        }
        catch (err)
        {
            setError(err.response?.data?.error || 'Failed to submit application');
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Apply for {job?.Job_Title}</h2>
                <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>{job?.Company_Name} — {job?.Location}</p>

                {success ? (
                    <div style={{ color: '#16a34a', fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}>
                        Application submitted successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginBottom: '0.8rem' }}>
                            <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                required
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                style={inputStyle}
                                placeholder="e.g. Suryaprakash"
                            />
                        </div>

                        <div style={{ marginBottom: '0.8rem' }}>
                            <label style={labelStyle}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                placeholder="e.g. name@example.com"
                            />
                        </div>

                        <div style={{ marginBottom: '0.8rem' }}>
                            <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={inputStyle}
                                placeholder="e.g. 9876543210"
                            />
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={labelStyle}>Resume / Portfolio Link <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>(Optional)</span></label>
                            <input
                                type="url"
                                value={resumeLink}
                                onChange={(e) => setResumeLink(e.target.value)}
                                style={inputStyle}
                                placeholder="https://..."
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Submit Application
                        </button>
                    </form>
                )}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: '0.8rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '0.85rem'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalStyle = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.3rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569'
};

const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
};