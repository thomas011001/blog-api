import prisma from "../config/prisma.js";
import ConflictError from "../errors/conflictError.js";
import InternalServerError from "../errors/InternalServerError.js";
import NotFoundError from "../errors/notFoundError.js";

async function addLike(postId, userId) {
  try {
    await prisma.post.findFirstOrThrow({ where: { id: postId } });
    return await prisma.like.create({ data: { postId, userId } });
  } catch (e) {
    console.log(e);
    if (e.code === "P2002") {
      throw new ConflictError("You already liked this post");
    } else if (e.code === "P2025") {
      throw new NotFoundError("Post Not Found");
    }
    throw new InternalServerError();
  }
}

async function deleteLike(postId, userId) {
  try {
    return await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new ConflictError("You didnt like this post");
    }
    throw new InternalServerError();
  }
}

export { addLike, deleteLike };
