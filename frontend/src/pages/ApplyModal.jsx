import { useState } from 'react';
import axios from 'axios';

export default function ApplyModal({ job, onClose, onSuccess })
{
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setError('');

        try
        {
            await axios.post('http://localhost:5000/api/applications', {
                ...formData,
                job_id: job.Job_ID
            });
            onSuccess();
            onClose();
        }
        catch (err)
        {
            setError(err.response?.data?.error || 'Failed to submit application');
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Apply for {job.Job_Title}</h3>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>{job.Company_Name} &bull; {job.Location}</p>
                {error && <div style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            required 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input 
                            required 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}