import mongoose, { Schema, Document, ObjectId, TypeExpressionOperatorReturningObjectId } from "mongoose";

export interface IUsers extends Document {
  _id: ObjectId;
  name: string | null;
  mobile: string | null;
  email: string | null;
  password: string | null;
  isBlocked: boolean | null;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
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
        default:false,
  },
},
    { 
    timestamps:true
});

const UserModel = mongoose.model<IUsers>("User", UserSchema);
export default UserModel;
