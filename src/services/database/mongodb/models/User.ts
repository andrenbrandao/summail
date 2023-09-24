import { model, Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IUser {
  email: string;
  refreshToken?: string;
  lastHistoryId?: string;
}

export interface IUserModel extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
  {
    email: { type: String, required: true, index: true, unique: true },
    refreshToken: { type: String },
    lastHistoryId: { type: String },
  },
  { timestamps: true },
);

const User = model<IUserModel>('User', UserSchema);

export default User;
