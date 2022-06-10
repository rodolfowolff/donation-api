import createError from "http-errors";

import { IOngBank } from "../types/ongBank.type";
import { prisma } from "@/database/prismaClient";
import { findOngById } from "@/api/services/ongs.service";
import { cpfCnpjUnmask } from "js-essentials-functions";

export const createOngBank = async (id: string, data: IOngBank) => {
  if (!id || id.length !== 36) throw createError(400, "Invalid id");

  if (
    !data.bankName ||
    !data.agency ||
    !data.account ||
    !data.owner ||
    !cpfCnpjUnmask(data.ownerDocument) ||
    !data.pixKeyType ||
    !data.pixKey
  )
    throw createError(
      400,
      "Bank name, agency, account, owner, owner document, pix key type and pix key are required"
    );

  const ong = await findOngById(id as any);
  if (!ong) throw createError(404, "Ong not found");

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      ongId: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: cpfCnpjUnmask(data.ownerDocument),
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      deletedAt: null,
    },
  });

  if (checkIfExistOngBank) throw createError(400, "Ong bank already exist");

  await prisma.ongBankAccount.create({
    data: {
      ongId: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: cpfCnpjUnmask(data.ownerDocument),
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
    },
  });

  return {
    message: "Ong bank created successfully",
  };
};

export const getOngBank = async (id: string) => {
  if (!id || id.length !== 36) throw createError(400, "Invalid id");

  const ong = await findOngById(id as any);
  if (!ong) throw createError(404, "Ong not found");

  const ongBank = await prisma.ongBankAccount.findMany({
    where: {
      ongId: id,
      deletedAt: null,
    },
    select: {
      id: true,
      bankName: true,
      agency: true,
      account: true,
      owner: true,
      ownerDocument: true,
      pixKeyType: true,
      pixKey: true,
    },
  });

  if (!ongBank) throw createError(400, "Ong bank not found");

  return ongBank;
};

export const updateOngBank = async (id: string, data: IOngBank) => {
  if (!id || id.length !== 36) throw createError(400, "Invalid id");

  const ong = await findOngById(id as any);
  if (!ong) throw createError(404, "Ong not found");

  if (
    !data.bankName ||
    !data.agency ||
    !data.account ||
    !data.owner ||
    !cpfCnpjUnmask(data.ownerDocument) ||
    !data.pixKeyType ||
    !data.pixKey
  )
    throw createError(
      400,
      "Bank name, agency, account, owner, owner document, pix key type and pix key are required"
    );

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      id: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: cpfCnpjUnmask(data.ownerDocument),
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      deletedAt: null,
    },
  });

  if (!checkIfExistOngBank) throw createError(400, "Ong bank not found");

  if (
    data.bankName === checkIfExistOngBank.bankName &&
    data.agency === checkIfExistOngBank.agency &&
    data.account === checkIfExistOngBank.account &&
    data.owner === checkIfExistOngBank.owner &&
    data.ownerDocument === cpfCnpjUnmask(checkIfExistOngBank.ownerDocument) &&
    data.pixKeyType === checkIfExistOngBank.pixKeyType &&
    data.pixKey === checkIfExistOngBank.pixKey
  ) {
    throw createError(400, "No changes detected");
  }

  await prisma.ongBankAccount.update({
    where: {
      id: id,
    },
    data: {
      bankName:
        data.bankName === "" || data.bankName === checkIfExistOngBank.bankName
          ? undefined
          : data.bankName,
      agency:
        data.agency === "" || data.agency === checkIfExistOngBank.agency
          ? undefined
          : data.agency,
      account:
        data.account === "" || data.account === checkIfExistOngBank.account
          ? undefined
          : data.account,
      owner:
        data.owner === "" || data.owner === checkIfExistOngBank.owner
          ? undefined
          : data.owner,
      ownerDocument:
        data.ownerDocument === "" ||
        cpfCnpjUnmask(data.ownerDocument) === checkIfExistOngBank.ownerDocument
          ? undefined
          : cpfCnpjUnmask(data.ownerDocument),
      pixKeyType:
        data.pixKeyType === "" ||
        data.pixKeyType === checkIfExistOngBank.pixKeyType
          ? undefined
          : data.pixKeyType,
      pixKey:
        data.pixKey === "" || data.pixKey === checkIfExistOngBank.pixKey
          ? undefined
          : data.pixKey,
    },
  });

  return {
    message: "Ong bank updated successfully",
  };
};

export const deleteOngBank = async (id: string) => {
  if (!id || id.length !== 36) throw createError(400, "Invalid id");

  const ong = await findOngById(id as any);
  if (!ong) throw createError(404, "Ong not found");

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      id: id,
      deletedAt: null,
    },
  });

  if (!checkIfExistOngBank) throw createError(404, "Ong bank not found");

  await prisma.ongBankAccount.update({
    where: {
      id: checkIfExistOngBank.id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return {
    message: "Ong bank deleted successfully",
  };
};
