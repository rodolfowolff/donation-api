import { Request, Response, NextFunction } from "express";
import { IOngBank } from "../types/ongBank.type";
import * as services from "../services/ongBank.service";

export const createOngBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  const data = req.body as IOngBank;
  if (!data) return res.status(400).json({ error: "Missing required fields" });

  try {
    const createdOngBank = await services.createOngBank(id, data);
    res.status(201).json(createdOngBank);
  } catch (error: any) {
    console.error("Error creating ong bank: ", error);
    next(error);
  }
};

export const getOngBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  try {
    const ongBank = await services.getOngBank(id);
    res.status(200).json(ongBank);
  } catch (error: any) {
    console.error("Error getting ong bank: ", error);
    next(error);
  }
};

export const updateOngBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  const data = req.body as IOngBank;
  if (!data) return res.status(400).json({ error: "Missing required fields" });

  try {
    const updatedOngBank = await services.updateOngBank(id, data);
    res.status(200).json(updatedOngBank);
  } catch (error: any) {
    console.error("Error updating ong bank: ", error);
    next(error);
  }
};

export const deleteOngBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  try {
    const deletedOngBank = await services.deleteOngBank(id);
    res.status(200).json(deletedOngBank);
  } catch (error: any) {
    console.error("Error deleting ong bank: ", error);
    next(error);
  }
};
