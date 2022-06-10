import { Request, Response, NextFunction } from "express";
import { decodeToken } from "@/api/middlewares/authentication";
import { IDonation } from "../types/donation.type";
import * as services from "../services/donations.service";

export const createDonaiton = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const data = req.body as IDonation;

  const { id }: any = decodeToken(authorization as string);
  if (!id) throw new Error("Invalid token");

  try {
    const createdFaq = await services.createDonation(id, data);
    res.status(201).json(createdFaq);
  } catch (error: any) {
    console.error("Error creating donation: ", error);
    next(error);
  }
};

export const getUserDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const { id }: any = decodeToken(authorization as string);

  if (!id) throw new Error("Invalid token");

  try {
    const donations = await services.getUserDonation(id);
    res.status(200).json(donations);
  } catch (error: any) {
    console.error("Error getting user donations: ", error);
    next(error);
  }
};

export const listOngDonations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const { id }: any = decodeToken(authorization as string);

  if (!id) throw new Error("Invalid token");

  try {
    const donations = await services.listOngDonations(id);
    res.status(200).json(donations);
  } catch (error: any) {
    console.error("Error getting Ong donations: ", error);
    next(error);
  }
};

export const getDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const { id }: any = decodeToken(authorization as string);

  if (!id) throw new Error("Invalid token");

  const donationId = req.params.id;

  try {
    const donations = await services.getDonation(id, donationId);
    res.status(200).json(donations);
  } catch (error: any) {
    console.error("Error getting Ong donations: ", error);
    next(error);
  }
};

export const updateDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const { id }: any = decodeToken(authorization as string);

  if (!id) throw new Error("Invalid token");

  const donationId = req.params.id;
  const data = req.body as IDonation;

  try {
    const donations = await services.updateDonation(id, donationId, data);
    res.status(200).json(donations);
  } catch (error: any) {
    console.error("Error getting Ong donations: ", error);
    next(error);
  }
};

export const deleteDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const { id }: any = decodeToken(authorization as string);

  if (!id) throw new Error("Invalid token");

  const donationId = req.params.id;

  try {
    const donations = await services.deleteDonation(id, donationId);
    res.status(200).json(donations);
  } catch (error: any) {
    console.error("Error getting Ong donations: ", error);
    next(error);
  }
};