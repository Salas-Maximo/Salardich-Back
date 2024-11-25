import { IUser } from '@src/models/User';
import { getRandomInt } from '@src/util/misc';
import { UserModel } from './Mongoose';
import bcrypt from 'bcrypt';
import EnvVars from '@src/common/EnvVars';
import jwt from 'jsonwebtoken';

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(id: number): Promise<IUser | null> {
  return new Promise<IUser | null>((resolve, reject) => {
    UserModel.findOne({ id: id }).then((user: any) => {
      resolve(user);
    })
    .catch((err: any) => {
      if (err) {
        reject(err);
        return;
      }
    });
  });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    UserModel.findOne({ id: id }).then((user: any) => {
      if(user){
        resolve(true);
      }else{
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

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return new Promise<IUser[]>((resolve, reject) => {
    UserModel.find({}).then((users: any) => {
      resolve(users);
    })
    .catch((err: any) => {
      if (err) {
        reject(err);
        return;
      }
    });
  });
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  user.id = getRandomInt();
  const saltRounds = 10; // Puedes ajustar el número de rondas según sea necesario
  return new Promise<void>((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);
  
      // Hashear la contraseña con el salt generado
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) reject(err);
        
        // El hash resultante es lo que almacenas en tu base de datos
        user.password = hash;
      });
    });
    UserModel.create(user).then(() => resolve()).catch((err: any) => {
      if (err) {
        reject(err);
        return;
      }
    });
  });
}

async function login(user: IUser): Promise<String> {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: user.email }).then((userDB: any) => {
      if(userDB){
        bcrypt.compare(user.password, userDB.password, (err, result) => {
          if (err) reject(err);
          if (!result) reject("Contraseña incorrecta");
          const payload = {
            id: userDB.id,
            username: userDB.username,
            email: userDB.email
          }
          const accessToken = jwt.sign(payload, EnvVars.Jwt.Secret, { expiresIn: '1h' });
          resolve(accessToken);
        });
      }else{
        reject("Usario no encontrado");
      }
    })
    .catch((err: any) => {
      if (err) {
        reject(err);
      }
    });
  });
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    UserModel.updateOne({ id: user.id }, user).then(() => resolve()).catch((err: any) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    UserModel.deleteOne({ id: id }).then(() => resolve()).catch((err: any) => {
      if (err) {
        reject(err);
      }
      resolve();
    })});
}


// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  login,
  update,
  delete: delete_,
} as const;
