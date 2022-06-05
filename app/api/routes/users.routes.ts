import { Express, Request, Response } from "express";
import * as controller from "@/api/controllers/users.controller";

const usersRoutes = (app: Express) => {
  app.route("/users").post(controller.createUser);

  app.route("/users/login").post(controller.loginUser);

  app.route("/users").get(controller.findAllUsers);

  app.route("/users/:id").get(controller.findUserById);
}

export default usersRoutes;
