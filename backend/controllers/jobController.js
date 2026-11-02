const pool = require('../config/db');

exports.getAllJobs = async (req, res) =>
{
    try
    {
        const query = `
            SELECT 
                j.Job_ID,
                j.Job_Title,
                j.Job_Description,
                j.Location,
                j.Salary_Range,
                d.Department_Name,
                c.Company_Name,
                r.Recruiter_Name
            FROM JOB j
            JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
            JOIN COMPANY c ON d.Company_ID = c.Company_ID
            JOIN RECRUITER r ON j.Recruiter_ID = r.Recruiter_ID
            ORDER BY j.Job_ID DESC
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    }
    catch (error)
    {
        console.error('FETCH JOBS ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createJob = async (req, res) =>
{
    const { jobTitle, jobDescription, location, salaryRange, departmentId, recruiterId } = req.body;

    if (!jobTitle || !location || !departmentId || !recruiterId)
    {
        return res.status(400).json({ error: 'Job title, location, department, and recruiter are required.' });
    }

    try
    {
        const [result] = await pool.query(
            'INSERT INTO JOB (Job_Title, Job_Description, Location, Salary_Range, Department_ID, Recruiter_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [jobTitle, jobDescription || '', location, salaryRange || 'Not disclosed', departmentId, recruiterId]
        );
        res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
    }
    catch (error)
    {
        console.error('CREATE JOB ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};