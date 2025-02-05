const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const {generateTokens, saveToken, removeToken, findToken, validateAccessToken, validateRefreshToken} = require('../controllers/tokenController');
const user = require('../models/user');
require("dotenv").config();

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
        
        const tokens = generateTokens({ id: user._id });
        await saveToken(user._id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true})
        
        res.status(200).json({ok: true});
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
        const tokens = generateTokens({ id: user._id });
        await saveToken(user._id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true})
        res.cookie('accessToken', tokens.accessToken, {httpOnly: true})
        res.status(201).json({ok: true, user: user});        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = async (req, res) => {
    try {
        const {refreshToken} = req.cookies;
        
        await removeToken(refreshToken);

        res.clearCookie("refreshToken", {httpOnly: true});
        res.clearCookie("accessToken", {httpOnly: true});
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshUser = async (req, res) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {httpOnly: true});
        res.cookie('accessToken', userData.accessToken, {httpOnly: true});
        res.status(202).json({ok: true, user: userData});        
    } catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
};

async function refresh(refreshToken){
    if (!refreshToken){
        throw new Error("Unauthorized to refresh!");
    }
    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await findToken(refreshToken);
    
    if(!userData || !tokenFromDb){
        throw new Error("Unauthorized to refresh!");
    }
    const user = await User.findById(userData.id);
    const tokens = generateTokens({ id: user._id });
    
    await saveToken(user.id, tokens.refreshToken);
    return {...tokens, user: user};
}


// Export the functions
module.exports = {
    registerUser ,
    loginUser ,
    logoutUser ,
    refreshUser ,
};
