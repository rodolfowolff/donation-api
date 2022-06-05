import bcrypt from "bcrypt";
import { cpfCnpjUnmask, telephoneUnmask, cepUnmask } from 'js-essentials-functions'
import { prisma } from "@/database/prismaClient";
import { IUser } from "@/api/controllers/users.controller";

export const createUser = async (data: IUser) => {
  if (!data.firstName || !data.lastName || !data.email || !data.password) {
    throw new Error("Missing required fields");
  }

  // TODO: Create function to check data for validations (email, password, address, etc)

  if (data.firstName.length < 3 || 
      data.firstName.length > 20 || 
      data.lastName.length < 3 || 
      data.lastName.length > 20) {
        throw new Error("First and last name must be at least 3 characters and at most 20 characters");
  }

  if (!data.email.includes("@") || !data.email.includes(".") || data.email.length < 5 || data.email.length > 50) {
    throw new Error("Email must be valid and at least 5 characters and at most 50 characters");
  }

  if (data.password.length < 8 || data.password.length > 20) {
    throw new Error("Password must be at least 8 characters and less than 20 characters");
  }

  const verifyIfUserExists = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { 
          userPersonalData: {
            document: data.document 
          }
        }
      ]
    }
  });

  if (verifyIfUserExists) {
    throw new Error("User already exists");
  }


  const hashedPassword = await bcrypt.hash(data.password, 10);
  const documentUnmasked = cpfCnpjUnmask(data.document);
  const telephoneUnmasked = telephoneUnmask(data.telephone);
  const cepUnmasked = cepUnmask(data.address.zipCode);

  await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      userPersonalData: {
        create: {
          birthDate: data.birthDate,
          document: documentUnmasked,
          telephone:telephoneUnmasked,
        }
      },
      userAddress: {
        create: {
          zipCode: cepUnmasked,
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement || null,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
        }
      }
    },
  } as any);

  return {
    message: "User created successfully",
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
        firstName: true,
        email: true,
      }
    }
  );
}

export const findUserById = async (id: string) => {
  if (id.length < 36) throw new Error("Invalid id");

  const user = await prisma.user.findFirst({
    where: {
      id: id,
      active: true,
      deletedAt: null
    },
    select: {
      id: true,
      firstName: true,
      email: true,
    }
  });

  if (!user) throw new Error("User not found");

  return user;
}
