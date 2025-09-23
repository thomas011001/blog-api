import prisma from "../config/prisma.js";
import ConflictError from "../errors/conflictError.js";
import InternalServerError from "../errors/InternalServerError.js";
import paginate from "../utils/paginate.js";
import NotFoundError from "../errors/notFoundError.js";

async function getAllUsers(
  page = 1,
  limit = 10,
  q = "",
  sortBy = "createdAt",
  sortOrder = "desc"
) {
  const where = q
    ? {
        OR: [{ username: { contains: q, mode: "insensitive" } }],
      }
    : {};

  const orderBy = { [sortBy]: sortOrder };

  const data = await paginate(prisma.user, {
    limit,
    page,
    where,
    orderBy,
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  for (const user of data.data) {
    user._count.likes = await prisma.like.count({
      where: { post: { authorId: user.id } },
    });
  }

  return data;
}

async function createUser(data) {
  try {
    return await prisma.user.create({ data });
  } catch (e) {
    if (e.code === "P2002" && e.meta?.target?.includes("username")) {
      throw new ConflictError("Username is already taken.");
    }
    throw new InternalServerError();
  }
}

async function getUserById(id) {
  try {
    const data = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        username: true,
        isAuthor: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    data._count.likes = await prisma.like.count({
      where: {
        post: {
          authorId: id,
        },
      },
    });

    return data;
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

async function getUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundError("User Not Found");
    }
    return user;
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw e;
    }
    throw new InternalServerError();
  }
}

async function deleteUser(id) {
  try {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

async function editUser(data, id) {
  try {
    const data = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        avatarUrl: true,
        username: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    data._count.likes = await prisma.like.count({
      where: {
        post: {
          authorId: id,
        },
      },
    });

    return data;
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export {
  createUser,
  deleteUser,
  getUserByUsername,
  getUserById,
  editUser,
  getAllUsers,
};
