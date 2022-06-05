import { Express } from "express";
import * as controller from "@/api/controllers/users.controller";

const usersRoutes = (app: Express) => {
  app.route("/users").post(controller.createUser);

  app.route("/users/login").post(controller.loginUser);

  app.route("/users").get(controller.findAllUsers);

  app.route("/users/:id").get(controller.findUserById);

  app.route("/users/:id").put(controller.updateUser);

  app.route("/users/:id").delete(controller.deleteUser);
}

export default usersRoutes;
