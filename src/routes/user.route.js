import express from "express";
import {
  getAllUsersController,
  getUserController,
  patchUserController,
  deleteUserController,
  getUserPostsController,
} from "../controllers/user.controller.js";
import { patchUserValidator } from "../validators/userValidator.js";
import verifyToken from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsersController);

userRouter.get("/:id", getUserController);
userRouter.patch("/:id", patchUserValidator, verifyToken, patchUserController);
userRouter.delete("/:id", verifyToken, deleteUserController);

userRouter.get("/:id/posts", getUserPostsController);

export default userRouter;
