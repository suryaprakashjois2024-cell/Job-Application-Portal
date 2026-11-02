import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobListings from './components/JobListings';
import AdminDashboard from './components/AdminDashboard';
import ApplyModal from './components/ApplyModal';
import AuthModal from './components/AuthModal';
import MyApplications from './components/MyApplications';

export default function App()
{
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('jobs');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [jobsRefreshKey, setJobsRefreshKey] = useState(0);

    useEffect(() =>
    {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser)
        {
            try
            {
                setUser(JSON.parse(savedUser));
            }
            catch (err)
            {
                console.error('Failed to parse cached user:', err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLoginSuccess = (userData, token) =>
    {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);

        if (userData.role === 'recruiter')
        {
            setActiveTab('dashboard');
        }
        else
        {
            setActiveTab('jobs');
        }
    };

    const handleLogout = () =>
    {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setActiveTab('jobs');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Navbar
                user={user}
                onOpenAuth={() => setShowAuthModal(true)}
                onLoginClick={() => setShowAuthModal(true)}
                onLogout={handleLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main>
                {activeTab === 'jobs' && (
                    <JobListings
                        key={jobsRefreshKey}
                        onApplyClick={(job) => setSelectedJob(job)}
                    />
                )}

                {activeTab === 'my-applications' && (
                    <MyApplications user={user} />
                )}

                {activeTab === 'dashboard' && (
                    <AdminDashboard
                        onJobCreated={() => setJobsRefreshKey((prev) => prev + 1)}
                    />
                )}
            </main>

            {selectedJob && (
                <ApplyModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
}