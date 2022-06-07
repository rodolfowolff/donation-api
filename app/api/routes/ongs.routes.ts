import { Express } from "express";
import * as controller from "@/api/controllers/ongs.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const ongsRoutes = (app: Express) => {
  app.route("/ongs").post(verifyAuthentication, controller.createOng);

  app.route("/ongs/login").post(verifyAuthentication, controller.loginOng);

  app.route("/ongs").get(verifyAuthentication, controller.findAllOngs);

  app.route("/ongs/distance").get(verifyAuthentication, controller.findOngByDistance);

  app.route("/ongs/:id").get(verifyAuthentication, controller.findOngById);

  app.route("/ongs/:id").put(verifyAuthentication, controller.updateOng);

  app.route("/ongs/:id").delete(verifyAuthentication, controller.deleteOng);
}

export default ongsRoutes;