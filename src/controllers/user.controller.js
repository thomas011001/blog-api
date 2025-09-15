import { validationResult } from "express-validator";
import ForbiddenError from "../errors/ForbiddenError.js";
import {
  deleteUser,
  editUser,
  getAllUsers,
  getUserById,
} from "../services/user.service.js";
import { getUserPosts } from "../services/post.service.js";
import ValidationError from "../errors/valdiationError.js";

async function getAllUsersController(req, res, next) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

  const search = req.query.q || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  try {
    const data = await getAllUsers(page, limit, search, sortBy, sortOrder);
    return res.json({
      success: true,
      data,
    });
  } catch (e) {
    return next(e);
  }
}

async function getUserController(req, res, next) {
  const { id } = req.params;
  try {
    const data = await getUserById(id);
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
}

async function patchUserController(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;
  if (id !== userId) {
    return next(
      new ForbiddenError("You do not have permission to perform this action.")
    );
  }

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
    const data = await editUser(req.body, id);
    res.json({ success: true, message: "Edited User", data });
  } catch (e) {
    return next(e);
  }
}

async function deleteUserController(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;
  if (id !== userId) {
    return next(
      new ForbiddenError("You do not have permission to perform this action.")
    );
  }

  try {
    await deleteUser(id);
    res.json({ success: true, message: "User deleted." });
  } catch (e) {
    return next(e);
  }
}

async function getUserPostsController(req, res, next) {
  const { id } = req.params;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

  const search = req.query.q || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  const isAuthor = req.user ? id == req.user.id : false;

  try {
    const data = await getUserPosts(
      id,
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      isAuthor
    );
    return res.json({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
}

export {
  getAllUsersController,
  getUserController,
  patchUserController,
  deleteUserController,
  getUserPostsController,
};
