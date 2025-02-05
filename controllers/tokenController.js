const jwt = require('jsonwebtoken');
const Token = require('../models/token');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET


// Token functions
const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {
        accessToken,
        refreshToken
    }
}

const validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, JWT_SECRET);
        return userData;
    } catch (error){
        return null;
    }
}

const validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, JWT_REFRESH_SECRET);
        return userData;

    } catch (error){
        return null;
    }
}

const saveToken = async (userId, refreshToken) => {
    const tokenData = await Token.findOne({user: userId});
    if (tokenData){
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await Token.create({user: userId, refreshToken})
    return token;
}

const removeToken = async (refreshToken) => {
    const tokenData = await Token.deleteOne({refreshToken});
    return tokenData;
}

const findToken = async (refreshToken) => {
    const tokenData = await Token.findOne({refreshToken});
    return tokenData;
}


// Export the functions
module.exports = {
    generateTokens ,
    saveToken ,
    removeToken ,
    findToken ,
    validateAccessToken ,
    validateRefreshToken ,
    
};
