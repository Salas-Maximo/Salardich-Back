import moment from 'moment';
import mongoose from 'mongoose';


// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


// **** Types **** //

export interface ISanguche {
  _id?: mongoose.Types.ObjectId;
  nombre: string;
  ingredientes: Array<Ingrediente>;
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
    nombre?: string,
    ingredientes?: Array<Ingrediente>,
    _id?: string, // id last cause usually set by db
): ISanguche {
  return {
    _id: _id ? new mongoose.Types.ObjectId(`${_id}`) : undefined,
    nombre: (nombre ?? ''),
    ingredientes: (ingredientes ? ingredientes : []),
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
        typeof arg === 'object' &&
        ('_id' in arg ?  typeof arg._id === 'string' : true) && 
        'nombre' in arg && typeof arg.nombre === 'string' &&
        'ingredientes' in arg && Array.isArray(arg.ingredientes) &&
        // Verificar que todos los ingredientes son válidos según el enum
        (arg as any).ingredientes.every((ing: any) => Object.values(Ingrediente).includes(ing))
      );
}

export enum Ingrediente {
    JAMON = 'jamon',
    QUESO = 'queso',
    TOMATE = 'tomate',
    LECHUGA = 'lechuga',
    HUEVO = 'huevo',
    MAYONESA = 'mayonesa'
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isSanguche,
} as const;
