import { Request, Response } from "express";
import * as services from "@/api/services/users.service";
import { IUser, IUserUpdate } from "../types/user.types";

export const createUser = async (req: Request, res: Response) => {
  const data = req.body as IUser;

  try {
    const createdUser = await services.createUser(data);
    res.status(201).json(createdUser);
  } catch (error: any) {
    console.error("Error creating user: ", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { document, password } = req.body;

  try {
    const user = await services.loginUser(document, password);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error logging user: ", error);
    res.status(500).json({
      message: "Error logging user",
      error: error.message,
    });
  }
};

export const findAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await services.findAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error find all user: ", error);
    res.status(500).json({
      message: "Error find all user",
      error: error.message,
    });
  }
};

export const findUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await services.findUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error find user by id: ", error);
    res.status(500).json({
      message: "Error find user by id",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IUserUpdate;

  try {
    const user = await services.updateUser(id, data);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error update user: ", error);
    res.status(500).json({
      message: "Error update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await services.deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error delete user: ", error);
    res.status(500).json({
      message: "Error delete user",
      error: error.message,
    });
  }
};
