import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "../services/user.service.js";
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

    return res.json({ success: true, data: { token } });
  } catch (e) {
    next(e);
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.json({ success: true, message: "logged out" });
}

export { signup, login, logout };
