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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
