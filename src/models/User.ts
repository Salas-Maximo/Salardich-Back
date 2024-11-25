import moment from 'moment';
import { ISanguche } from './Sanguche';
import mongoose, { mongo } from 'mongoose';


// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';


// **** Types **** //

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  creaciones: Array<mongoose.Types.ObjectId>;
}


// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  username?: string,
  email?: string,
  password?: string,
  creaciones?: Array<mongoose.Types.ObjectId>,
  _id?: mongoose.Types.ObjectId
): IUser {
  return {
    _id: (_id ?? new mongoose.Types.ObjectId()),
    username: (username ?? ''),
    email: (email ?? ''),
    password: (password ?? ''),
    creaciones: (creaciones ? creaciones : []),
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as IUser;
  return new_(p.username, p.email, p.password,p.creaciones, p._id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    ('_id' in arg ?  typeof arg._id === 'string' : true) && 
    'email' in arg && typeof arg.email === 'string' && 
    'username' in arg && typeof arg.username === 'string' &&
    'password' in arg && typeof arg.password === 'string'
  );
}


// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
} as const;
