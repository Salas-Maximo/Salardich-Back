import { ISanguche } from "@src/models/Sanguche";
import UserService from "@src/services/UserService";
import mongoose from "mongoose";
import { SangucheModel } from "./Mongoose";
import UserRepo from "./UserRepo";
// **** Functions **** //

/**
 * Get one sanguche.
 */
async function getOne(_id: mongoose.Types.ObjectId): Promise<ISanguche | null> {
  return new Promise<ISanguche | null>((resolve, reject) => {
    SangucheModel.findOne({ _id: _id })
      .then((sanguche: any) => {
        resolve(sanguche);
      })
      .catch((err: Error) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * See if a sanguche with the given id exists.
 */
async function persists(_id: mongoose.Types.ObjectId): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    SangucheModel.findOne({ _id: _id })
      .then((sanguche: any) => {
        if (sanguche) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

async function checkNameAndIngredientesUnique(
  sanguche: ISanguche
): Promise<boolean> {
  // check if one exists with the same name OR the same ingredients
  return new Promise<boolean>((resolve, reject) => {
    SangucheModel.findOne({
      $or: [
        { nombre: sanguche.nombre },
        { ingredientes: { $all: sanguche.ingredientes } },
      ],
    })
      .then((sanguche: any) => {
        if (sanguche) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

async function getAllByCreatorId(
  creatorId: mongoose.Types.ObjectId
): Promise<ISanguche[]> {
  return new Promise<ISanguche[]>((resolve, reject) => {
    SangucheModel.find({ creatorId: creatorId })
      .then((sanguches: any) => {
        resolve(sanguches);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Get all sanguches.
 */
async function getAll(): Promise<ISanguche[]> {
  return new Promise<ISanguche[]>((resolve, reject) => {
    SangucheModel.find({})
      .then((sanguches: any) => {
        resolve(sanguches);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Add one sanguche.
 */
async function add(sanguche: ISanguche, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Invalid token";
  }
  return checkNameAndIngredientesUnique(sanguche)
    .then((res) => {
      if (!res) {
        return "Sanguche ya existe";
      }

      sanguche.creatorId = new mongoose.Types.ObjectId(userId);
      return new Promise<string>((resolve, reject) => {
        SangucheModel.create(sanguche)
          .then(() => {
            resolve("ok");
          })
          .catch((err: any) => {
            if (err) {
              reject("Error");
            }
          });
      });
    })
    .catch(() => {
      return "Error";
    });
}

/**
 * Update a sanguche.
 */
async function update(newSanguche: ISanguche, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Token Invalido";
  }

  if (!newSanguche._id) {
    return "Falta el id del sanguche";
  }

  // get the sanguche
  const sanguche = await getOne(newSanguche._id);
  if (!sanguche) {
    return "Sanguche no encontrado";
  }

  // check if the user is the creator
  if (sanguche.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return "No tenes permisos para modificar este sanguche";
    }
  }

  // check if the name or the ingredients are the same
  const isUnique = await checkNameAndIngredientesUnique(newSanguche);
  if (!isUnique) {
    return "Ya hay un sanguche igual";
  }

  return SangucheModel.updateOne({ _id: newSanguche._id }, newSanguche)
    .then(() => {
      return "ok";
    })
    .catch((err: any) => {
      return "Error";
    });
}

/**
 * Delete one sanguche.
 */
async function delete_(
  id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const userId = UserService.verifyToken(token);
  // get the sanguche
  const sanguche = await getOne(id);
  if (!sanguche) {
    return Promise.reject("Sanguche not found");
  }

  // check if the user is the creator
  if (sanguche.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return Promise.reject("Unauthorized");
    }
  }

  return new Promise<void>((resolve, reject) => {
    SangucheModel.deleteOne({ _id: id })
      .then(() => resolve())
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  getAllByCreatorId,
} as const;
