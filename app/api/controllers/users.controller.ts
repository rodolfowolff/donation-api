import { Request, Response, NextFunction } from "express";
import * as services from "@/api/services/users.service";
import { IUser, IUserUpdate } from "../types/user.types";
import findZipCode from "@/utils/findZipCode";

export const checkIfUserExistsByDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { document } = req.body;
  if (!document) return new Error("Missing required fields");

  try {
    const user = await services.checkIfUserExistsByDocument(document);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error checking if user exists: ", error);
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as IUser;

  try {
    const createdUser = await services.createUser(data);
    res.status(201).json(createdUser);
  } catch (error: any) {
    console.error("Error creating user: ", error);
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { document, password } = req.body;
  if (!document || !password) return new Error("Missing required fields");

  try {
    const user = await services.loginUser({ document, password });
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error logging user: ", error);
    next(error);
  }
};

export const findAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await services.findAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error find all user: ", error);
    next(error);
  }
};

export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Missing required fields" });

  if (
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    return res.status(400).json({ error: "Invalid id code" });

  try {
    const user = await services.findUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error find user by id: ", error);
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Missing required fields" });

  if (
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    return res.status(400).json({ error: "Invalid id code code" });

  const data = req.body as IUserUpdate;

  try {
    const user = await services.updateUser(id, data);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error update user: ", error);
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Missing required fields" });

  if (
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    return res.status(400).json({ error: "Invalid id code" });

  try {
    const user = await services.deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error delete user: ", error);
    next(error);
  }
};

export const findAddressByZipCod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { number } = req.params;

  if (!number)
    return res.status(400).json({ error: "Missing required fields" });
  if (!number.match(/^[0-9]{8}$/))
    return res.status(400).json({ error: "Invalid zip code" });

  try {
    const { data } = await findZipCode.get(`/${number}`);
    if (!data) return new Error("Invalid zip code");
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error find zip code: ", error);
    next(error);
  }
};
