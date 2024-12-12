import { ISanguche, Ingrediente } from "@src/models/Sanguche";
import { IUser } from "@src/models/User";
import mongoose, { Connection, Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    creaciones: Array<ISanguche>,
    isAdmin: Boolean,
  },
  { collection: "User" }
);

const sangucheSchema: Schema = new mongoose.Schema(
  {
    nombre: { type: String, required: false },
    ingredientes: { type: Array<Ingrediente>, required: false },
    creatorId: { type: mongoose.Types.ObjectId, required: false },
  },
  { collection: "Sanguche" }
);

const db: Connection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/Salardich"
);

export const SangucheModel = db.model<ISanguche>("Sanguche", sangucheSchema);
export const UserModel = db.model<IUser>("User", userSchema);
