import { IOngBank } from "../types/ongBank.type";
import { prisma } from "@/database/prismaClient";

export const createOngBank = async (id: string, data: IOngBank) => {
  if (!id || id.length < 36) throw new Error("Invalid id")

  if (!data.bankName || 
      !data.agency || 
      !data.account || 
      !data.owner || 
      !data.ownerDocument || 
      !data.pixKeyType || 
      !data.pixKey)
    throw new Error("Bank name, agency, account, owner, owner document, pix key type and pix key are required");

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      ongId: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: data.ownerDocument,
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      deletedAt: null
    },
  });

  if (checkIfExistOngBank) throw new Error("Ong bank already exist");

  await prisma.ongBankAccount.create({
    data: {
      ongId: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: data.ownerDocument,
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
    },
  });

  return {
    message: "Ong bank created successfully",
  };
}

export const getOngBank = async (id: string) => {
  if (!id || id.length < 36) throw new Error("Invalid id")

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

  if (!ongBank) throw new Error("Ong bank not found");

  return ongBank;
}

export const updateOngBank = async (id: string, data: IOngBank) => {
  if (!id || id.length < 36) throw new Error("Invalid id")

  if (!data.bankName ||
      !data.agency ||
      !data.account ||
      !data.owner ||
      !data.ownerDocument ||
      !data.pixKeyType ||
      !data.pixKey)
    throw new Error("Bank name, agency, account, owner, owner document, pix key type and pix key are required");

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      ongId: id,
      bankName: data.bankName,
      agency: data.agency,
      account: data.account,
      owner: data.owner,
      ownerDocument: data.ownerDocument,
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      deletedAt: null
    },
  });

  if (!checkIfExistOngBank) throw new Error("Ong bank not found");

  if (data.bankName === checkIfExistOngBank.bankName &&
      data.agency === checkIfExistOngBank.agency &&
      data.account === checkIfExistOngBank.account &&
      data.owner === checkIfExistOngBank.owner &&
      data.ownerDocument === checkIfExistOngBank.ownerDocument &&
      data.pixKeyType === checkIfExistOngBank.pixKeyType &&
      data.pixKey === checkIfExistOngBank.pixKey) {
    throw new Error("No changes detected");
  }

  await prisma.ongBankAccount.update({
    where: {
      id: checkIfExistOngBank.id,
    },
    data: {
      bankName: data.bankName === "" || data.bankName === checkIfExistOngBank.bankName
          ? undefined
          : data.bankName,
      agency: data.agency === "" || data.agency === checkIfExistOngBank.agency
          ? undefined
          : data.agency,
      account: data.account === "" || data.account === checkIfExistOngBank.account
          ? undefined
          : data.account,
      owner: data.owner === "" || data.owner === checkIfExistOngBank.owner
          ? undefined
          : data.owner,
      ownerDocument: data.ownerDocument === "" || data.ownerDocument === checkIfExistOngBank.ownerDocument
          ? undefined
          : data.ownerDocument,
      pixKeyType: data.pixKeyType === "" || data.pixKeyType === checkIfExistOngBank.pixKeyType
          ? undefined
          : data.pixKeyType,
      pixKey: data.pixKey === "" || data.pixKey === checkIfExistOngBank.pixKey
          ? undefined
          : data.pixKey,
    },
  });

  return {
    message: "Ong bank updated successfully",
  };
}

export const deleteOngBank = async (id: string) => {
  if (!id || id.length < 36) throw new Error("Invalid id")

  const checkIfExistOngBank = await prisma.ongBankAccount.findFirst({
    where: {
      id: id,
      deletedAt: null,
    },
  });

  if (!checkIfExistOngBank) throw new Error("Ong bank not found");

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
}
