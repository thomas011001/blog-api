import prisma from "../config/prisma.js";
import InternalServerError from "../errors/InternalServerError.js";

async function addLike(postId, userId) {
  try {
    return await prisma.like.create({ data: { postId, userId } });
  } catch {
    throw new InternalServerError();
  }
}

async function deleteLike(postId, userId) {
  try {
    return await prisma.like.delete({ where: { postId, userId } });
  } catch {
    throw new InternalServerError();
  }
}

export { addLike, deleteLike };
