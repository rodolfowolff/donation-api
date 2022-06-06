import { Request, Response } from "express";
import { IOng, IOngUpdate } from "../types/ong.types";
import * as services from '@/api/services/ongs.service';

export const createOng = async (req: Request, res: Response) => {
  const data = req.body as IOng;

  try {
    const createdOng = await services.createOng(data);
    res.status(201).json(createdOng);
  } catch (error: any) {
    console.error('Error creating ong: ', error);
    res.status(500).json({
      message: 'Error creating ong',
      error: error.message,
    });
  }
}

export const loginOng = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const ong = await services.loginOng(email, password);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error('Error logging ong: ', error);
    res.status(500).json({
      message: 'Error logging ong',
      error: error.message,
    });
  }
}

export const findAllOngs = async (_req: Request, res: Response) => {
  try {
    const ongs = await services.findAllOngs();
    res.status(200).json(ongs);
  } catch (error: any) {
    console.error('Error find all ongs: ', error);
    res.status(500).json({
      message: "Error find all ongs",
      error: error.message,
    });
  }
}

export const findOngById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ong = await services.findOngById(id);
    res.status(200).json(ong);
  } catch (error : any) {
    console.error('Error find ong by id: ', error);
    res.status(500).json({
      message: 'Error find ong by id',
      error: error.message,
    });
  }
}

export const findOngByDistance = async (req: Request, res: Response) => {
  const query = req.query as {
    latitude: string;
    longitude: string;
    distanceKm: string;
  };

  try {
    const ongs = await services.findOngByDistance({
      latitude: query.latitude, 
      longitude: query.longitude,
      distanceKm: query.distanceKm,
    });
    res.status(200).json(ongs);
  } catch (error: any) {
    console.error('Error find ong by distance: ', error);
    res.status(500).json({
      message: 'Error find ong by distance',
      error: error.message,
    });
  }
}

export const updateOng = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IOngUpdate;

  try {
    const ong = await services.updateOng(id, data);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error('Error update ong: ', error);
    res.status(500).json({
      message: 'Error update ong',
      error: error.message,
    });
  }
}

export const deleteOng = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ong = await services.deleteOng(id);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error('Error delete ong: ', error);
    res.status(500).json({
      message: 'Error delete ong',
      error: error.message,
    });
  }
}
