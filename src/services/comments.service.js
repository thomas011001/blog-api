import prisma from "../config/prisma.js";
import InternalServerError from "../errors/InternalServerError.js";
import NotFoundError from "../errors/notFoundError.js";

async function getPostComments(id) {
  try {
    return await prisma.comment.findMany({
      where: { postId: id },
    });
  } catch {
    throw new InternalServerError();
  }
}

async function createComment(postId, userId, data) {
  try {
    return await prisma.comment.create({
      data: {
        ...data,
        postId,
        userId,
      },
    });
  } catch {
    throw new InternalServerError();
  }
}

async function deleteComment(id) {
  try {
    return await prisma.comment.delete({ where: { id } });
  } catch (e) {
    console.log(e);
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export { getPostComments, createComment, deleteComment };
