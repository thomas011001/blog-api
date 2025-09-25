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
  sortOrder = "desc",
  isAuthor = false
) {
  const orderBy = { [sortBy]: sortOrder };
  const where = { authorId: id };

  if (!isAuthor) {
    where.isPublished = true;
  }

  if (q) {
    where.OR = [
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
      {
        description: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  const select = {
    id: true,
    title: true,
    description: true,
    text: true,
    photoUrl: true,
    createdAt: true,
    isPublished: true,
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
    if (e.code === "P2025") {
      throw new NotFoundError("User Not Found.");
    }
    throw new InternalServerError();
  }
}

async function getAllPosts(
  page = 1,
  limit = 10,
  q = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) {
  const orderBy = { [sortBy]: sortOrder };
  const where = q
    ? {
        isPublished: true,
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
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      }
    : { isPublished: true };

  const select = {
    id: true,
    title: true,
    description: true,
    text: true,
    photoUrl: true,
    createdAt: true,
    isPublished: true,

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
    throw new InternalServerError();
  }
}

async function createPost(data, authorId) {
  try {
    return await prisma.post.create({
      data: {
        ...data,
        authorId,
      },
    });
  } catch (e) {
    console.log(e);
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

async function getPost(id, user) {
  try {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        photoUrl: true,
        text: true,
        createdAt: true,
        isPublished: true,
        author: {
          select: {
            username: true,
            id: true,
            avatarUrl: true,
          },
        },
        comments: {
          select: {
            id: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                id: true,
                avatarUrl: true,
              },
            },
            text: true,
          },
        },
        likes: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    if (post.isPublished) {
      return post;
    } else if (post.author.id === user.id) {
      return post;
    } else {
      throw new NotFoundError("Post Not Found");
    }
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("Post not Found");
    } else if (e instanceof NotFoundError) {
      throw e;
    }
    throw new InternalServerError();
  }
}

async function editPost(id, data) {
  try {
    return await prisma.post.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        photoUrl: true,
        text: true,
        createdAt: true,
        isPublished: true,
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
      },
    });
  } catch (e) {
    console.log(e);
    if (e.code === "P2025") {
      throw new NotFoundError("Post not found");
    }
    throw new InternalServerError();
  }
}

async function deletePost(id) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("Post not found");
    }
    throw new InternalServerError();
  }
}

export { getUserPosts, getAllPosts, createPost, getPost, editPost, deletePost };
