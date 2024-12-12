import { Router } from "express";
import jetValidator from "jet-validator";

import User from "@src/models/User";
import Paths from "../common/Paths";
import SangucheRoutes from "./SangucheRoutes";
import UserRoutes from "./UserRoutes";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //

const userRouter = Router();
const sangucheRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

sangucheRouter.get(Paths.Sanguches.Get, SangucheRoutes.getAll);
userRouter.post(
  Paths.Users.Login,
  validate(["user", () => true]),
  UserRoutes.login
);
// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(["user", User.isUser]),
  UserRoutes.add
);

sangucheRouter.post(Paths.Sanguches.Add, SangucheRoutes.add);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(["user", User.isUser]),
  UserRoutes.update
);

sangucheRouter.put(Paths.Sanguches.Update, SangucheRoutes.update);

// Delete one user
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

sangucheRouter.delete(Paths.Sanguches.Delete, SangucheRoutes.delete);

sangucheRouter.get(
  Paths.Sanguches.GetAllByCreatorId,
  validate(["creatorId", "string", "params"]),
  SangucheRoutes.getAllByCreatorId
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Sanguches.Base, sangucheRouter);

// **** Export default **** //

export default apiRouter;
