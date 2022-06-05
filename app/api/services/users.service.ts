import { prisma } from "@/database/prismaClient";
import { IUser } from "@/api/controllers/users.controller";

export const createUser = async ({firstName, lastName, email, password}: IUser) => {
  if (!firstName || lastName || !email || !password) {
   return {
      message: "Missing required fields",
      status: 400,
    };
  }

  if (firstName.length < 3 || firstName.length > 20 || lastName.length < 3 || lastName.length > 20) {
    return {
      message: "First and last name must be at least 3 characters and at most 50 characters",
      status: 400,
    };
  }

  if (!email.includes("@") || !email.includes(".") || email.length < 5 || email.length > 50) {
    return {
      message: "Email must be valid and at least 5 characters and at most 50 characters",
      status: 400,
    };
  }

  if (password.length < 8 || password.length > 20) {
    return {
      message: "Password must be at least 8 characters and less than 20 characters",
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
