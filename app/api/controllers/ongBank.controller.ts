import { Request, Response } from "express";
import { IOngBank } from "../types/ongBank.type";
import * as services from "../services/ongBank.service";

export const createOngBank = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IOngBank;

  try {
    const createdOngBank = await services.createOngBank(id, data);
    res.status(201).json(createdOngBank);
  } catch (error: any) {
    console.error('Error creating ong bank: ', error);
    res.status(500).json({
      message: 'Error creating ong bank',
      error: error.message,
    });
  }
}

export const getOngBank = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ongBank = await services.getOngBank(id);
    res.status(200).json(ongBank);
  } catch (error: any) {
    console.error('Error getting ong bank: ', error);
    res.status(500).json({
      message: 'Error getting ong bank',
      error: error.message,
    });
  }
}

export const updateOngBank = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IOngBank;

  try {
    const updatedOngBank = await services.updateOngBank(id, data);
    res.status(200).json(updatedOngBank);
  } catch (error: any) {
    console.error('Error updating ong bank: ', error);
    res.status(500).json({
      message: 'Error updating ong bank',
      error: error.message,
    });
  }
}

export const deleteOngBank = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const deletedOngBank = await services.deleteOngBank(id);
    res.status(200).json(deletedOngBank);
  } catch (error: any) {
    console.error('Error deleting ong bank: ', error);
    res.status(500).json({
      message: 'Error deleting ong bank',
      error: error.message,
    });
  }
}
