import { Express } from "express";
import * as controller from "@/api/controllers/ongs.controller";

const ongsRoutes = (app: Express) => {
  app.route("/ongs").post(controller.createOng);

  app.route("/ongs/login").post(controller.loginOng);

  app.route("/ongs").get(controller.findAllOngs);

  app.route("/ongs/:id").get(controller.findOngById);

  app.route("/ongs/:id").put(controller.updateOng);

  app.route("/ongs/:id").delete(controller.deleteOng);
}

export default ongsRoutes;
