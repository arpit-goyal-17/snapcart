import mongoose from "mongoose"
const mongodb_url=process.env.MONGODB_URL
if(!mongodb_url)
{
    throw new Error("db error")
}
let cache=global.mongoose
if(!cache){
    cache=global.mongoose={conn:null,promise:null}
}
const connectdb=async ()=>{
    if(cache.conn)
        return cache.conn
    if(!cache.promise){
        cache.promise=mongoose.connect(mongodb_url).then((conn)=>conn.connection)
    }
    try{
        const conn=await cache.promise
        return conn;
    }
    catch(error){
        console.log(error)
    }
}
export default connectdb