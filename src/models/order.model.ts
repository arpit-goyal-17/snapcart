import mongoose from "mongoose";
import User from "./user.model";
import Grocery from "./grocery.model";
export interface IOrder{
    _id?:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId,
            quantity:number,
            name:string,
            price:string,
            unit:string,
            image:string
        }
    ]
    totalAmount:number
    paymentMethod:"cod"|"online"
    address:{
        fullname:string,
        city:string,
        state:string,
        pinCode:string,
        fullAddress:string,
        mobile:string,
        latitude:number,
        longitude:number
    }
    isPaid:boolean
    status:"pending"|"out for delivery"|"delivered"
    createdAt?:Date
    updatedAt?:Date
}
const orderSchema=new mongoose.Schema<IOrder>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,required:true
    },
    items:[{
        grocery:{type:mongoose.Schema.Types.ObjectId,ref:Grocery,required:true},
        name:String,
        price:String,
        unit:String,
        image:String,
        quantity:Number
    }],
    totalAmount:{type:Number,required:true},
    paymentMethod:{type:String,enum:["cod","online"],default:"cod"},
    address:{
        fullname:String,
        city:String,
        state:String,
        pinCode:String,
        fullAddress:String,
        mobile:String,
        latitude:Number,
        longitude:Number
    },
    isPaid:{type:Boolean,default:false},
    status:{type:String,enum:["pending","out for delivery","delivered"],default:"pending"}
},{timestamps:true})
const Order=mongoose.models.Order || mongoose.model("Order",orderSchema)
export default Order