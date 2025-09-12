import express from "express";
import {
  getAllPostsController,
  createPostController,
  getPostController,
  patchPostController,
  deletePostController,
  getPostCommentsController,
  addCommentController,
} from "../controllers/post.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { createPostValidator } from "../validators/postValidator.js";
import { createCommentValidator } from "../validators/commentValidator.js";

const postRouter = express.Router();

// DELETE /:id/comments

// POST /:id/likes
// DELETE /:id/likes

postRouter.get("/", getAllPostsController);
postRouter.post("/", createPostValidator, verifyToken, createPostController);
postRouter.get("/:id", getPostController);
postRouter.patch("/:id", createPostValidator, verifyToken, patchPostController);
postRouter.delete("/:id", verifyToken, deletePostController);
postRouter.get(
  "/:id/comments",
  createCommentValidator,
  getPostCommentsController
);

postRouter.post("/:id/comments", verifyToken, addCommentController);

export default postRouter;
