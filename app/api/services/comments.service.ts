import createError from "http-errors";
import { IComments } from "../types/comments.type";
import { prisma } from "@/database/prismaClient";
import { findOngById } from "@/api/services/ongs.service";
import { findUserById } from "./users.service";

export const createComment = async (id: string, data: IComments) => {
  if (!data.ongId || !data.comment)
    throw createError(400, "Missing id or comment");

  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ) ||
    data.ongId.length !== 36 ||
    !data.ongId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  const checkExistUser = await findUserById(id);
  if (!checkExistUser) throw createError(404, "User not found");

  const checkExistOng = await findOngById(data.ongId as any);
  if (!checkExistOng) throw createError(404, "Ong not found");

  await prisma.comment.create({
    data: {
      userId: id,
      ongId: data.ongId,
      comment: data.comment,
    },
  });

  return {
    message: "Comment created successfully",
  };
};

export const listComments = async (ongId: string) => {
  const checkExistOng = await findOngById(ongId);
  if (!checkExistOng) throw createError(404, "Not a valid ong");

  const totalComments = await prisma.comment.count({ where: { ongId } });

  const comments = await prisma.comment.findMany({
    where: {
      ongId,
      status: "ACTIVE",
    },
    select: {
      comment: true,
      userId: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
        },
      },
    },
  });

  return { comments, totalComments };
};
