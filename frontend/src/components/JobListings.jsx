import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobListings({ onApplyClick })
{
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [viewJobModal, setViewJobModal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        fetchJobs();
    }, []);

    const fetchJobs = async () =>
    {
        try
        {
            const res = await axios.get('http://localhost:5000/api/jobs');
            setJobs(Array.isArray(res.data) ? res.data : []);
        }
        catch (error)
        {
            console.error('Error fetching jobs:', error);
            setJobs([]);
        }
        finally
        {
            setLoading(false);
        }
    };

    const safeJobs = Array.isArray(jobs) ? jobs : [];

    const departments = ['All', ...new Set(safeJobs.map((j) => j.Department_Name).filter(Boolean))];
    const uniqueLocations = ['All', ...new Set(safeJobs.map((j) => j.Location).filter(Boolean))];

    // Calculate company opening counts dynamically
    const companies = ['Infosys', 'TCS', 'Wipro'].map((cName) => ({
        name: cName,
        count: safeJobs.filter((j) => j.Company_Name?.toLowerCase() === cName.toLowerCase()).length
    }));

    const filteredJobs = safeJobs.filter((job) =>
    {
        const title = job.Job_Title ? job.Job_Title.toLowerCase() : '';
        const company = job.Company_Name ? job.Company_Name.toLowerCase() : '';
        const dept = job.Department_Name ? job.Department_Name.toLowerCase() : '';
        const query = searchTerm.toLowerCase();

        const matchesSearch = title.includes(query) || company.includes(query) || dept.includes(query);
        const matchesLocation = selectedLocation === 'All' || job.Location === selectedLocation;
        const matchesDept = selectedDept === 'All' || job.Department_Name === selectedDept;
        const matchesCompany = selectedCompany === 'All' || job.Company_Name?.toLowerCase() === selectedCompany.toLowerCase();

        return matchesSearch && matchesLocation && matchesDept && matchesCompany;
    });

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <header style={heroSectionStyle}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                    <span style={badgeStyle}>Verified Enterprise Hiring Portal</span>
                    <h1 style={heroHeadingStyle}>Discover Your Next Career Step</h1>
                    <p style={heroSubtextStyle}>
                        Explore roles across software systems, data infrastructure, and security engineering.
                    </p>

                    {/* Metric Quick Stats */}
                    <div style={statsContainerStyle}>
                        <div style={statBoxStyle}>
                            <span style={statNumberStyle}>{safeJobs.length}</span>
                            <span style={statLabelStyle}>Active Openings</span>
                        </div>
                        <div style={statDividerStyle} />
                        <div style={statBoxStyle}>
                            <span style={statNumberStyle}>
                                {new Set(safeJobs.map((j) => j.Company_Name)).size}
                            </span>
                            <span style={statLabelStyle}>Partner Companies</span>
                        </div>
                        <div style={statDividerStyle} />
                        <div style={statBoxStyle}>
                            <span style={statNumberStyle}>{uniqueLocations.filter((l) => l !== 'All').length}</span>
                            <span style={statLabelStyle}>Tech Hub Locations</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Partner Companies Quick Strip */}
            <section style={{ maxWidth: '1100px', margin: '-1.5rem auto 1.5rem auto', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div
                        onClick={() => setSelectedCompany('All')}
                        style={{
                            ...companyFilterCardStyle,
                            border: selectedCompany === 'All' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: selectedCompany === 'All' ? '#eff6ff' : '#ffffff'
                        }}
                    >
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>All Companies</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{safeJobs.length} Total Roles</div>
                    </div>

                    {companies.map((c) => (
                        <div
                            key={c.name}
                            onClick={() => setSelectedCompany(selectedCompany === c.name ? 'All' : c.name)}
                            style={{
                                ...companyFilterCardStyle,
                                border: selectedCompany === c.name ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                background: selectedCompany === c.name ? '#eff6ff' : '#ffffff'
                            }}
                        >
                            <div style={{ fontWeight: '700', color: '#2563eb' }}>{c.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.count} Active Openings</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Filter & Controls Container */}
            <section style={{ maxWidth: '1100px', margin: '0 auto 2rem auto', padding: '0 1rem' }}>
                <div style={searchCardStyle}>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '2', minWidth: '260px' }}>
                            <input
                                type="text"
                                placeholder="Search by role, company, or technical keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={searchInputStyle}
                            />
                        </div>

                        <div style={{ flex: '1', minWidth: '180px' }}>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                style={selectInputStyle}
                            >
                                {uniqueLocations.map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc === 'All' ? 'All Locations' : loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Department Quick Filter Chips */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Department:</span>
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                style={{
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '0.35rem 0.85rem',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: selectedDept === dept ? '#2563eb' : '#f1f5f9',
                                    color: selectedDept === dept ? '#ffffff' : '#475569'
                                }}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Grid */}
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#1e293b', margin: 0 }}>
                        Available Positions <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '1rem' }}>({filteredJobs.length})</span>
                    </h2>
                </div>

                {loading ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Fetching database listings...</p>
                ) : filteredJobs.length === 0 ? (
                    <div style={emptyStateStyle}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>No matching openings found</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Try clearing your search query or company filters.</p>
                    </div>
                ) : (
                    <div style={gridStyle}>
                        {filteredJobs.map((job) => (
                            <div key={job.Job_ID} style={jobCardStyle}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div style={companyAvatarStyle}>
                                            {job.Company_Name?.charAt(0) || 'C'}
                                        </div>
                                        <span style={badgeRoleStyle}>Full Time</span>
                                    </div>

                                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.15rem' }}>
                                        {job.Job_Title}
                                    </h3>
                                    <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        {job.Company_Name}
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.9rem' }}>
                                        <span style={chipStyle}>📍 {job.Location}</span>
                                        <span style={chipStyle}>💼 {job.Department_Name}</span>
                                        <span style={salaryChipStyle}>💰 {job.Salary_Range || 'Competitive'}</span>
                                    </div>

                                    {job.Job_Description && (
                                        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: '0 0 1.2rem 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {job.Job_Description}
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                                    <button
                                        onClick={() => setViewJobModal(job)}
                                        style={secondaryBtnStyle}
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => onApplyClick(job)}
                                        style={applyBtnStyle}
                                    >
                                        Apply →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Quick-View Job Detail Modal */}
            {viewJobModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <span style={badgeRoleStyle}>Verified Role</span>
                                <h2 style={{ margin: '0.4rem 0 0.2rem 0', color: '#0f172a' }}>{viewJobModal.Job_Title}</h2>
                                <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '1.1rem' }}>{viewJobModal.Company_Name}</div>
                            </div>
                            <button
                                onClick={() => setViewJobModal(null)}
                                style={modalCloseBtnStyle}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                            <span style={chipStyle}>📍 Location: {viewJobModal.Location}</span>
                            <span style={chipStyle}>💼 Department: {viewJobModal.Department_Name}</span>
                            <span style={salaryChipStyle}>💰 Package: {viewJobModal.Salary_Range || 'Competitive'}</span>
                        </div>

                        <h4 style={{ margin: '1rem 0 0.4rem 0', color: '#334155' }}>Role Overview & Responsibilities</h4>
                        <div style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.6', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {viewJobModal.Job_Description || 'No detailed description provided for this opening.'}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setViewJobModal(null)}
                                style={secondaryBtnStyle}
                            >
                                Close
                            </button>
                            <button
                                onClick={() =>
                                {
                                    const jobToApply = viewJobModal;
                                    setViewJobModal(null);
                                    onApplyClick(jobToApply);
                                }}
                                style={{ ...applyBtnStyle, width: 'auto', padding: '0.7rem 1.8rem' }}
                            >
                                Apply Now →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const heroSectionStyle = {
    background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 100%)',
    color: '#ffffff',
    padding: '3.5rem 1rem 4rem 1rem',
    borderBottom: '1px solid #334155'
};

const badgeStyle = {
    display: 'inline-block',
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    color: '#60a5fa',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    padding: '0.3rem 0.8rem',
    borderRadius: '100px',
    marginBottom: '1rem',
    textTransform: 'uppercase'
};

const heroHeadingStyle = {
    fontSize: '2.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    margin: '0 0 0.8rem 0'
};

const heroSubtextStyle = {
    fontSize: '1.05rem',
    color: '#94a3b8',
    margin: '0 auto 2rem auto',
    maxWidth: '600px',
    lineHeight: '1.6'
};

const statsContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    padding: '0.85rem 1.8rem'
};

const statBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const statNumberStyle = {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#38bdf8'
};

const statLabelStyle = {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '0.2rem'
};

const statDividerStyle = {
    width: '1px',
    height: '28px',
    background: 'rgba(255, 255, 255, 0.15)'
};

const companyFilterCardStyle = {
    padding: '1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
};

const searchCardStyle = {
    background: '#ffffff',
    padding: '1.2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0'
};

const searchInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box'
};

const selectInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.92rem',
    outline: 'none',
    background: '#ffffff',
    boxSizing: 'border-box'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
    gap: '1.5rem'
};

const jobCardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '1.4rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const companyAvatarStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: '#eff6ff',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1.1rem'
};

const badgeRoleStyle = {
    background: '#f1f5f9',
    color: '#475569',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px'
};

const chipStyle = {
    fontSize: '0.78rem',
    color: '#475569',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px'
};

const salaryChipStyle = {
    ...chipStyle,
    color: '#15803d',
    background: '#f0fdf4',
    borderColor: '#dcfce7',
    fontWeight: '600'
};

const applyBtnStyle = {
    flex: '2',
    padding: '0.65rem',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer'
};

const secondaryBtnStyle = {
    flex: '1',
    padding: '0.65rem',
    background: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer'
};

const emptyStateStyle = {
    background: '#ffffff',
    padding: '3rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
};

const modalContentStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '550px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const modalCloseBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#64748b',
    cursor: 'pointer'
};