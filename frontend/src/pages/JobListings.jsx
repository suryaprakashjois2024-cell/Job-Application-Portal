import { useEffect, useState } from 'react';
import axios from 'axios';
import ApplyModal from './ApplyModal';

export default function JobListings()
{
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() =>
    {
        axios.get('http://localhost:5000/api/jobs')
            .then(res => setJobs(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container">
            <h2>Current Job Openings</h2>
            {successMessage && (
                <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', marginTop: '1rem' }}>
                    {successMessage}
                </div>
            )}
            <div className="grid">
                {jobs.map(job => (
                    <div key={job.Job_ID} className="card">
                        <div>
                            <h3>{job.Job_Title}</h3>
                            <p style={{ fontWeight: '600', color: '#475569' }}>{job.Company_Name}</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Dept: {job.Department_Name}</p>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Location: {job.Location}</p>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{ marginTop: '1rem' }}
                            onClick={() => setSelectedJob(job)}
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
            {selectedJob && (
                <ApplyModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)} 
                    onSuccess={() => setSuccessMessage('Application submitted successfully!')}
                />
            )}
        </div>
    );
}