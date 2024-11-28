import HttpStatusCodes from '@src/common/HttpStatusCodes';

import SangucheService from '@src/services/SangucheService';
import { ISanguche } from '@src/models/Sanguche';
import { IReq, IRes } from './types/express/misc';
import mongoose from 'mongoose';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const sanguches = await SangucheService.getAll();
  return res.status(HttpStatusCodes.OK).json(sanguches);
}

/**
 * Add one sanguche.
 */
async function add(req: IReq<{sanguche: ISanguche}>, res: IRes) {
  const { sanguche } = req.body;
  await SangucheService.addOne(sanguche);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one sanguche.
 */
async function update(req: IReq<{sanguche: ISanguche}>, res: IRes) {
  const { sanguche } = req.body;
  await SangucheService.updateOne(sanguche);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one sanguche.
 */
async function delete_(req: IReq, res: IRes) {
  console.log("Borrar ", req.params.id);
  const id = new mongoose.Types.ObjectId(req.params._id); 
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
