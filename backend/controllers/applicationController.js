const pool = require('../config/db');

exports.submitApplication = async (req, res) =>
{
    const { jobId, applicantName, email, phone, resumeLink } = req.body;

    if (!jobId || !applicantName || !email || !phone)
    {
        return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const connection = await pool.getConnection();

    try
    {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            'SELECT Applicant_ID FROM APPLICANT WHERE Email = ?',
            [email]
        );

        let applicantId;

        if (existing.length > 0)
        {
            applicantId = existing[0].Applicant_ID;
            await connection.query(
                'UPDATE APPLICANT SET Applicant_Name = ?, Phone = ?, Resume_Link = ? WHERE Applicant_ID = ?',
                [applicantName, phone, resumeLink || null, applicantId]
            );
        }
        else
        {
            const [insertResult] = await connection.query(
                'INSERT INTO APPLICANT (Applicant_Name, Email, Phone, Resume_Link) VALUES (?, ?, ?, ?)',
                [applicantName, email, phone, resumeLink || null]
            );
            applicantId = insertResult.insertId;
        }

        const [dupCheck] = await connection.query(
            'SELECT * FROM APPLICATION WHERE Applicant_ID = ? AND Job_ID = ?',
            [applicantId, jobId]
        );

        if (dupCheck.length > 0)
        {
            await connection.rollback();
            return res.status(400).json({ error: 'You have already applied for this position.' });
        }

        const today = new Date().toISOString().slice(0, 10);
        await connection.query(
            'INSERT INTO APPLICATION (Applicant_ID, Job_ID, Applied_Date, Status) VALUES (?, ?, ?, ?)',
            [applicantId, jobId, today, 'Applied']
        );

        await connection.commit();
        res.status(201).json({ message: 'Application submitted successfully.' });
    }
    catch (error)
    {
        await connection.rollback();
        console.error('APPLICATION ERROR:', error);
        res.status(500).json({ error: error.message });
    }
    finally
    {
        connection.release();
    }
};

exports.getAllApplications = async (req, res) =>
{
    try
    {
        const query = `
            SELECT 
                a.Application_ID,
                app.Applicant_Name,
                app.Email,
                app.Phone,
                app.Resume_Link,
                j.Job_Title,
                c.Company_Name,
                a.Applied_Date,
                a.Status,
                i.Interview_Date,
                i.Mode AS Interview_Mode,
                o.Salary_Offered,
                o.Joining_Date
            FROM APPLICATION a
            JOIN APPLICANT app ON a.Applicant_ID = app.Applicant_ID
            JOIN JOB j ON a.Job_ID = j.Job_ID
            JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
            JOIN COMPANY c ON d.Company_ID = c.Company_ID
            LEFT JOIN INTERVIEW i ON a.Application_ID = i.Application_ID
            LEFT JOIN OFFER o ON a.Application_ID = o.Application_ID
            ORDER BY a.Applied_Date DESC
        `;

        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    }
    catch (error)
    {
        console.error('FETCH APPLICATIONS ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyApplications = async (req, res) =>
{
    const { email } = req.query;

    if (!email)
    {
        return res.status(400).json({ error: 'Candidate email is required.' });
    }

    try
    {
        const query = `
            SELECT 
                a.Application_ID,
                j.Job_Title,
                c.Company_Name,
                j.Location,
                a.Applied_Date,
                a.Status,
                i.Interview_Date,
                i.Mode AS Interview_Mode,
                i.Feedback,
                o.Salary_Offered,
                o.Joining_Date
            FROM APPLICATION a
            JOIN APPLICANT app ON a.Applicant_ID = app.Applicant_ID
            JOIN JOB j ON a.Job_ID = j.Job_ID
            JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
            JOIN COMPANY c ON d.Company_ID = c.Company_ID
            LEFT JOIN INTERVIEW i ON a.Application_ID = i.Application_ID
            LEFT JOIN OFFER o ON a.Application_ID = o.Application_ID
            WHERE app.Email = ?
            ORDER BY a.Applied_Date DESC
        `;

        const [rows] = await pool.query(query, [email]);
        res.status(200).json(rows);
    }
    catch (error)
    {
        console.error('GET MY APPLICATIONS ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) =>
{
    const { id } = req.params;
    const { status, interviewDetails, offerDetails } = req.body;

    const connection = await pool.getConnection();

    try
    {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE APPLICATION SET Status = ? WHERE Application_ID = ?',
            [status, id]
        );

        if (status === 'Interview Scheduled' && interviewDetails)
        {
            const { interviewDate, mode, feedback } = interviewDetails;
            await connection.query(
                'INSERT INTO INTERVIEW (Application_ID, Interview_Date, Mode, Feedback) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Interview_Date = VALUES(Interview_Date), Mode = VALUES(Mode), Feedback = VALUES(Feedback)',
                [id, interviewDate, mode || 'Online', feedback || '']
            );
        }

        if (status === 'Offered' && offerDetails)
        {
            const { salaryOffered, joiningDate } = offerDetails;
            const today = new Date().toISOString().slice(0, 10);
            await connection.query(
                'INSERT INTO OFFER (Application_ID, Offer_Date, Salary_Offered, Joining_Date, Offer_Status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Salary_Offered = VALUES(Salary_Offered), Joining_Date = VALUES(Joining_Date)',
                [id, today, salaryOffered, joiningDate, 'Pending']
            );
        }

        await connection.commit();
        res.status(200).json({ message: 'Status and workflow details updated successfully.' });
    }
    catch (error)
    {
        await connection.rollback();
        console.error('UPDATE STATUS ERROR:', error);
        res.status(500).json({ error: error.message });
    }
    finally
    {
        connection.release();
    }
};