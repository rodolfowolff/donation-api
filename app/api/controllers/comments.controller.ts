import { Request, Response, NextFunction } from "express";
import { IComments } from "../types/comments.type";
import * as services from "../services/comments.service";
import { decodeToken } from "../middlewares/authentication";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(400).json({ error: "Missing required fields" });

  const { id }: any = decodeToken(authorization);
  if (!id) return res.status(400).json({ error: "Token invalid" });

  const data = req.body as IComments;
  if (!data) return res.status(400).json({ error: "Missing required fields" });

  try {
    const createdComments = await services.createComment(id, data);
    res.status(201).json(createdComments);
  } catch (error: any) {
    console.error("Error creating comments: ", error);
    next(error);
  }
};

export const listComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(400).json({ error: "Missing required fields" });

  const { id }: any = decodeToken(authorization);
  if (!id) return res.status(400).json({ error: "Token invalid" });

  try {
    const comments = await services.listComments(id);
    res.status(200).json(comments);
  } catch (error: any) {
    console.error("Error getting comments: ", error);
    next(error);
  }
};

// export const updateFaq = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   if (!id) return res.status(400).json({ error: "Missing required fields" });

//   if (
//     !id.match(
//       /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
//     )
//   )
//     return res.status(400).json({ error: "Invalid id code" });

//   const data = req.body as IComments;

//   try {
//     const updatedFaq = await services.updateFaq(id, data);
//     res.status(200).json(updatedFaq);
//   } catch (error: any) {
//     console.error("Error updating faq: ", error);
//     next(error);
//   }
// };

// export const deleteFaq = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   if (!id) return res.status(400).json({ error: "Missing required fields" });

//   if (
//     !id.match(
//       /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
//     )
//   )
//     return res.status(400).json({ error: "Invalid id code" });

//   try {
//     const deletedFaq = await services.deleteFaq(id);
//     res.status(200).json(deletedFaq);
//   } catch (error: any) {
//     console.error("Error deleting faq: ", error);
//     next(error);
//   }
// };
