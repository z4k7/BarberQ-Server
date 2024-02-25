import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IServices extends Document {
  _id: ObjectId;
  serviceName: string | null;
  duration: string | null;
  category: string | null;
  isVisible: boolean | null;
}

const ServiceSchema: Schema = new Schema(
  {
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },
    duration: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<IServices>("Service", ServiceSchema);
export default ServiceModel;
