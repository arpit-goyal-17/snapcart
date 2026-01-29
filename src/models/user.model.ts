import mongoose from 'mongoose'
interface IUser{
    _id?:mongoose.Types.ObjectId
    name:string
    email:string
    password?:string
    mobile?:string
    role:"user" | "delivery boy" | "admin"
    image?:string
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
    }
},{timestamps:true})
const User=mongoose.models.User||mongoose.model("User",userschema)
export default User
