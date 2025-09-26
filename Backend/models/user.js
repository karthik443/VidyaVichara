import { timeStamp } from "console";
import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema({
    name:{type:String,default:"Anonymus"},
    email:{type:String , required:true,unique:true},
    password:{type:String,required:true},
    role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student",
  },
   isBlocked:{type:Boolean, default:false}
},{timeStamp:true}) 
const User = mongoose.model("user",userSchema);
export default User;
