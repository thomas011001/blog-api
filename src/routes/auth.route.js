import { Router } from "express";
import {
  getUserInfo,
  login,
  logout,
  refresh,
  signup,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/authValidator.js";
import verifyToken from "../middleware/verifyToken.js";
import rateLimit from "express-rate-limit";
const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      success: false,
      error: {
        message: "Too many login attempts, please try again after a minute.",
      },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginLimiter, loginValidator, login);
authRouter.post("/logout", logout);
authRouter.get("/me", verifyToken, getUserInfo);
authRouter.post("/refresh", refresh);

export default authRouter;
