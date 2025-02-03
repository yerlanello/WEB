const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; 

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: 'Unauthorized' });
    
  }
};

module.exports = authenticate;
