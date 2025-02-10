const { validationResult } = require('express-validator');
const User = require('../models/user');
const {generateTokens, saveToken, removeToken, findToken, validateAccessToken, validateRefreshToken} = require('../controllers/tokenController');
const uuid = require('uuid');
const mailController = require('../controllers/mailController');
require("dotenv").config();

const API_URL = process.env.API_URL;


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

        const activationLink = uuid.v4();
        const user = new User({ name, email, password, activationLink});
        await user.save();
        await mailController.sendActivationMail(email, `${API_URL}/api/auth/activate/${activationLink}`);
        
        const tokens = generateTokens({ id: user._id });
        await saveToken(user._id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});
        res.status(200).json({ok: true, message: 'Activation link is sent to your email, please activate your account!'});
    } catch (error) {
        
        res.status(500).json({ message: 'Server error' });
    }
};

const activateUser = async (req, res) => {
    try{
        const activationLink = req.params.link;

        const user = await User.findOne({activationLink});
        if (!user) {
            res.status(400).json({ message: 'Activation link is invalid' });
        }

        user.isActivated = true;
        await user.save();

        const loginPageUrl = `${API_URL}/login?activation=success`;
        res.redirect(loginPageUrl);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

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

        if(!user.isActivated){
            return res.status(400).json({ message: 'User account is not activated, please activate you account via link sent to your email!' });
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
    activateUser ,
};
