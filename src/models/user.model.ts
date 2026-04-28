import mongoose from 'mongoose'
interface IUser{
    _id?:mongoose.Types.ObjectId
    name:string
    email:string
    password?:string
    mobile?:string
    role:"user" | "delivery boy" | "admin"
    image?:string
    socketID?:string|null
    isOnline:boolean
    location?: {
    type: {
        type: StringConstructor
        enum: string[]
        default: string
    }
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    }
}
}
const userschema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    mobile:{
        type:String
    },
    role:{
        type:String,
        enum:["user","delivery boy","admin"],
        default:"user"
    },
    image:{
        type:String,
        required:false
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },
        coordinates:{
            type:[Number],
            default:[0,0]
        }
    },
    socketID:{
        type:String,
        default:null
    },
    isOnline:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
userschema.index({location:"2dsphere"})
const User=mongoose.models.User||mongoose.model("User",userschema)
export default User
