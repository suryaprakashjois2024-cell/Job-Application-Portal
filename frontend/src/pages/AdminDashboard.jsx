import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard()
{
    const [applications, setApplications] = useState([]);

    const fetchApplications = () =>
    {
        axios.get('http://localhost:5000/api/applications')
            .then(res => setApplications(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() =>
    {
        fetchApplications();
    }, []);

    const handleStatusChange = async (id, newStatus) =>
    {
        try
        {
            await axios.patch(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus });
            fetchApplications();
        }
        catch (err)
        {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Recruiter & Administrator Dashboard</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Applicant</th>
                        <th>Contact</th>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app.Application_ID}>
                            <td>#{app.Application_ID}</td>
                            <td>{app.Applicant_Name}</td>
                            <td>
                                <div>{app.Email}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.Phone}</div>
                            </td>
                            <td>{app.Job_Title}</td>
                            <td>{app.Company_Name}</td>
                            <td>{new Date(app.Applied_Date).toLocaleDateString()}</td>
                            <td><strong>{app.Status}</strong></td>
                            <td>
                                <select 
                                    value={app.Status}
                                    onChange={(e) => handleStatusChange(app.Application_ID, e.target.value)}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}