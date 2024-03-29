import { Express } from "express";
import * as controller from "@/api/controllers/users.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const usersRoutes = (app: Express) => {
  app.route("/users/check").post(controller.checkIfUserExistsByDocument);

  app.route("/users/register").post(controller.createUser);

  app.route("/users/login").post(controller.loginUser);

  app
    .route("/users/findall")
    .get(verifyAuthentication, controller.findAllUsers);

  app.route("/users/:id").get(verifyAuthentication, controller.findUserById);

  app.route("/users/:id").put(verifyAuthentication, controller.updateUser);

  app.route("/users/:id").delete(verifyAuthentication, controller.deleteUser);

  app.route("/zipcode/:number").get(controller.findAddressByZipCod);
};

export default usersRoutes;
