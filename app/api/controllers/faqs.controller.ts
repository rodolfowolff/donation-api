import { Request, Response } from "express";
import { IFaq } from "../types/faq.type";
import * as services from "../services/faqs.service";

export const createFaq = async (req: Request, res: Response) => {
  const data = req.body as IFaq;

  try {
    const createdFaq = await services.createFaq(data);
    res.status(201).json(createdFaq);
  } catch (error: any) {
    console.error('Error creating faq: ', error);
    res.status(500).json({
      message: 'Error creating faq',
      error: error.message,
    });
  }
}

export const getAllFaqs = async (req: Request, res: Response) => {
  const { type } = req.query as { type: IFaq["type"] };

  try {
    const faqs = await services.getAllFaqs(type);
    res.status(200).json(faqs);
  } catch (error: any) {
    console.error('Error getting faqs: ', error);
    res.status(500).json({
      message: 'Error getting faqs',
      error: error.message,
    });
  }
}

export const updateFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as IFaq;

  try {
    const updatedFaq = await services.updateFaq(id, data);
    res.status(200).json(updatedFaq);
  } catch (error: any) {
    console.error('Error updating faq: ', error);
    res.status(500).json({
      message: 'Error updating faq',
      error: error.message,
    });
  }
}

export const deleteFaq = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedFaq = await services.deleteFaq(id);
    res.status(200).json(deletedFaq);
  } catch (error: any) {
    console.error('Error deleting faq: ', error);
    res.status(500).json({
      message: 'Error deleting faq',
      error: error.message,
    });
  }
}
