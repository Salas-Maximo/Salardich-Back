import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { ISanguche } from "@src/models/Sanguche";
import SangucheService from "@src/services/SangucheService";
import mongoose from "mongoose";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const sanguches = await SangucheService.getAll();
  return res.status(HttpStatusCodes.OK).json({ sanguches });
}

async function getAllByCreatorId(req: IReq, res: IRes) {
  const creatorId = new mongoose.Types.ObjectId(`${req.params.creatorId}`);
  const sanguches = await SangucheService.getAllByCreatorId(creatorId);
  return res.status(HttpStatusCodes.OK).json({ sanguches });
}

/**
 * Add one sanguche.
 */
async function add(
  req: IReq<{ sanguche: ISanguche; token: string }>,
  res: IRes
) {
  const sanguche = req.body.sanguche;
  const token = req.body.token;
  await SangucheService.addOne(sanguche, token).then((result) => {
    switch (result) {
      case "Sanguche ya existe":
        return res.status(HttpStatusCodes.CONFLICT).json({ error: result });
      case "Invalid token":
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: result });
    }
    return res.status(HttpStatusCodes.CREATED).end();
  });
}

/**
 * Update one sanguche.
 */
async function update(
  req: IReq<{ sanguche: ISanguche; token: string }>,
  res: IRes
) {
  const { sanguche, token } = req.body;
  await SangucheService.updateOne(sanguche, token).then((result) => {
    switch (result) {
      case "Ya hay un sanguche igual":
        return res.status(HttpStatusCodes.CONFLICT).json({ error: result });
      case "Token o id invalido":
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: result });
      case "Sanguche no encontrado":
        return res.status(HttpStatusCodes.NOT_FOUND).json({ error: result });
      case "No tenes permisos para modificar este sanguche":
        return res.status(HttpStatusCodes.FORBIDDEN).json({ error: result });
      case "ok":
        return res.status(HttpStatusCodes.OK).end();
      default:
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  });
}

/**
 * Delete one sanguche.
 */
async function delete_(req: IReq<{ token: string }>, res: IRes) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const token = req.headers.authorization || "";
  await SangucheService.delete(id, token);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  getAllByCreatorId,
  delete: delete_,
} as const;
