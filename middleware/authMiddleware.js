const tokenController = require('../controllers/tokenController');
require("dotenv").config();

const authenticate = async (req, res, next) => {

  try {
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
      return res.status(401).json({ message: 'No access token provided' });
    }
    const userData = tokenController.validateAccessToken(accessToken);
    if(!userData){
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = userData;
    next();
  } catch (error) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(401).json({ message: 'Unauthorized' }); 
  }
};

module.exports = authenticate;
