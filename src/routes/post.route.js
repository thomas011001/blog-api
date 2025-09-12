import express from "express";
import {
  getAllPostsController,
  createPostController,
  getPostController,
  patchPostController,
  deletePostController,
} from "../controllers/post.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { createPostValidator } from "../validators/postValidator.js";

const postRouter = express.Router();

// GET /posts/:id/comments

postRouter.get("/", getAllPostsController);
postRouter.post("/", createPostValidator, verifyToken, createPostController);
postRouter.get("/:id", getPostController);
postRouter.patch("/:id", createPostValidator, verifyToken, patchPostController);
postRouter.delete("/:id", verifyToken, deletePostController);
postRouter.get("/:id/comments", getPostCommentsController);

export default postRouter;
