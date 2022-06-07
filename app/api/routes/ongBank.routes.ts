import { Express } from "express";
import * as controller from "@/api/controllers/ongBank.controller";
import { verifyAuthentication } from "../middlewares/authentication";

export const ongBankRoutes = (app: Express) => {
  app.route("/ongs/:id/bank").post(verifyAuthentication, controller.createOngBank);
  app.route("/ongs/:id/bank").get(verifyAuthentication, controller.getOngBank);
  app.route("/ongs/:id/bank/:id").put(verifyAuthentication, controller.updateOngBank);
  app.route("/ongs/:id/bank/:id").delete(verifyAuthentication, controller.deleteOngBank);
}

export default ongBankRoutes;