import bcrypt from "bcrypt";
import { cpfCnpjUnmask, telephoneUnmask, cepUnmask } from 'js-essentials-functions'

import { prisma } from "@/database/prismaClient";
import { createToken } from "@/utils/jwt";
import { IOng, IOngUpdate } from "../types/ong.types";

export const createOng = async (data: IOng) => {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Missing required fields");
  }

  // TODO: Create function to check data for validations (email, password, address, etc)

  if (data.name.length < 3 || data.name.length > 80) {
    throw new Error("Name must be at least 3 characters and at most 80 characters");
  }

  if (!data.email.includes("@") || !data.email.includes(".") || data.email.length < 5 || data.email.length > 50) {
    throw new Error("Email must be valid and at least 5 characters and at most 50 characters");
  }

  if (data.password.length < 8 || data.password.length > 20) {
    throw new Error("Password must be at least 8 characters and less than 20 characters");
  }

  const verifyIfOngExists = await prisma.ong.findFirst({
    where: {
      OR: [
        { email: data.email },
        { 
          ongPersonalData: {
            document: data.document 
          }
        }
      ]
    }
  });

  if (verifyIfOngExists) {
    throw new Error("Ong already exists");
  }


  const hashedPassword = await bcrypt.hash(data.password, 10);
  const documentUnmasked = cpfCnpjUnmask(data.document);
  const phoneUnmasked = telephoneUnmask(data.phone);
  const telephoneUnmasked = telephoneUnmask(data.telephone);
  const cepUnmasked = cepUnmask(data.address.zipCode);

  await prisma.ong.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      ongPersonalData: {
        create: {
          document: documentUnmasked,
          description: data.description,
          phone: phoneUnmasked,
          telephone:telephoneUnmasked,
          website: data.website,
          facebook: data.facebook,
          instagram: data.instagram,
        }
      },
      ongAddress: {
        create: {
          zipCode: cepUnmasked,
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement || null,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        }
      }
    },
  } as any);

  return {
    message: "Ong created successfully",
  }
}

export const loginOng = async (email: string, password: string) => {
  const ong = await prisma.ong.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      status: true,
    }
  });

  if (!ong) {
    throw new Error("Ong or password invalid");
  }

  if (ong.status !== "ACTIVE") {
    throw new Error("Ong is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, ong.password);

  if (!isPasswordValid) {
    throw new Error("Ong or password invalid");
  }

  const token = createToken({id: ong.id});

  return {
    ong: {
      id: ong.id,
      name: ong.name,
      email: ong.email,
    },
    token,
  };
}

export const findAllOngs = async () => {
  return await prisma.ong.findMany(
    {
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        // ongPersonalData: {
        //   select: {
        //     birthDate: true,
        //     document: true,
        //     phone: true,
        //     telephone: true,
        //   }
        // },
        // ongAddress: {
        //   select: {
        //     zipCode: true,
        //     street: true,
        //     number: true,
        //     complement: true,
        //     neighborhood: true,
        //     city: true,
        //     state: true,
        //     latitude: true,
        //     longitude: true,
        //   }
        // }
      }
    }
  );
}

export const findOngById = async (id: string) => {
  if (id.length < 36) throw new Error("Invalid id");

  const ong = await prisma.ong.findFirst({
    where: {
      id: id,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      name: true,
      email: true,
        // ongPersonalData: {
        //   select: {
        //     birthDate: true,
        //     document: true,
        //     phone: true,
        //     telephone: true,
        //   }
        // },
        // ongAddress: {
        //   select: {
        //     zipCode: true,
        //     street: true,
        //     number: true,
        //     complement: true,
        //     neighborhood: true,
        //     city: true,
        //     state: true,
        //     latitude: true,
        //     longitude: true,
        //   }
        // }
    }
  });

  if (!ong) throw new Error("Ong not found");

  return ong;
}

export const updateOng = async (id: string, data: IOngUpdate) => {
  if (id.length < 36) throw new Error("Invalid id");

  const ong = await prisma.ong.findUnique({
    where: {
      id: id,
    },
    select: {
      status: true,
      ongPersonalData: {
        select: {
          phone: true,
          telephone: true,
        }
      },
      ongAddress: {
        select: {
          zipCode: true,
          street: true,
          number: true,
          complement: true,
          neighborhood: true,
          city: true,
          state: true,
          latitude: true,
          longitude: true,
        }
      }
    }
  });

  if (!ong) throw new Error("Ong not found");

  if (ong.status !== "ACTIVE") {
    throw new Error("Ong is not active");
  }

  if (telephoneUnmask(data.phone as string) === ong.ongPersonalData?.phone &&
      telephoneUnmask(data.telephone as string) === ong.ongPersonalData?.telephone &&
      cepUnmask(data.address?.zipCode as string) === ong.ongAddress?.zipCode &&
      data.address?.street === ong.ongAddress?.street &&
      data.address?.number === ong.ongAddress?.number &&
      data.address?.complement === ong.ongAddress?.complement &&
      data.address?.neighborhood === ong.ongAddress?.neighborhood &&
      data.address?.city === ong.ongAddress?.city &&
      data.address?.state === ong.ongAddress?.state &&
      data.address?.latitude === ong.ongAddress?.latitude &&
      data.address?.longitude === ong.ongAddress?.longitude) {
    throw new Error("Address not changed");
  }

  await prisma.ong.update({
    where: {
      id: id,
    },
    data: {
      ongPersonalData: {
        update: {
          phone: data.phone === "" || telephoneUnmask(data.phone as string) === ong.ongPersonalData?.phone 
          ? null
          : telephoneUnmask(data.phone as string),
          telephone: data.telephone === "" || telephoneUnmask(data.telephone as string) === ong.ongPersonalData?.telephone 
          ? null
          : telephoneUnmask(data.telephone as string),
        } as any,
      },
      ongAddress: {
        update: {
          zipCode: data.address?.zipCode === "" || cepUnmask(data.address?.zipCode as string) === ong.ongAddress?.zipCode 
            ? undefined
            : cepUnmask(data.address?.zipCode as string),
          street: data.address?.street === "" || data.address?.street === ong.ongAddress?.street 
            ? undefined
            : data.address?.street,
          number: data.address?.number === "" || data.address?.number === ong.ongAddress?.number 
            ? undefined
            : data.address?.number,
          complement: data.address?.complement === "" || data.address?.complement === ong.ongAddress?.complement 
            ? undefined
            : data.address?.complement,
          neighborhood: data.address?.neighborhood === "" || data.address?.neighborhood === ong.ongAddress?.neighborhood 
            ? undefined
            : data.address?.neighborhood,
          city: data.address?.city === "" || data.address?.city === ong.ongAddress?.city 
            ? undefined
            : data.address?.city,
          state: data.address?.state === "" || data.address?.state === ong.ongAddress?.state 
            ? undefined
            : data.address?.state,
          latitude: data.address?.latitude === "" || data.address?.latitude === ong.ongAddress?.latitude
            ? undefined
            : data.address?.latitude,
          longitude: data.address?.longitude === "" || data.address?.longitude === ong.ongAddress?.longitude
            ? undefined
            : data.address?.longitude,
        } as any,
      }
    }
  });

  return {
    message: `Ong updated successfully`,
  }
}

export const deleteOng = async (id: string) => {
  if (id.length < 36) throw new Error("Invalid id");

  const ong = await prisma.ong.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      status: true,
    }
  });

  if (!ong) throw new Error("Ong not found");

  if (ong.status === 'INACTIVE') throw new Error("Ong already deleted");

  await prisma.ong.update({
    where: {
      id: id,
    },
    data: {
      status: 'INACTIVE',
    }
  });

  return {
    message: `Ong ${ong.name} deleted successfully`,
  }
}
