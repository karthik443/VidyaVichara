import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    author: { type: String, default: "Anonymous" },
    text: { type: String, required: true },
    answer: { type: String, default: "Not Answered" },
    status: {
      type: String,
      enum: ["unanswered", "answered", "important"],
      default: "unanswered",
    },
    lectureId: {
      type: String,
      
    },
    resources: [
      {
        filename: String,
        url: String,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("question", questionSchema);
export default Question;
