import { Express } from "express";
import * as controller from "@/api/controllers/donations.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const faqsRoutes = (app: Express) => {
  app.route("/donations").post(verifyAuthentication, controller.createDonaiton);

  app
    .route("/donations/user/:id")
    .get(verifyAuthentication, controller.getUserDonation);

  app
    .route("/donations/ong")
    .get(verifyAuthentication, controller.listOngDonations);

  app.route("/donations/:id").get(verifyAuthentication, controller.getDonation);

  app
    .route("/donations/:id")
    .put(verifyAuthentication, controller.updateDonation);

  app
    .route("/donations/:id")
    .delete(verifyAuthentication, controller.deleteDonation);
};

export default faqsRoutes;
