import { timeStamp } from "console";
import mongoose, { mongo } from "mongoose";
const questoinSchema = new mongoose.Schema(
  {
    author: { type: String, default: "Anonymus" },
    text: { type: String, required: true },
    answer: { type: String, default: "Not Answerd" },
    status: {
      type: String,
      enum: ["unanswered", "answered", "important"],
      default: "unanswered",
    },
    lectureId: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lecture", // reference to the lecture
      },
    
    isDeleted: { type: Boolean, default: false },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to the user who upvoted
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("question", questoinSchema);
export default Question;
