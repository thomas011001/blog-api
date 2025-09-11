import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthenticationError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new AuthenticationError("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AuthenticationError("Invalide token"));
  }
}

export default verifyToken;
