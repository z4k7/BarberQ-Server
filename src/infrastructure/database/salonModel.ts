import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ISalon extends Document{
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
    banners: Array<string>;
    facilities: Array<string>;
}

const SalonSchema: Schema = new Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Vendor'
    },
    salonName: {
        type:String
    },
    landmark: {
        type:String
    },
    locality: {
        type:String
    },
    district: {
        type:String
    },
    location: {
        longitude: {
            type:Number
        },
        latitude: {
            type:Number
        }
    },
    openingTime: {
      type:String  
    },
    closingTime: {
        type:String
    },
    contactNumber: {
        type:String
    },
    status: {
        type: String,
        default:'pending',
    },
    chairCount: {
        type:String
    },
    banners: {
        type:Array
    },
    facilities: {
        type:Array
    },
    
},
    {
    timestamps:true
}
)

const SalonModel = mongoose.model<ISalon>('Salon', SalonSchema)
export default SalonModel