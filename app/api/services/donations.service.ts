import { IDonation } from "../types/donation.type";
import { prisma } from "@/database/prismaClient";
import { findUserById } from '../services/users.service';
import { findOngById } from "@/api/services/ongs.service";

export const createDonation = async (user: string, data: IDonation) => {
  if (!user || !data.ongId || !data.value || user.length !== 36 || data.ongId.length !== 36) 
    throw new Error("ong and value are required");

    const checkExistUser = await findUserById(user);
    if (!checkExistUser) throw new Error("User not found");

    const checkExistOng = await findOngById(data.ongId as any);
    if (!checkExistOng) throw new Error("Ong not found");

  if (data.type && data.type !== "PIX" &&
      data.type !== "CASH" &&
      data.type !== "CREDIT_CARD" &&
      data.type !== "FOOD" &&
      data.type !== "CLOTHING" &&
      data.type !== "FURNITURE" &&
      data.type !== "ELETRONIC" &&
      data.type !== "OTHER") 
    throw new Error("Invalid type");

  const countDonationUser = await prisma.donation.count({
    where: {
      userId: user,
      status: "PENDING",
      deletedAt: null
    },
  });

  if (countDonationUser >= 2) throw new Error("You already have a two pending donation");

  await prisma.donation.create({
    data: {
      userId: user,
      ongId: data.ongId,
      value: data.value,
      type: data.type
    }
  });

  return {
    message: "Donation created successfully",
  };
}

export const getUserDonation = async (user: string) => {
  if (!user || user.length !== 36) throw new Error("user is required");

  const checkExistUser = await findUserById(user);
  if (!checkExistUser) throw new Error("User not found");

  const donations = await prisma.donation.findMany({
    where: {
      userId: user,
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      value: true,
      type: true,
      status: true,
      createdAt: true,
    },
  });

  return donations;
}

export const listOngDonations = async (id: string) => {
  if (!id || id.length !== 36) throw new Error("ong is required");

  const ong = await findOngById(id);
  if (!ong) throw new Error("Ong not found or not authorized");

  const donations = await prisma.donation.findMany({
    where: {
      ongId: id,
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      userId: true,
      value: true,
      type: true,
      status: true,
      createdAt: true,
    }
  });

  return donations;
}

export const getDonation = async (id: string, donationId: string) => {
  if (!id || id.length !== 36 || !donationId || donationId.length !== 36) 
    throw new Error("ong and donation is required");

  const donation = await prisma.donation.findFirst({
    where: {
      OR: [
        {
          id: donationId,
          userId: id
        },
        {
          id: donationId,
          ongId: id
        },
      ],
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      userId: true,
      value: true,
      type: true,
      status: true,
      createdAt: true,
    }
  });

  if (!donation) throw new Error("Donation not found or not authorized");

  return donation;
}

export const updateDonation = async (id: string, donationId: string, data: IDonation) => {
  if (!id || id.length !== 36) throw new Error("ong is required");

  const ong = await findOngById(id);
  if (!ong) throw new Error("Ong not found or not authorized");

  const donations = await prisma.donation.findMany({
    where: {
      ongId: id,
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      userId: true,
      value: true,
      type: true,
      status: true,
      createdAt: true,
    }
  });

  return donations;
}

export const deleteDonation = async (id: string, donationId: string) => {
  if (!id || id.length !== 36) throw new Error("ong is required");

  const ong = await findOngById(id);
  if (!ong) throw new Error("Ong not found or not authorized");

  const donations = await prisma.donation.findMany({
    where: {
      ongId: id,
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      userId: true,
      value: true,
      type: true,
      status: true,
      createdAt: true,
    }
  });

  return donations;
}
