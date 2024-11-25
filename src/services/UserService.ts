import RouteError from '@src/common/RouteError';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import mongoose from 'mongoose';


// **** Variables **** //

export const USER_NOT_FOUND_ERR = 'User not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

function login(user: IUser): Promise<String> {
  return UserRepo.login(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user._id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: mongoose.Types.ObjectId): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  addOne,
  login,
  updateOne,
  delete: _delete,
} as const;
