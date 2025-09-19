import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserById,
  getUserByUsername,
} from "../services/user.service.js";
import "dotenv/config";
import { validationResult } from "express-validator";
import ValidationError from "../errors/valdiationError.js";
import AuthenticationError from "../errors/AuthenticationError.js";

async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ValidationError(
        errors
          .array()
          .map((err) => err.msg)
          .join(" | ")
      )
    );
  }

  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await createUser({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "user created", success: true });
  } catch (e) {
    return next(e);
  }
}
function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.json({ success: true, message: "logged out" });
}

async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ValidationError(
        errors
          .array()
          .map((err) => err.msg)
          .join(" | ")
      )
    );
  }

  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
      return next(new AuthenticationError("incorrect username or password"));
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return next(new AuthenticationError("incorrect username or password"));
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, data: { token } });
  } catch (e) {
    next(e);
  }
}

async function getUserInfo(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    console.log(req.cookies);
    console.log(token);
    if (!token) {
      return next(new AuthenticationError("Refresh token not found"));
    }

    // Verify refresh token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return next(
          new AuthenticationError("Invalid or expired refresh token")
        );
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { id: decoded.id, username: decoded.username },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({
        success: true,
        data: { accessToken },
      });
    });
  } catch (e) {
    next(e);
  }
}

export { signup, getUserInfo, login, logout, refresh };
