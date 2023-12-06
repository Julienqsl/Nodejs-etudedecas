const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require("../api/users/users.service.js"); 

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "No token provided";
    }
    
    const decoded = jwt.verify(token, config.secretJwtToken);
    
  
    const user = await usersService.get(decoded.userId);
    
    if (!user) {
      throw "User not found";
    }

    req.user = user;

    next();
  } catch (error) {
    next(new UnauthorizedError(error.message || "Unauthorized"));
  }
};
