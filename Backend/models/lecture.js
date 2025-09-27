import { timeStamp } from "console";
import mongoose, { mongo } from "mongoose";
const lectureSchema = new mongoose.Schema(
  {
    lecturerName: { type: String, default: "Anonymus" },
    title: { type: String, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    creatorId:{type:String},
    isLive: {
      type: String,
      enum: ["Live", "Completed"],
      default:"Live"
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("lecture", lectureSchema);
export default Lecture;
