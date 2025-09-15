import { validationResult } from "express-validator";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../services/post.service.js";
import ValidationError from "../errors/valdiationError.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import {
  createComment,
  getPostComments,
} from "../services/comments.service.js";
import { addLike, deleteLike } from "../services/like.service.js";

async function getAllPostsController(req, res, next) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

  const search = req.query.q || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  try {
    const data = await getAllPosts(page, limit, search, sortBy, sortOrder);
    return res.json({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function createPostController(req, res, next) {
  const errros = validationResult(req);
  if (!errros.isEmpty()) {
    return next(
      new ValidationError(
        errros
          .array()
          .map((error) => error.msg)
          .join(" | ")
      )
    );
  }

  const [authorId, data] = [req.user.id, req.body];

  try {
    const post = await createPost(data, authorId);
    return res.json({
      success: true,
      message: "Post created",
      data: post,
    });
  } catch (e) {
    next(e);
  }
}

async function getPostController(req, res, next) {
  const { id } = req.params;
  try {
    const data = await getPost(id, req.user);
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

async function patchPostController(req, res, next) {
  const errros = validationResult(req);
  if (!errros.isEmpty()) {
    return next(
      new ValidationError(
        errros
          .array()
          .map((error) => error.msg)
          .join(" | ")
      )
    );
  }

  const [id, body, userId] = [req.params.id, req.body, req.user.id];

  try {
    const post = await getPost(id, req.user);
    if (post.author.id != userId) {
      throw new ForbiddenError(
        "You do not have permission to perform this action."
      );
    }

    const data = await editPost(id, body);
    return res.json({ success: true, message: "Edited Post", data });
  } catch (e) {
    next(e);
  }
}

async function deletePostController(req, res, next) {
  const { id } = req.params;
  const post = await getPost(id);
  if (post.author.id != req.user.id) {
    return next(
      new ForbiddenError("You do not have permission to perform this action.")
    );
  }

  try {
    const data = await deletePost(id);
    return res.json({ success: true, message: "Deleted.", data });
  } catch (e) {
    next(e);
  }
}

async function getPostCommentsController(req, res, next) {
  const { id } = req.params;
  try {
    const data = await getPostComments(id);
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function addCommentController(req, res, next) {
  const errros = validationResult(req);
  if (!errros.isEmpty()) {
    return next(
      new ValidationError(
        errros
          .array()
          .map((error) => error.msg)
          .join(" | ")
      )
    );
  }

  const [id, userId, body] = [req.params.id, req.user.id, req.body];

  const post = await getPost(id, req.user);
  if (!post.isPublished) {
    return next(new ForbiddenError("You can't add comment to this post"));
  }

  try {
    const data = await createComment(id, userId, body);
    return res.json({ success: true, message: "Post Created", data });
  } catch (e) {
    next(e);
  }
}

async function addLikeController(req, res, next) {
  const [postId, userId] = [req.params.id, req.user.id];

  try {
    await addLike(postId, userId);
    return res.json({ success: true, message: "Added Like." });
  } catch (e) {
    next(e);
  }
}

async function removeLikeController(req, res, next) {
  const [postId, userId] = [req.params.id, req.user.id];
  try {
    await deleteLike(postId, userId);
    return res.json({ success: true, message: "Deleted Like." });
  } catch (e) {
    next(e);
  }
}

export {
  removeLikeController,
  addCommentController,
  getPostCommentsController,
  deletePostController,
  getAllPostsController,
  createPostController,
  getPostController,
  patchPostController,
  addLikeController,
};
