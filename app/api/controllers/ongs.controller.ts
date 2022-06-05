import { Request, Response } from "express";
import * as services from '@/api/services/ongs.service'
import { IOng, IOngUpdate } from "../types/ong.types";

export const createOng = async (req: Request, res: Response) => {
  const data = req.body as IOng;

  try {
    const createdOng = await services.createOng(data);
    res.status(201).json(createdOng);
  } catch (error: any) {
    console.error('Error creating user: ', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
}

export const loginOng = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await services.loginOng(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error logging user: ', error);
    res.status(500).json({
      message: 'Error logging user',
      error: error.message,
    });
  }
}

export const findAllOngs = async (_req: Request, res: Response) => {
  try {
    const users = await services.findAllOngs();
    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error find all user: ', error);
    res.status(500).json({
      message: "Error find all user",
      error: error.message,
    });
  }
}

export const findOngById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await services.findOngById(id);
    res.status(200).json(user);
  } catch (error : any) {
    console.error('Error find user by id: ', error);
    res.status(500).json({
      message: 'Error find user by id',
      error: error.message,
    });
  }
}

export const updateOng = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IOngUpdate;

  try {
    const user = await services.updateOng(id, data);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error update user: ', error);
    res.status(500).json({
      message: 'Error update user',
      error: error.message,
    });
  }
}

export const deleteOng = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await services.deleteOng(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error delete user: ', error);
    res.status(500).json({
      message: 'Error delete user',
      error: error.message,
    });
  }
}
