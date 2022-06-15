import { NextFunction, Request, Response } from "express";
import { IOng, IOngUpdate } from "../types/ong.types";
import * as services from "@/api/services/ongs.service";

export const checkIfExistOngByDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { document } = req.body;
  if (!document)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const ong = await services.checkIfExistOngByDocument(document);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error("Error checking if ong exists: ", error);
    next(error);
  }
};

export const createOng = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as IOng;
  if (!data) return res.status(400).json({ error: "Missing required fields" });

  try {
    const createdOng = await services.createOng(data);
    res.status(201).json(createdOng);
  } catch (error: any) {
    console.error("Error creating ong: ", error);
    next(error);
  }
};

export const loginOng = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { document, password } = req.body;
  if (!document || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const ong = await services.loginOng({ document, password });
    res.status(200).json(ong);
  } catch (error: any) {
    console.error("Error logging ong: ", error);
    next(error);
  }
};

export const findAllOngs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ongs = await services.findAllOngs();
    res.status(200).json(ongs);
  } catch (error: any) {
    console.error("Error find all ongs: ", error);
    next(error);
  }
};

export const findOngById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  try {
    const ong = await services.findOngById(id);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error("Error find ong by id: ", error);
    next(error);
  }
};

export const findOngByDistance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    console.error("Error find ong by distance: ", error);
    next(error);
  }
};

export const updateOng = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  const data = req.body as IOngUpdate;
  if (!data) return res.status(400).json({ error: "Missing required fields" });

  try {
    const ong = await services.updateOng(id, data);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error("Error update ong: ", error);
    next(error);
  }
};

export const deleteOng = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing required fields" });

  try {
    const ong = await services.deleteOng(id);
    res.status(200).json(ong);
  } catch (error: any) {
    console.error("Error delete ong: ", error);
    next(error);
  }
};
