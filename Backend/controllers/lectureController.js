import Lecture from "../models/lecture.js";
const Roles = {
  teacher: "teacher",
  student: "student",
  
};

export const getLecture = async (req, res) => {
  try {
    
    const {userId} = req.query;

    let filter = {};
    if(userId && req.user.role==Roles.teacher){
      filter["creatorId"] = userId;
    }
    console.log(filter);

    const lectures = await Lecture.find(filter).sort({ createdAt: -1 });
    res.json(lectures);
  } catch (error) {
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
    console.log(req.user)
    console.log("Lecture created ", creatorId);
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    if (role === Roles.student) {
      return res.status(403).json({ message: "Students cannot create lectures" });
    }
   
    const lecture = new Lecture({
      lecturerName: req.user.userName || "Anonymous",
      title,
      startTime: Date.now(),
      creatorId
    });

    await lecture.save();
    req.io.emit("newLecture", lecture);

    res.status(201).json(lecture);
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

    if (role === Roles.student) {
      return res.status(403).json({ message: "Students cannot end lectures" });
    }

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