import { Express } from "express";
import * as controller from "@/api/controllers/users.controller";
import { verifyAuthentication } from "../middlewares/authentication";

const usersRoutes = (app: Express) => {
  app.route("/users").post(controller.createUser);

  app.route("/users/login").post(controller.loginUser);

  app.route("/users").get(verifyAuthentication, controller.findAllUsers);

  app.route("/users/:id").get(verifyAuthentication, controller.findUserById);

  app.route("/users/:id").put(verifyAuthentication, controller.updateUser);

  app.route("/users/:id").delete(verifyAuthentication, controller.deleteUser);
}

export default usersRoutes;
