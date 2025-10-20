import ErrorHandler from "../untils/errorHendlar.js"; 
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    
    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token. Please login again.", 401));
  }
};
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorHandler("You are not authorized to access this resource", 403));
    }
    next();
  };
}

export { isLoggedIn, authorizeRoles };
