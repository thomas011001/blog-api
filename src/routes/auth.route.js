import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/authValidator.js";
const authRouter = Router();

authRouter.post("/signup", signupValidator, signup);
authRouter.post("/login", loginValidator, login);
authRouter.post("/logout", logout);

export default authRouter;
