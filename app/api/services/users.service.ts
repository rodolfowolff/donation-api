import bcrypt from "bcrypt";
import {
  cpfCnpjUnmask,
  telephoneUnmask,
  cepUnmask,
} from "js-essentials-functions";

import { prisma } from "@/database/prismaClient";
import { IUser, IUserUpdate } from "../types/user.types";
import { createToken } from "@/utils/jwt";
import createError from "http-errors";

export const checkIfUserExistsByDocument = async (document: string) => {
  const documentUnmasked = cpfCnpjUnmask(document || "");
  if (!documentUnmasked) throw createError(400, "Invalid document");

  const userExist = await prisma.user.findFirst({
    where: {
      document: documentUnmasked,
    },
    select: {
      firstName: true,
      status: true,
    },
  });

  if (!userExist)
    return {
      status: false,
    };

  if (userExist.status !== "ACTIVE")
    throw createError(403, "User not active, please contact the administrator");

  return {
    status: true,
    name: userExist.firstName,
  };
};

export const createUser = async (data: IUser) => {
  if (
    !data.firstName ||
    !data.lastName ||
    !data.document ||
    !data.email ||
    !data.password ||
    !data.telephone
  ) {
    throw createError(400, "Missing required fields");
  }

  // TODO: Create function to check data for validations (email, password, address, etc)

  if (
    data.firstName.length < 3 ||
    data.firstName.length > 20 ||
    data.lastName.length < 3 ||
    data.lastName.length > 20
  ) {
    throw createError(
      400,
      "First and last name must be at least 3 characters and at most 20 characters"
    );
  }

  if (
    !data.email.includes("@") ||
    !data.email.includes(".") ||
    data.email.length < 5 ||
    data.email.length > 50
    // !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i)
  ) {
    throw createError(400, "Email must be valid");
  }

  if (data.password.length < 8 || data.password.length > 20) {
    throw createError(
      400,
      "Password must be at least 8 characters and less than 20 characters"
    );
  }

  if (telephoneUnmask(data.telephone).length !== 11) {
    throw createError(400, "Telephone must be 11 characters long");
  }

  const verifyIfUserExists = await prisma.user.findFirst({
    where: {
      OR: [
        { document: cpfCnpjUnmask(data.document || "") },
        {
          userPersonalData: {
            email: data.email,
          },
        },
      ],
    },
  });

  if (verifyIfUserExists) throw createError(400, "User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const documentUnmasked = cpfCnpjUnmask(data.document || "");
  const telephoneUnmasked = telephoneUnmask(data.telephone || "");
  const cepUnmasked = cepUnmask(data.address.zipCode || "");

  const createUser = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      document: documentUnmasked,
      password: hashedPassword,
      userPersonalData: {
        create: {
          email: data.email,
          birthDate: data.birthDate,
          telephone: telephoneUnmasked,
        },
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
        },
      },
    },
  } as any);

  if (!createUser) throw createError(500, "Error creating user");

  const token = createToken({ id: createUser.id });

  return {
    user: createUser.firstName,
    token,
  };
};

export const loginUser = async ({
  document,
  password,
}: {
  document: string;
  password: string;
}) => {
  const documentUnmasked = cpfCnpjUnmask(document || "");
  if (!documentUnmasked) throw createError(400, "Document is invalid");

  const user = await prisma.user.findFirst({
    where: {
      document: cpfCnpjUnmask(document),
    },
    select: {
      id: true,
      firstName: true,
      document: true,
      password: true,
      status: true,
      userPersonalData: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!user) {
    throw createError(400, "User or password invalid");
  }

  if (user.status !== "ACTIVE") {
    throw createError(400, "User is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createError(400, "User or password invalid");
  }

  const token = createToken({ id: user.id });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      userPersonalData: {
        email: user?.userPersonalData?.email,
      },
    },
    token,
  };
};

export const findAllUsers = async () => {
  return await prisma.user.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      firstName: true,
      userPersonalData: {
        select: {
          email: true,
          //     birthDate: true,
          //     document: true,
          //     telephone: true,
        },
      },
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
    },
  });
};

export const findUserById = async (id: string) => {
  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  const user = await prisma.user.findFirst({
    where: {
      id: id,
      status: "ACTIVE",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      document: true,
      userPersonalData: {
        select: {
          email: true,
          birthDate: true,
          telephone: true,
        },
      },
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
    },
  });

  if (!user) throw createError(404, "User not found");

  return user;
};

export const updateUser = async (id: string, data: IUserUpdate) => {
  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      status: true,
      userPersonalData: {
        select: {
          email: true,
          telephone: true,
        },
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
        },
      },
    },
  });

  if (!user) throw createError(404, "User not found");

  if (user.status !== "ACTIVE") {
    throw createError(400, "User is not active");
  }

  if (
    (!data.email || data.email !== user.userPersonalData?.email) &&
    (!data.telephone ||
      telephoneUnmask(data.telephone || "") ===
        user.userPersonalData?.telephone) &&
    (!data.address?.zipCode ||
      cepUnmask(data.address?.zipCode || "") === user.userAddress?.zipCode) &&
    !data.address?.street &&
    data.address?.street === user.userAddress?.street &&
    !data.address?.number &&
    data.address?.number === user.userAddress?.number &&
    !data.address?.complement &&
    data.address?.complement === user.userAddress?.complement &&
    !data.address?.neighborhood &&
    data.address?.neighborhood === user.userAddress?.neighborhood &&
    !data.address?.city &&
    data.address?.city === user.userAddress?.city &&
    !data.address?.state &&
    data.address?.state === user.userAddress?.state
  ) {
    throw createError(400, "Address not changed");
  }

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      userPersonalData: {
        update: {
          email:
            !data.email ||
            data.email === "" ||
            data.email === user.userPersonalData?.email
              ? undefined
              : data.email,
          telephone:
            !data.telephone ||
            data.telephone === "" ||
            telephoneUnmask(data.telephone || "") ===
              user.userPersonalData?.telephone
              ? undefined
              : telephoneUnmask(data.telephone || ""),
        } as any,
      },
      userAddress: {
        update: {
          zipCode:
            !data.address?.zipCode ||
            cepUnmask(data.address?.zipCode || "") === user.userAddress?.zipCode
              ? undefined
              : cepUnmask(data.address?.zipCode || ""),
          street:
            !data.address?.street ||
            data.address?.street === user.userAddress?.street
              ? undefined
              : data.address?.street,
          number:
            !data.address?.number ||
            data.address?.number === user.userAddress?.number
              ? undefined
              : data.address?.number,
          complement:
            !data.address?.complement ||
            data.address?.complement === user.userAddress?.complement
              ? undefined
              : data.address?.complement,
          neighborhood:
            !data.address?.neighborhood ||
            data.address?.neighborhood === user.userAddress?.neighborhood
              ? undefined
              : data.address?.neighborhood,
          city:
            !data.address?.city || data.address?.city === user.userAddress?.city
              ? undefined
              : data.address?.city,
          state:
            !data.address?.state ||
            data.address?.state === user.userAddress?.state
              ? undefined
              : data.address?.state,
        } as any,
      },
    },
  });

  return {
    message: `User updated successfully`,
  };
};

export const deleteUser = async (id: string) => {
  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      firstName: true,
      lastName: true,
      status: true,
    },
  });

  if (!user) throw createError(404, "User not found");

  if (user.status === "INACTIVE")
    throw createError(400, "User already deleted");

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return {
    message: `User ${user.firstName} ${user.lastName} deleted successfully`,
  };
};
