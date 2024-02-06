import mongoose,{Schema,Document,ObjectId} from 'mongoose'

export interface IVendors extends Document{
    _id: ObjectId;
    name: string | null;
    mobile: string | null;
    email: string | null;
    password: string | null;
    isBlocked: boolean | null;
}

const VendorSchema: Schema = new Schema({
    name: {
        type: String,
        required : true
    },
    mobile: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
},
    {
    timestamps:true
    })

const VendorModel = mongoose.model<IVendors>('Vendor', VendorSchema)
    export default VendorModel