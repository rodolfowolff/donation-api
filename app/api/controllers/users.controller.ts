import { Request, Response, NextFunction } from "express";
import * as services from "@/api/services/users.service";
import { IUser, IUserUpdate } from "../types/user.types";

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

  try {
    const user = await services.loginUser(document, password);
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

  try {
    const user = await services.deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error delete user: ", error);
    next(error);
  }
};
