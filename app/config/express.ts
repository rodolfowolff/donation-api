import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import createError from "http-errors";
const rateLimit = require("express-rate-limit");

dotenv.config();

// Routes
import usersRoutes from "@/api/routes/users.routes";
import ongsRoutes from "@/api/routes/ongs.routes";
import faqsRoutes from "@/api/routes/faqs.routes";
import ongBankRoutes from "@/api/routes/ongBank.routes";
import donationsRoutes from "@/api/routes/donations.routes";
import commentsRoutes from "@/api/routes/comments.routes";

export default (): Express => {
  const app = express();

  // Create the rate limit rule
  const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Your limit exceeded",
    statusCode: 429,
    headers: true,
  });

  app.set("port", process.env.PORT || 3000);
  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(apiRequestLimiter);

  // Routes
  usersRoutes(app);
  ongsRoutes(app);
  faqsRoutes(app);
  ongBankRoutes(app);
  donationsRoutes(app);
  commentsRoutes(app);

  // Error Handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(createError(404));
  });

  app.use((error: any, _req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({ status: error.status || 500, message: error.message });

    return next();
  });

  return app;
};
