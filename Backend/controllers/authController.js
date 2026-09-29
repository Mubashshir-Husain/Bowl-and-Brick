import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register first admin (Use once via Postman)
// @route   POST /api/auth/register
export const registerAdmin = async (req, res) => {
    try {
        // Naya Security Check: Dekho ki kya koi admin pehle se database mein hai
        const adminCount = await User.countDocuments();
        if (adminCount > 0) {
            return res.status(403).json({ 
                message: 'Registration is closed. An admin account already exists.' 
            });
        }

        const { name, email, password } = req.body;
        
        // (Yeh check ab optional hai, par rakhna safe hai)
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Admin already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Admin created successfully', adminId: admin._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Admin Login
// @route   POST /api/auth/login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT Token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: { id: admin._id, name: admin.name, email: admin.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};