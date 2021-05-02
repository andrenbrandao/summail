import { Model, Schema, Document, model } from 'mongoose';

interface IUser extends Document {
  email: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true },
);

const User: Model<IUser> = model('User', UserSchema);

export default User;
