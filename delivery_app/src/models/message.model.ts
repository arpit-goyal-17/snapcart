import mongoose from "mongoose";

export interface IMessage{
    _id?:mongoose.Types.ObjectId
    text:string,
    roomId:mongoose.Types.ObjectId,
    senderId:mongoose.Types.ObjectId,
    time:string,
    createdAt:Date,
    UpdatedAt:Date
}
const messageSchema=new mongoose.Schema<IMessage>({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    text:{
        type:String
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time:{
        type:String
    }
},{timestamps:true})
const Message=mongoose.models.Message||mongoose.model("Message",messageSchema)
export default Message