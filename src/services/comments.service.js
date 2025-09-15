import prisma from "../config/prisma.js";
import ForbiddenError from "../errors/ForbiddenError.js";
import InternalServerError from "../errors/InternalServerError.js";
import NotFoundError from "../errors/notFoundError.js";

async function getPostComments(id) {
  try {
    const post = await prisma.post.findUnique({ where: { id: id } });
    if (!post) {
      throw new NotFoundError("Post Not Found");
    }
    return await prisma.comment.findMany({
      where: { postId: id },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw e;
    }
    throw new InternalServerError();
  }
}

async function createComment(postId, userId, data) {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundError("Post Not Found");
    } else if (!post.isPublished && post.authorId != userId) {
      throw new ForbiddenError("You can't add comment for this post");
    }
    return await prisma.comment.create({
      data: {
        ...data,
        postId,
        userId,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof NotFoundError || e instanceof ForbiddenError) {
      throw e;
    }
    throw new InternalServerError();
  }
}

async function deleteComment(id) {
  try {
    return await prisma.comment.delete({
      where: { id },
      select: {
        id: true,
        text: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export { getPostComments, createComment, deleteComment };
