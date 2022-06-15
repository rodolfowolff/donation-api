import { Express } from "express";
import * as controller from "@/api/controllers/comments.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const commentsRoutes = (app: Express) => {
  app.route("/comments").post(verifyAuthentication, controller.createComment);

  app.route("/comments/ong").get(verifyAuthentication, controller.listComments);
};

export default commentsRoutes;
