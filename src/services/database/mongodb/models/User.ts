import { Model, Schema, Document, model } from 'mongoose';

export interface IUser {
  email: string;
  refreshToken: string;
  lastHistoryId?: string;
}

export interface IUserModel extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    refreshToken: { type: String, required: true },
    lastHistoryId: { type: String },
  },
  { timestamps: true },
);

const User: Model<IUserModel> = model('User', UserSchema);

export default User;
