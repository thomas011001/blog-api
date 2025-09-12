import prisma from "../config/prisma.js";
import InternalServerError from "../errors/InternalServerError.js";

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

export { getPostComments, createComment };
