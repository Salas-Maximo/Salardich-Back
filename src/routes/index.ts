import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../common/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';
import SangucheRoutes from './SangucheRoutes';
import { verifyToken } from '@src/middleware/verification';
import Sanguche from '@src/models/Sanguche';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// ** Add UserRouter ** //

const userRouter = Router();
const sangucheRouter = Router();

// Get all users
userRouter.get(
  Paths.Users.Get,
  UserRoutes.getAll,
);

sangucheRouter.get(
  Paths.Sanguches.Get,
  SangucheRoutes.getAll,
);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add,
);

userRouter.post(
  Paths.Users.Login,
  validate(['user', User.isUser]),
  UserRoutes.login,
);

sangucheRouter.post(
  Paths.Sanguches.Add,
  validate(['sanguche', Sanguche.isSanguche]),
  SangucheRoutes.add,
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update,
);

sangucheRouter.put(
  Paths.Sanguches.Update,
  validate(['sanguche', Sanguche.isSanguche]),
  SangucheRoutes.update,
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete,
);

sangucheRouter.delete(
  Paths.Sanguches.Delete,
  validate(['id', 'number', 'params']),
  SangucheRoutes.delete,
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Sanguches.Base, sangucheRouter);

// **** Export default **** //

export default apiRouter;
