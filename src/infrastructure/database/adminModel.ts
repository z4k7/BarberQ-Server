import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface IAdmin extends Document{
    _id: ObjectId,
    name: string | null,
    email: string | null,
    password: string | null,
    
}

const AdminSchema: Schema = new Schema({
    name: {
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
    }
},
    {
    timestamps:true  
    })

const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema)

export default AdminModel