import { timeStamp } from "console";
import mongoose, { mongo } from "mongoose";
import { nanoid } from "nanoid"; // for generating unique accessId

const lectureSchema = new mongoose.Schema(
  {
    lecturerName: { type: String, default: "Anonymus" },
    title: { type: String, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    creatorId: { type: String }, // existing, no change
    accessId: { type: String, required: true }, // new field for unique join code
    joinedLectures: { type: [String], default: [] }, // array of student IDs who joined
    isLive: {
      type: String,
      enum: ["Live", "Completed"],
      default: "Live",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("lecture", lectureSchema);
export default Lecture;
