import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ISalon extends Document {
  _id: string;
  vendorId: ObjectId;
  salonName: string;
  landmark: string;
  locality: string;
  district: string;
  location: object;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  googleMapLocation: string;
  chairCount: string;
  status: string;
  isPremium: number;
  banners: Array<string>;
  facilities: Array<string>;
  services: Array<any>;
}

const SalonSchema: Schema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    salonName: {
      type: String,
    },
    landmark: {
      type: String,
    },
    locality: {
      type: String,
    },
    district: {
      type: String,
    },
    location: {
      type: { type: String, default: "Point", required: true },
      coordinates: { type: [Number], required: true },
    },

    openingTime: {
      type: String,
    },
    closingTime: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    isPremium: {
      type: Number,
      default: 0,
    },
    chairCount: {
      type: String,
    },
    banners: {
      type: Array,
      required: true,
    },
    facilities: {
      type: Array,
    },
    services: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

SalonSchema.index({ location: "2dsphere" });

const SalonModel = mongoose.model<ISalon>("Salon", SalonSchema);
export default SalonModel;
