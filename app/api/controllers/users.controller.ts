import { Request, Response } from "express";
import * as services from '@/api/services/users.service'

export interface IUserAddress {
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  document: string;
  birthDate: string;
  telephone: string;
  address: IUserAddress;
}

export const createUser = async (req: Request, res: Response) => {
  const data = req.body as IUser;

  try {
    const createdUser = await services.createUser(data);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).send({
      message: "Error creating user",
    });
  }
}

export const findAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await services.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error find all user: ', error);
    res.status(500).send({
      message: "Error find all user",
    });
  }
}

export const findUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await services.findUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error('User not found: ', error);
    res.status(500).send({
      message: 'User not found',
    });
  }
}
