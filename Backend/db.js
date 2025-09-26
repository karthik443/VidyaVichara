import mongoose from "mongoose";

const ConnectDB = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
        
    }
    catch(e){
        console.log("MongoDB connection failed!",e.message);
    }
}
export default ConnectDB;