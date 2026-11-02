const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) =>
{
    const { name, email, password, role } = req.body;
    try
    {
        const [existing] = await pool.query('SELECT * FROM USERS WHERE Email = ?', [email]);
        if (existing.length > 0)
        {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'recruiter' ? 'recruiter' : 'seeker';

        const [result] = await pool.query(
            'INSERT INTO USERS (Name, Email, Password_Hash, Role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        const token = jwt.sign(
            { id: result.insertId, email, role: userRole },
            process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: result.insertId, name, email, role: userRole }
        });
    }
    catch (error)
    {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) =>
{
    const { email, password } = req.body;
    try
    {
        const [users] = await pool.query('SELECT * FROM USERS WHERE Email = ?', [email]);
        if (users.length === 0)
        {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.Password_Hash);
        if (!isMatch)
        {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.User_ID, email: user.Email, role: user.Role },
            process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: { id: user.User_ID, name: user.Name, email: user.Email, role: user.Role }
        });
    }
    catch (error)
    {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};