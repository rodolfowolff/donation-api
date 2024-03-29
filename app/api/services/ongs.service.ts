import bcrypt from "bcrypt";
import {
  cpfCnpjUnmask,
  telephoneUnmask,
  cepUnmask,
} from "js-essentials-functions";
import createError from "http-errors";

import { prisma } from "@/database/prismaClient";
import {
  verifyDocument,
  verifyGeneralText,
  verifyEmail,
  verifyPhoneNumber,
  verifyUUID,
} from "@/utils/validators";
import { createToken } from "@/utils/jwt";
import { IOng, IOngUpdate } from "../types/ong.types";

export const checkIfExistOngByDocument = async (document: string) => {
  if (!verifyDocument(document, 17, "ong"))
    throw createError(400, "Invalid document");

  const documentUnmasked = cpfCnpjUnmask(document);
  if (!documentUnmasked) throw createError(400, "Invalid document format");

  const ongExist = await prisma.ong.findFirst({
    where: {
      document: documentUnmasked,
    },
    select: {
      name: true,
      status: true,
    },
  });

  if (!ongExist)
    return {
      status: false,
    };

  if (ongExist.status !== "ACTIVE")
    throw createError(403, "Ong not active, please contact the administrator");

  return {
    status: true,
    name: ongExist.name,
  };
};

export const createOng = async (data: IOng) => {
  if (
    !data.name ||
    !data.email ||
    !data.password ||
    !data.document ||
    !data.telephone ||
    !data.description
  ) {
    throw createError(
      400,
      "Missing required fields (name, email, password, document, telephone, description)"
    );
  }

  if (!verifyGeneralText(data.name, 3, 50))
    throw createError(400, "Invalid name");

  if (!verifyEmail(data.email)) throw createError(400, "Invalid email");

  if (!verifyGeneralText(data.password, 8, 20))
    throw createError(400, "Invalid password");

  if (!verifyDocument(data.document, 17, "ong"))
    throw createError(400, "Invalid document");

  if (!verifyPhoneNumber(data.telephone))
    throw createError(400, "Invalid telephone");

  if (data.address.state.length !== 2) {
    throw createError(
      400,
      "State must be 2 characters long and must be a valid state"
    );
  }

  const verifyIfOngExists = await prisma.ong.findFirst({
    where: {
      OR: [
        { document: cpfCnpjUnmask(data.document) },
        {
          ongPersonalData: {
            email: data.email,
          },
        },
      ],
    },
  });

  if (verifyIfOngExists) {
    throw createError(404, "Ong already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const documentUnmasked = cpfCnpjUnmask(data.document || "");
  const phoneUnmasked = telephoneUnmask(data.phone || "");
  const telephoneUnmasked = telephoneUnmask(data.telephone);
  const cepUnmasked = cepUnmask(data.address.zipCode || "");

  const createOng = await prisma.ong.create({
    data: {
      name: data.name,
      document: documentUnmasked,
      password: hashedPassword,
      ongPersonalData: {
        create: {
          email: data.email,
          description: data.description,
          banner: data.banner || null,
          phone: phoneUnmasked || null,
          telephone: telephoneUnmasked,
          website: data.website,
          facebook: data.facebook,
          instagram: data.instagram,
          responsible: data.responsible,
        },
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
          latitude: data.address.latitude || null,
          longitude: data.address.longitude || null,
        },
      },
    },
  } as any);

  const token = createToken({ id: createOng.id });

  return {
    ong: {
      name: createOng.name,
      email: data.email,
      telephone: telephoneUnmasked,
    },
    token,
  };
};

export const loginOng = async ({
  document,
  password,
}: {
  document: string;
  password: string;
}) => {
  if (!document || !password) throw createError(400, "Missing required fields");

  const documentUnmasked = cpfCnpjUnmask(document);
  if (!documentUnmasked) throw createError(400, "Document is invalid");

  const ong = await prisma.ong.findFirst({
    where: {
      document: documentUnmasked,
    },
    select: {
      id: true,
      name: true,
      password: true,
      status: true,
      ongPersonalData: {
        select: {
          email: true,
          telephone: true,
        },
      },
    },
  });

  if (!ong) {
    throw createError(400, "Ong or password invalid");
  }

  if (ong.status !== "ACTIVE") {
    throw createError(400, "Ong is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, ong.password);

  if (!isPasswordValid) {
    throw createError(400, "Ong or password invalid");
  }

  const token = createToken({ id: ong.id });

  return {
    ong: {
      id: ong.id,
      name: ong.name,
    },
    ongPersonalData: {
      email: ong?.ongPersonalData?.email,
      telephone: ong?.ongPersonalData?.telephone,
    },
    token,
  };
};

export const findAllOngs = async (name?: string) => {
  return await prisma.ong.findMany({
    where: {
      status: "ACTIVE",
      name: {
        contains: name || "",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      ongPersonalData: {
        select: {
          description: true,
          banner: true,
        },
      },
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
      // },
      // ongBankAccount: {
      //   select: {
      //     bankName: true,
      //     agency: true,
      //     account: true,
      //     owner: true,
      //     ownerDocument: true,
      //     pixKeyType: true,
      //     pixKey: true,
      //   }
      // },
      // donation: {
      //   select: {
      //     id: true,
      //     userId: true,
      //     value: true,
      //     type: true,
      //     status: true,
      //     createdAt: true,
      //     updatedAt: true,
      //   }
      // }
    },
  });
};

export const findOngById = async (id: string) => {
  if (!verifyUUID(id)) throw createError(400, "Invalid id");

  const ong = await prisma.ong.findFirst({
    where: {
      id: id,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      ongPersonalData: {
        select: {
          email: true,
          description: true,
          banner: true,
          //     birthDate: true,
          //     document: true,
          //     phone: true,
          //     telephone: true,
        },
      },
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
      // },
      // ongBankAccount: {
      //   select: {
      //     bankName: true,
      //     agency: true,
      //     account: true,
      //     owner: true,
      //     ownerDocument: true,
      //     pixKeyType: true,
      //     pixKey: true,
      //   }
      // },
      donations: {
        select: {
          id: true,
          //     userId: true,
          //     value: true,
          //     type: true,
          //     status: true,
          //     createdAt: true,
          //     updatedAt: true,
        },
      },
      comments: {
        select: {
          comment: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
            },
          },
        },
      },
    },
  });

  if (!ong) throw createError(404, "Ong not found");

  return ong;
};

export const findOngByDistance = async ({
  latitude,
  longitude,
  distanceKm = "10",
}: {
  latitude: string;
  longitude: string;
  distanceKm?: string;
}) => {
  const ongs = await prisma.$queryRawUnsafe(
    `
    SELECT 
    ONG.name, ONG.email,
    OA."zipCode", OA."street", OA."number", OA."complement", OA."neighborhood", OA."city", OA."state",
    round(haversine($1, $2, OA.latitude, OA.longitude) * 1000) AS distance,
    OPD."description", OPD."banner", OPD."phone", OPD."telephone", OPD."website", OPD."facebook", OPD."instagram"
    FROM "ongs" AS ONG
      INNER JOIN "ong_address" AS OA ON ONG.id = OA."ongId"
      INNER JOIN "ong_personal_data" AS OPD ON ONG.id = OPD."ongId"
      INNER JOIN "ong_bank_account" AS OB ON ONG.id = OB."ongId"
      INNER JOIN "donation" AS D ON ONG.id = D."ongId"
    WHERE ONG.status = 'ACTIVE'
    AND round(haversine($1, $2, latitude, longitude) * 1000) <= $3 * 1000
    LIMIT 10;
    `,
    parseFloat(latitude),
    parseFloat(longitude),
    Number(distanceKm)
  );

  return ongs;
};

export const updateOng = async (id: string, data: IOngUpdate) => {
  if (!verifyUUID(id)) throw createError(400, "Invalid id");

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
        },
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
        },
      },
    },
  });

  if (!ong) throw createError(404, "Ong not found");

  if (ong.status !== "ACTIVE") {
    throw createError(400, "Ong is not active");
  }

  if (
    telephoneUnmask(data.phone as string) === ong.ongPersonalData?.phone &&
    telephoneUnmask(data.telephone as string) ===
      ong.ongPersonalData?.telephone &&
    cepUnmask(data.address?.zipCode as string) === ong.ongAddress?.zipCode &&
    data.address?.street === ong.ongAddress?.street &&
    data.address?.number === ong.ongAddress?.number &&
    data.address?.complement === ong.ongAddress?.complement &&
    data.address?.neighborhood === ong.ongAddress?.neighborhood &&
    data.address?.city === ong.ongAddress?.city &&
    data.address?.state === ong.ongAddress?.state &&
    data.address?.latitude === ong.ongAddress?.latitude &&
    data.address?.longitude === ong.ongAddress?.longitude
  ) {
    throw createError(400, "Address not changed");
  }

  await prisma.ong.update({
    where: {
      id: id,
    },
    data: {
      ongPersonalData: {
        update: {
          phone:
            data.phone === "" ||
            telephoneUnmask(data.phone as string) === ong.ongPersonalData?.phone
              ? null
              : telephoneUnmask(data.phone as string),
          telephone:
            data.telephone === "" ||
            telephoneUnmask(data.telephone as string) ===
              ong.ongPersonalData?.telephone
              ? null
              : telephoneUnmask(data.telephone as string),
        } as any,
      },
      ongAddress: {
        update: {
          zipCode:
            data.address?.zipCode === "" ||
            cepUnmask(data.address?.zipCode as string) ===
              ong.ongAddress?.zipCode
              ? undefined
              : cepUnmask(data.address?.zipCode as string),
          street:
            data.address?.street === "" ||
            data.address?.street === ong.ongAddress?.street
              ? undefined
              : data.address?.street,
          number:
            data.address?.number === "" ||
            data.address?.number === ong.ongAddress?.number
              ? undefined
              : data.address?.number,
          complement:
            data.address?.complement === "" ||
            data.address?.complement === ong.ongAddress?.complement
              ? undefined
              : data.address?.complement,
          neighborhood:
            data.address?.neighborhood === "" ||
            data.address?.neighborhood === ong.ongAddress?.neighborhood
              ? undefined
              : data.address?.neighborhood,
          city:
            data.address?.city === "" ||
            data.address?.city === ong.ongAddress?.city
              ? undefined
              : data.address?.city,
          state:
            data.address?.state === "" ||
            data.address?.state === ong.ongAddress?.state
              ? undefined
              : data.address?.state,
          latitude:
            data.address?.latitude === "" ||
            data.address?.latitude === ong.ongAddress?.latitude
              ? undefined
              : data.address?.latitude,
          longitude:
            data.address?.longitude === "" ||
            data.address?.longitude === ong.ongAddress?.longitude
              ? undefined
              : data.address?.longitude,
        } as any,
      },
    },
  });

  return {
    message: `Ong updated successfully`,
  };
};

export const deleteOng = async (id: string) => {
  if (!verifyUUID(id)) throw createError(400, "Invalid id");

  const ong = await prisma.ong.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      status: true,
    },
  });

  if (!ong) throw createError(404, "Ong not found");

  if (ong.status === "INACTIVE") throw createError(400, "Ong already deleted");

  await prisma.ong.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
      deletedAt: new Date(),
    },
  });

  return {
    message: `Ong ${ong.name} deleted successfully`,
  };
};
