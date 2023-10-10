const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require("../path/to/users.service"); // Remplacez le chemin par le chemin correct vers votre service utilisateur

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "No token provided";
    }
    
    const decoded = jwt.verify(token, config.secretJwtToken);
    
    // Récupérez toutes les informations de l'utilisateur en fonction de l'ID
    const user = await usersService.get(decoded.userId);
    
    if (!user) {
      throw "User not found";
    }

    // Attachez toutes les informations de l'utilisateur à l'objet req.user
    req.user = user;

    next();
  } catch (error) {
    next(new UnauthorizedError(error.message || "Unauthorized"));
  }
};
