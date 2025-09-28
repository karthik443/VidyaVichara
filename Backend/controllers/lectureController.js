import Lecture from "../models/lecture.js";
import { nanoid } from "nanoid"; // npm i nanoid
const Roles = {
  teacher: "teacher",
  student: "student",

  
};

// export const getLecture = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     let filter = {};

//     if (req.user.role === Roles.teacher && userId) {
//       filter.creatorId = userId;
//     } else if (req.user.role === Roles.student) {
//       filter.joinedStudents = req.user.id.toString();
//     }

//     const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
//     res.json(lectures);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching lectures" });
//   }
// };

export const getLecture = async (req, res) => {
  try {
    const userId = req.user.id;
    let filter = {};

    if (req.user.role === Roles.teacher) {
      // Teacher sees their created lectures
      filter.creatorId = userId;
    } else if (req.user.role === Roles.student) {
      // Student sees only lectures they joined
      filter.joinedLectures = userId;
    }
    

    const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
    res.json(lectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching lectures" });
  }
}; 





/*
export const createLecture = async (req, res) => {
  try {
   const lecture =  {
    "lecturerName":lecturerName,
    "title":title,
    "startTime": Date.now(),
   };
    const role = req.user.role;
    if (!text.trim())
      return res.status(400).json({ message: "Lecture title cannot be empty" });
    
    if(role==Roles.student){
      return res.status(400).json({ message: "Student cannot create lecture" });
    }
    const  newLecture = new Lecture(lecture);
    await newLecture.save();

    req.io.emit("newLecture", newLecture); // emit event using socket.io reference
    res.status(201).json(newLecture);
  } catch (error) {
    res.status(500).json({ message: "Error adding Lecture" });
  }
};
*/

// Create new lecture
export const createLecture = async (req, res) => {
  try {
    const { title } = req.body;
    const role = req.user.role;
    const creatorId = req.user.id.toString();

    if (!title?.trim()) return res.status(400).json({ message: "Title cannot be empty" });
  if (role === Roles.student)
    return res.status(403).json({ message: "Not allowed to create lectures" });
  
    const accessId = nanoid(6); // generate 6-character code

    const lecture = new Lecture({
      lecturerName: req.user.name || "Anonymous",
      title,
      startTime: Date.now(),
      creatorId,
      accessId: nanoid(6),
    });

    await lecture.save();
    req.io.emit("newLecture", lecture);

    res.status(201).json(lecture); // accessId will be visible here
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating lecture" });
  }
};


// export const endLecture = async (req, res) => {
//   try {
//     const lectureId = req.body._id;
//     const role = req.user.role;
//     if(role==Roles.student){
//       res.status(500).json({ message: "Student cannot update lectures" });
//     }
//     let status={};
//     status["endTime"]=Date.now();
//     status["isLive"]="Completed"
//     const updated = await Lecture.findByIdAndUpdate({_id:lectureId},
//       { status },
     
//     );
//     console.log("Updated", updated);
//     if (!updated)
//       return res.status(404).json({ message: "Lecture not found" });

//     req.io.emit("updateLecture", updated);
//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating lecture" });
//   }
// };

// End a lecture
export const endLecture = async (req, res) => {
  try {
    const lectureId = req.params.id;
    const role = req.user.role;

    if (role === Roles.student)
    return res.status(403).json({ message: "Not allowed to end lectures" });

    const updated = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        $set: {
          endTime: Date.now(),
          isLive: "Completed",
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    req.io.emit("updateLecture", updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error ending lecture" });
  }
};


export const joinLecture = async (req, res) => {
  try {
    const { accessId } = req.body;
    const studentId = req.user.id.toString();

    const lecture = await Lecture.findOne({ accessId });
    if (!lecture) return res.status(404).json({ message: "Invalid access code" });

    // Check if student is already joined
    if (!lecture.joinedLectures.includes(studentId)) {
      lecture.joinedLectures.push(studentId);
      await lecture.save();
    }

    res.json({ message: "Joined lecture successfully", lecture });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error joining lecture" });
  }
};



