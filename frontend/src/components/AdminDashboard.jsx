import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostJobModal from './PostJobModal';

export default function AdminDashboard({ onJobCreated })
{
    const [applications, setApplications] = useState([]);
    const [showPostJobModal, setShowPostJobModal] = useState(false);

    const [selectedAppId, setSelectedAppId] = useState(null);
    const [workflowType, setWorkflowType] = useState(null);

    const [interviewDate, setInterviewDate] = useState('');
    const [interviewMode, setInterviewMode] = useState('Online');
    const [feedback, setFeedback] = useState('');

    const [salaryOffered, setSalaryOffered] = useState('');
    const [joiningDate, setJoiningDate] = useState('');

    useEffect(() =>
    {
        fetchApplications();
    }, []);

    const fetchApplications = async () =>
    {
        try
        {
            const res = await axios.get('http://localhost:5000/api/applications');
            setApplications(res.data);
        }
        catch (error)
        {
            console.error('Error fetching applications:', error);
        }
    };

    const handleStatusSelect = (appId, newStatus) =>
    {
        if (newStatus === 'Interview Scheduled')
        {
            setSelectedAppId(appId);
            setWorkflowType('Interview');
        }
        else if (newStatus === 'Offered')
        {
            setSelectedAppId(appId);
            setWorkflowType('Offer');
        }
        else
        {
            submitStatusChange(appId, newStatus);
        }
    };

    const submitStatusChange = async (appId, status, extra = {}) =>
    {
        try
        {
            await axios.put(`http://localhost:5000/api/applications/${appId}/status`, {
                status,
                ...extra
            });
            fetchApplications();
            closeWorkflowModal();
        }
        catch (error)
        {
            console.error('Error updating status:', error);
        }
    };

    const closeWorkflowModal = () =>
    {
        setSelectedAppId(null);
        setWorkflowType(null);
        setInterviewDate('');
        setFeedback('');
        setSalaryOffered('');
        setJoiningDate('');
    };

    return (
        <section style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: '#1e293b' }}>Recruiter & Administrator Dashboard</h2>
                <button
                    onClick={() => setShowPostJobModal(true)}
                    style={{
                        padding: '0.6rem 1.2rem',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    + Post New Job
                </button>
            </div>

            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Applicant</th>
                            <th style={thStyle}>Contact</th>
                            <th style={thStyle}>Job Title</th>
                            <th style={thStyle}>Company</th>
                            <th style={thStyle}>Applied Date</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                                    No applications submitted yet.
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.Application_ID} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}>#{app.Application_ID}</td>
                                    <td style={tdStyle}><strong>{app.Applicant_Name}</strong></td>
                                    <td style={tdStyle}>
                                        <div>{app.Email}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.Phone}</div>
                                    </td>
                                    <td style={tdStyle}>{app.Job_Title}</td>
                                    <td style={tdStyle}>{app.Company_Name}</td>
                                    <td style={tdStyle}>{new Date(app.Applied_Date).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            fontWeight: 'bold',
                                            color: app.Status === 'Offered' ? '#16a34a' : app.Status === 'Rejected' ? '#dc2626' : app.Status === 'Interview Scheduled' ? '#d97706' : '#2563eb'
                                        }}>
                                            {app.Status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <select
                                            value={app.Status}
                                            onChange={(e) => handleStatusSelect(app.Application_ID, e.target.value)}
                                            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Interview Scheduled">Interview Scheduled</option>
                                            <option value="Offered">Offered</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showPostJobModal && (
                <PostJobModal
                    onClose={() => setShowPostJobModal(false)}
                    onJobCreated={() =>
                    {
                        if (onJobCreated) onJobCreated();
                        fetchApplications();
                    }}
                />
            )}

            {workflowType === 'Interview' && (
                <div style={dialogOverlayStyle}>
                    <div style={dialogBoxStyle}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Schedule Interview (Application #{selectedAppId})</h3>
                        <label style={dialogLabelStyle}>Interview Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                            style={dialogInputStyle}
                        />

                        <label style={dialogLabelStyle}>Mode</label>
                        <select
                            value={interviewMode}
                            onChange={(e) => setInterviewMode(e.target.value)}
                            style={dialogInputStyle}
                        >
                            <option value="Online">Online</option>
                            <option value="In-Person">In-Person</option>
                        </select>

                        <label style={dialogLabelStyle}>Feedback / Meeting Link</label>
                        <input
                            type="text"
                            placeholder="e.g. Google Meet link or room 302"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            style={dialogInputStyle}
                        />

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => submitStatusChange(selectedAppId, 'Interview Scheduled', {
                                    interviewDetails: { interviewDate, mode: interviewMode, feedback }
                                })}
                                style={confirmBtnStyle}
                            >
                                Confirm Schedule
                            </button>
                            <button onClick={closeWorkflowModal} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {workflowType === 'Offer' && (
                <div style={dialogOverlayStyle}>
                    <div style={dialogBoxStyle}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Issue Job Offer (Application #{selectedAppId})</h3>
                        <label style={dialogLabelStyle}>Salary Offered (₹ Annual) *</label>
                        <input
                            type="number"
                            placeholder="e.g. 850000"
                            value={salaryOffered}
                            onChange={(e) => setSalaryOffered(e.target.value)}
                            style={dialogInputStyle}
                        />

                        <label style={dialogLabelStyle}>Joining Date *</label>
                        <input
                            type="date"
                            value={joiningDate}
                            onChange={(e) => setJoiningDate(e.target.value)}
                            style={dialogInputStyle}
                        />

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => submitStatusChange(selectedAppId, 'Offered', {
                                    offerDetails: { salaryOffered, joiningDate }
                                })}
                                style={confirmBtnStyle}
                            >
                                Generate Offer
                            </button>
                            <button onClick={closeWorkflowModal} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

const thStyle = {
    padding: '0.8rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#475569'
};

const tdStyle = {
    padding: '0.8rem 1rem',
    fontSize: '0.9rem',
    color: '#334155'
};

const dialogOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100
};

const dialogBoxStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px'
};

const dialogLabelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginTop: '0.6rem',
    marginBottom: '0.2rem',
    color: '#475569'
};

const dialogInputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box'
};

const confirmBtnStyle = {
    flex: 1,
    padding: '0.6rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const cancelBtnStyle = {
    padding: '0.6rem 1rem',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
};