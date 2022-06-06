import bcrypt from "bcrypt";
import { cpfCnpjUnmask, telephoneUnmask, cepUnmask } from 'js-essentials-functions'

import { prisma } from "@/database/prismaClient";
import { IUser, IUserUpdate } from "../types/user.types";
import { createToken } from "@/utils/jwt";

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
            document: cpfCnpjUnmask(data.document)
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

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      firstName: true,
      email: true,
      password: true,
      status: true,
    }
  });

  if (!user) {
    throw new Error("User or password invalid");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("User or password invalid");
  }

  const token = createToken({id: user.id});

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
    },
    token,
  };
}

export const findAllUsers = async () => {
  return await prisma.user.findMany(
    {
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        // userPersonalData: {
        //   select: {
        //     birthDate: true,
        //     document: true,
        //     telephone: true,
        //   }
        // },
        // userAddress: {
        //   select: {
        //     zipCode: true,
        //     street: true,
        //     number: true,
        //     complement: true,
        //     neighborhood: true,
        //     city: true,
        //     state: true,
        //   }
        // }
      }
    }
  );
}

export const findUserById = async (id: string) => {
  if (id.length < 36) throw new Error("Invalid id");

  const user = await prisma.user.findFirst({
    where: {
      id: id,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      firstName: true,
      email: true,
      // userPersonalData: {
      //   select: {
      //     birthDate: true,
      //     document: true,
      //     telephone: true,
      //   }
      // },
      // userAddress: {
      //   select: {
      //     zipCode: true,
      //     street: true,
      //     number: true,
      //     complement: true,
      //     neighborhood: true,
      //     city: true,
      //     state: true,
      //   }
      // }
    }
  });

  if (!user) throw new Error("User not found");

  return user;
}

export const updateUser = async (id: string, data: IUserUpdate) => {
  if (id.length < 36) throw new Error("Invalid id");

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      status: true,
      userPersonalData: {
        select: {
          telephone: true,
        }
      },
      userAddress: {
        select: {
          zipCode: true,
          street: true,
          number: true,
          complement: true,
          neighborhood: true,
          city: true,
          state: true,
        }
      }
    }
  });

  if (!user) throw new Error("User not found");

  if (user.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  if (telephoneUnmask(data.telephone as string) === user.userPersonalData?.telephone &&
      cepUnmask(data.address?.zipCode as string) === user.userAddress?.zipCode &&
      data.address?.street === user.userAddress?.street &&
      data.address?.number === user.userAddress?.number &&
      data.address?.complement === user.userAddress?.complement &&
      data.address?.neighborhood === user.userAddress?.neighborhood &&
      data.address?.city === user.userAddress?.city &&
      data.address?.state === user.userAddress?.state) {
    throw new Error("Address not changed");
  }

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      userPersonalData: {
        update: {
          telephone: data.telephone === "" || telephoneUnmask(data.telephone as string) === user.userPersonalData?.telephone 
          ? null
          : telephoneUnmask(data.telephone as string),
        } as any,
      },
      userAddress: {
        update: {
          zipCode: data.address?.zipCode === "" || cepUnmask(data.address?.zipCode as string) === user.userAddress?.zipCode 
            ? undefined
            : cepUnmask(data.address?.zipCode as string),
          street: data.address?.street === "" || data.address?.street === user.userAddress?.street 
            ? undefined
            : data.address?.street,
          number: data.address?.number === "" || data.address?.number === user.userAddress?.number 
            ? undefined
            : data.address?.number,
          complement: data.address?.complement === "" || data.address?.complement === user.userAddress?.complement 
            ? undefined
            : data.address?.complement,
          neighborhood: data.address?.neighborhood === "" || data.address?.neighborhood === user.userAddress?.neighborhood 
            ? undefined
            : data.address?.neighborhood,
          city: data.address?.city === "" || data.address?.city === user.userAddress?.city 
            ? undefined
            : data.address?.city,
          state: data.address?.state === "" || data.address?.state === user.userAddress?.state 
            ? undefined
            : data.address?.state,
        } as any,
      }
    }
  });

  return {
    message: `User updated successfully`,
  }
}

export const deleteUser = async (id: string) => {
  if (id.length < 36) throw new Error("Invalid id");

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      firstName: true,
      lastName: true,
      status: true,
    }
  });

  if (!user) throw new Error("User not found");

  if (user.status === 'INACTIVE') throw new Error("User already deleted");

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      status: 'INACTIVE',
    }
  });

  return {
    message: `User ${user.firstName} ${user.lastName} deleted successfully`,
  }
}
