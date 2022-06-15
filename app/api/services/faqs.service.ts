import createError from "http-errors";
import { IFaq } from "../types/faq.type";
import { prisma } from "@/database/prismaClient";

export const createFaq = async (data: IFaq) => {
  if (!data.question || !data.answer)
    throw createError(400, "Question and answer are required");

  const checkIfExistFaq = await prisma.faq.findFirst({
    where: {
      question: data.question,
      answer: data.answer,
    },
  });

  if (checkIfExistFaq) throw createError(400, "Faq already exist");

  await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      type: data.type,
      status: data.status,
    },
  });

  return {
    message: "Faq created successfully",
  };
};

export const getAllFaqs = async (type: IFaq["type"]) => {
  const faqs = await prisma.faq.findMany({
    where: {
      type: type || "GENERAL",
      status: "ACTIVE",
    },
    select: {
      question: true,
      answer: true,
      type: true,
    },
  });

  return faqs;
};

export const updateFaq = async (id: string, data: IFaq) => {
  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  if (!data.question || !data.answer)
    throw createError(400, "Id, quertion and answer is required");

  const checkIfExistFaq = await prisma.faq.findFirst({
    where: {
      id: id,
    },
  });

  if (!checkIfExistFaq) throw createError(404, "Faq not found");

  if (
    data.question === checkIfExistFaq.question &&
    data.answer === checkIfExistFaq.answer &&
    data.status === checkIfExistFaq.status
  ) {
    throw createError(400, "No changes detected");
  }

  await prisma.faq.update({
    where: {
      id: id,
    },
    data: {
      question:
        data.question === "" || data.question === checkIfExistFaq.question
          ? undefined
          : data.question,
      answer:
        data.answer === "" || data.answer === checkIfExistFaq.answer
          ? undefined
          : data.answer,
      type: data.type === checkIfExistFaq.type ? undefined : data.type,
      status: data.status === checkIfExistFaq.status ? undefined : data.status,
    },
  });

  return {
    message: "Faq updated successfully",
  };
};

export const deleteFaq = async (id: string) => {
  if (
    id.length !== 36 ||
    !id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  )
    throw createError(400, "Invalid id");

  const checkIfExistFaq = await prisma.faq.findFirst({
    where: {
      id: id,
    },
  });

  if (!checkIfExistFaq) throw createError(404, "Faq not found");

  await prisma.faq.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return {
    message: "Faq deleted successfully",
  };
};
