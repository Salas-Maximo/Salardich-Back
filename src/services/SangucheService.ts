import RouteError from '@src/common/RouteError';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import SangucheRepo from '@src/repos/SangucheRepo';
import { ISanguche } from '@src/models/Sanguche';
import mongoose from 'mongoose';


// **** Variables **** //

export const SANGUCHE_NOT_FOUND_ERR = 'Sanguche not found';


// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<ISanguche[]> {
  return SangucheRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: ISanguche): Promise<void> {
  return SangucheRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: ISanguche): Promise<void> {
  if (!user._id) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      'User must have an id to update',
    );
  }
  const persists = await SangucheRepo.persists(user._id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      SANGUCHE_NOT_FOUND_ERR,
    );
  }
  // Return user
  return SangucheRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(_id: mongoose.Types.ObjectId): Promise<void> {
  const persists = await SangucheRepo.persists(_id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      SANGUCHE_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return SangucheRepo.delete(_id);
}


// **** Export default **** //

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
