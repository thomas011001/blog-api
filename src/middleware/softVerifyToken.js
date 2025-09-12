import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError.js";

function softVerifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.user = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AuthenticationError("Invalide token"));
  }
}

export default softVerifyToken;
