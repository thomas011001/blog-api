import prisma from "../config/prisma.js";
import paginate from "../utils/paginate.js";
import NotFoundError from "../errors/notFoundError.js";
import InternalServerError from "../errors/InternalServerError.js";

async function getUserPosts(
  id,
  page = 1,
  limit = 10,
  q = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) {
  const orderBy = { [sortBy]: sortOrder };
  const where = {
    authorId: id,
    OR: [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        text: {
          contains: q,
          mode: "insensitive",
        },
      },
    ],
  };

  const select = {
    title: true,
    text: true,
    author: {
      select: {
        username: true,
        id: true,
      },
    },
    _count: {
      select: {
        comments: true,
        likes: true,
      },
    },
  };
  try {
    return await paginate(prisma.post, { page, limit, where, orderBy, select });
  } catch (e) {
    console.log(e);
    if (e.code === "P2025") {
      throw new NotFoundError("User Not Found.");
    }
    throw new InternalServerError();
  }
}

export { getUserPosts };
