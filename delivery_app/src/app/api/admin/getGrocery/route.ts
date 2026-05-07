import connectdb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectdb()
        const grocery=await Grocery.find({})
        return NextResponse.json(grocery,{status:200})
    }catch(error){
        return NextResponse.json({message:`Get Grocery Error ${error}`},{status:400})
    }
}