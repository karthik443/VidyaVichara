import { timeStamp } from "console";
import mongoose, { mongo } from "mongoose";
const questoinSchema = new mongoose.Schema({
    author:{type:String,default:"Anonymus"},
    text:{type:String , required:true},
    answer:{type:String,default:"Not Answerd"},
    status: {
    type: String,
    enum: ["unanswered", "answered", "important"],
    default: "unanswered",
  },
   isDeleted:{type:Boolean, default:false}
},{timeStamp:true})

const Question = mongoose.model("question",questoinSchema);
export default Question;