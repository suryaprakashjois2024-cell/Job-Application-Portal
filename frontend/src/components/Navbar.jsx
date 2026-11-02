import React from 'react';

export default function Navbar({ user, onOpenAuth, onLoginClick, onLogout, activeTab, setActiveTab })
{
    const handleAuthClick = onOpenAuth || onLoginClick;

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <h1 style={logoStyle} onClick={() => setActiveTab('jobs')}>
                    Job Application Portal
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        style={activeTab === 'jobs' ? activeLinkStyle : linkStyle}
                    >
                        Job Openings
                    </button>

                    {user?.role === 'seeker' && (
                        <button
                            onClick={() => setActiveTab('my-applications')}
                            style={activeTab === 'my-applications' ? activeLinkStyle : linkStyle}
                        >
                            My Applications
                        </button>
                    )}

                    {user?.role === 'recruiter' && (
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            style={activeTab === 'dashboard' ? activeLinkStyle : linkStyle}
                        >
                            Recruiter Dashboard
                        </button>
                    )}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginLeft: '0.5rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                {user.name} ({user.role})
                            </span>
                            <button onClick={onLogout} style={logoutBtnStyle}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleAuthClick} style={loginBtnStyle}>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

const navStyle = {
    background: '#0f172a',
    color: '#fff',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const containerStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const logoStyle = {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const linkStyle = {
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.4rem 0.6rem'
};

const activeLinkStyle = {
    ...linkStyle,
    color: '#fff',
    fontWeight: 'bold',
    borderBottom: '2px solid #3b82f6'
};

const loginBtnStyle = {
    padding: '0.5rem 1rem',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const logoutBtnStyle = {
    padding: '0.4rem 0.8rem',
    background: '#334155',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer'
};