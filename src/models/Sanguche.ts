import mongoose from "mongoose";

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
  "nameOrObj arg must a string or an object " +
  "with the appropriate user keys.";

// **** Types **** //

export interface ISanguche {
  _id?: mongoose.Types.ObjectId;
  nombre: string;
  ingredientes: Array<Ingrediente>;
  creatorId: mongoose.Types.ObjectId;
}

// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  nombre?: string,
  ingredientes?: Array<Ingrediente>,
  _id?: string // id last cause usually set by db
): ISanguche {
  return {
    _id: _id ? new mongoose.Types.ObjectId(`${_id}`) : undefined,
    nombre: nombre ?? "",
    ingredientes: ingredientes ? ingredientes : [],
    creatorId: new mongoose.Types.ObjectId(),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): ISanguche {
  if (!isSanguche(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as ISanguche;
  return new_(p.nombre, p.ingredientes, p._id?.toString());
}

/**
 * See if the param meets criteria to be a user.
 */
function isSanguche(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === "object" &&
    ("_id" in arg ? typeof (arg as ISanguche)._id === "string" : true) &&
    "nombre" in arg &&
    typeof (arg as ISanguche).nombre === "string" &&
    "ingredientes" in arg &&
    Array.isArray((arg as ISanguche).ingredientes) &&
    // Verificar que todos los ingredientes son válidos según el enum
    (arg as ISanguche).ingredientes.every((ing: Ingrediente) =>
      Object.values(Ingrediente).includes(ing)
    ) &&
    "creatorId" in arg && // creatorId is a mongoose.Types.ObjectId or string
    (typeof (arg as ISanguche).creatorId === "string" ||
      (arg as ISanguche).creatorId instanceof mongoose.Types.ObjectId)
  );
}

export enum Ingrediente {
  JAMON = "Jamon",
  QUESO = "Queso",
  TOMATE = "Tomate",
  LECHUGA = "Lechuga",
  HUEVO = "Huevo",
  MAYONESA = "Mayonesa",
  PANCETA = "Panceta",
  KETCHUP = "Ketchup",
  MOSTAZA = "Mostaza",
  PALTA = "Palta",
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isSanguche,
} as const;
