import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyApplications({ user })
{
    const [myApps, setMyApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        if (user?.email)
        {
            fetchMyApplications();
        }
    }, [user]);

    const fetchMyApplications = async () =>
    {
        try
        {
            const res = await axios.get(`http://localhost:5000/api/applications/my-applications?email=${user.email}`);
            setMyApps(res.data);
        }
        catch (error)
        {
            console.error('Error fetching candidate applications:', error);
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <section style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
            <h2 style={{ marginBottom: '0.3rem', color: '#1e293b' }}>My Job Applications</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Tracking submissions associated with <strong>{user?.email}</strong>
            </p>

            {loading ? (
                <p>Loading application history...</p>
            ) : myApps.length === 0 ? (
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                    You have not applied to any job openings yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myApps.map((app) => (
                        <div key={app.Application_ID} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.3rem 0', color: '#0f172a' }}>{app.Job_Title}</h3>
                                    <span style={{ color: '#2563eb', fontWeight: '600' }}>{app.Company_Name}</span>
                                    <span style={{ color: '#64748b' }}> • {app.Location}</span>
                                </div>
                                <span style={{
                                    padding: '0.35rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    background: app.Status === 'Offered' ? '#dcfce7' : app.Status === 'Rejected' ? '#fee2e2' : app.Status === 'Interview Scheduled' ? '#fef9c3' : '#dbeafe',
                                    color: app.Status === 'Offered' ? '#15803d' : app.Status === 'Rejected' ? '#b91c1c' : app.Status === 'Interview Scheduled' ? '#a16207' : '#1d4ed8'
                                }}>
                                    {app.Status}
                                </span>
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                                <span>Applied on: {new Date(app.Applied_Date).toLocaleDateString()}</span>
                                <span>Application ID: #{app.Application_ID}</span>
                            </div>

                            {app.Status === 'Interview Scheduled' && app.Interview_Date && (
                                <div style={infoBoxStyle}>
                                    <strong>Interview Round:</strong> {new Date(app.Interview_Date).toLocaleString()} ({app.Interview_Mode})
                                    {app.Feedback && <div style={{ marginTop: '0.3rem' }}>Note: {app.Feedback}</div>}
                                </div>
                            )}

                            {app.Status === 'Offered' && app.Salary_Offered && (
                                <div style={{ ...infoBoxStyle, background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                                    <strong>Congratulations!</strong> Compensation: ₹{app.Salary_Offered} | Joining: {new Date(app.Joining_Date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

const cardStyle = {
    background: '#fff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '1.2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const infoBoxStyle = {
    marginTop: '0.8rem',
    padding: '0.6rem 0.8rem',
    background: '#fffbeb',
    border: '1px solid #fef3c7',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#92400e'
};