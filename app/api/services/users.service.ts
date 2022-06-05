import { prisma } from "@/database/prismaClient";
import { IUser } from "@/api/controllers/users.controller";

export const createUser = async ({name, email, password}: IUser) => {
  if (!name || !email || !password) {
   return {
      message: "Missing required fields",
      status: 400,
    };
  }

  if (name.length < 3) {
    return {
      message: "Name must be at least 3 characters",
      status: 400,
    };
  }

  if (!email.includes("@")) {
    return {
      message: "Email must be valid",
      status: 400,
    };
  }

  if (password.length < 8) {
    return {
      message: "Password must be at least 8 characters",
      status: 400,
    };
  }

  const verifyIfUserExists = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (verifyIfUserExists) {
    return {
      message: "User already exists",
      status: 400,
    };
  }

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  } as any);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export const findAllUsers = async () => {
  return await prisma.user.findMany(
    {
      where: {
        active: true,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    }
  );
}

export const findUserById = async (id: string) => {
  if (id.length < 36) {
    return {
      message: "Invalid id",
      status: 400,
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      id: id,
      active: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (!user) {
    return {
      message: "User not found",
      status: 404,
    };
  }

  return user;
}
