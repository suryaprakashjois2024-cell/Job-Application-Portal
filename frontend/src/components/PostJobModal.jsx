import React, { useState } from 'react';
import axios from 'axios';

export default function PostJobModal({ onClose, onJobCreated })
{
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('Bengaluru');
    const [salaryRange, setSalaryRange] = useState('6 - 10 LPA');
    const [departmentId, setDepartmentId] = useState('1');
    const [recruiterId, setRecruiterId] = useState('1');
    const [jobDescription, setJobDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError('');

        try
        {
            await axios.post('http://localhost:5000/api/jobs', {
                jobTitle,
                location,
                salaryRange,
                departmentId: parseInt(departmentId, 10),
                recruiterId: parseInt(recruiterId, 10),
                jobDescription
            });
            onJobCreated();
            onClose();
        }
        catch (err)
        {
            setError(err.response?.data?.error || 'Failed to post job');
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Post a New Job Opening</h2>
                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '0.8rem' }}>
                        <label style={labelStyle}>Job Title *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Cloud Engineer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                        <div>
                            <label style={labelStyle}>Location *</label>
                            <input
                                type="text"
                                required
                                placeholder="Bengaluru, Hyderabad..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Salary Range</label>
                            <input
                                type="text"
                                placeholder="e.g. 8 - 14 LPA"
                                value={salaryRange}
                                onChange={(e) => setSalaryRange(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                        <div>
                            <label style={labelStyle}>Department</label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="1">Engineering (Infosys)</option>
                                <option value="2">Data Analytics (Infosys)</option>
                                <option value="3">Cloud Infrastructure (TCS)</option>
                                <option value="4">Security & Networking (Wipro)</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Recruiter Assigned</label>
                            <select
                                value={recruiterId}
                                onChange={(e) => setRecruiterId(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="1">Ananya Sharma (Infosys)</option>
                                <option value="2">Rajesh Kumar (TCS)</option>
                                <option value="3">Pooja Nair (Wipro)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>Job Description</label>
                        <textarea
                            rows="3"
                            placeholder="Role responsibilities and prerequisites..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            style={{ ...inputStyle, resize: 'vertical' }}
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
                        Publish Job
                    </button>
                </form>

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
    maxWidth: '520px',
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

const errorStyle = {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '0.6rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.85rem'
};