import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/authValidator.js";
import rateLimit from "express-rate-limit";
const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after a minute.",
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginValidator, loginLimiter, login);
authRouter.post("/logout", logout);

export default authRouter;
