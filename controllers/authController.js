const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET

// Registration function
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).cookie("token", token, {
            httpOnly: true,
        }).json({ok: true});
    } catch (error) {
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Login function
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).cookie("token", token, {
            httpOnly: true,
        }).json({ok: true});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {httpOnly: true});
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the functions
module.exports = {
    registerUser ,
    loginUser ,
    logoutUser ,
};

