import prisma from "../config/prisma.js";
import ConflictError from "../errors/conflictError.js";
import InternalServerError from "../errors/nternalServerError.js";

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
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    throw new InternalServerError();
  }
}

async function getUserByUsername(username) {
  try {
    return await prisma.user.findUnique({ where: { username } });
  } catch {
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
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError();
  }
}

export { createUser, deleteUser, getUserByUsername, getUserById, editUser };
