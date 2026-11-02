import React, { useState } from 'react';
import axios from 'axios';

export default function AuthModal({ onClose, onLoginSuccess })
{
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker');
    const [error, setError] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError('');

        const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
        const payload = isSignUp
            ? { name, email, password, role }
            : { email, password };

        try
        {
            const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
            if (res.data.token && res.data.user)
            {
                onLoginSuccess(res.data.user, res.data.token);
            }
            else
            {
                setError('Unexpected response from server');
            }
        }
        catch (err)
        {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                </h2>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div style={{ marginBottom: '0.8rem' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '0.8rem' }}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {isSignUp && (
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={labelStyle}>Account Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="seeker">Job Seeker (Candidate)</option>
                                <option value="recruiter">Recruiter / Admin</option>
                            </select>
                        </div>
                    )}

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
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() =>
                        {
                            setIsSignUp(!isSignUp);
                            setError('');
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>

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
    maxWidth: '420px',
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