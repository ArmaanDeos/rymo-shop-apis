import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = user;
      next(); // Call next without an error parameter
    } catch (err) {
      next(new ApiError(403, "Token is not valid")); // Call next with an error parameter
    }
  } else {
    next(new ApiError(401, "You are not authenticated")); // Call next with an error parameter
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, (error) => {
    if (error) {
      next(error); // Pass the error to the next middleware
    } else if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      next(new ApiError(403, "You are not allowed to do that"));
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, (error) => {
    if (error) {
      next(error); // Pass the error to the next middleware
    } else if (req.user.isAdmin) {
      next();
    } else {
      next(new ApiError(403, "You are not allowed to do that"));
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
