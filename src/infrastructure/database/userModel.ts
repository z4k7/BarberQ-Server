import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
  _id: ObjectId;
  name: string | null;
  mobile: string | null;
  email: string | null;
  password: string | null;
  isBlocked: boolean | null;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    walletHistory: [
      {
        transactionType: String,
        method: String,
        amount: Number,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUsers>("User", UserSchema);
export default UserModel;
