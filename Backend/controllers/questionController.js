import Question from "../models/question.js";
const Roles = {
  teacher: "teacher",
  student: "student",
  
};


export const getQuestions = async (req, res) => {
  try {
    
    const { status,lectureId } = req.query;
    
    
    let filter = {lectureId};
   
    if (status) filter.status = status;   // e.g., "answered" or "unanswered"
   
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    
    const { text, author ,lectureId} = req.body;
    const role = req.user.role;
    if (!text.trim())
      return res.status(400).json({ message: "Question cannot be empty" });
    
    if(role==Roles.teacher){
      return res.status(400).json({ message: "Teacher Cannot ask question" });
    }
    const newQuestion = new Question({ text, author ,lectureId});
    await newQuestion.save();

    req.io.emit("newQuestion", newQuestion); // emit event using socket.io reference
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error adding question" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { status,answer ,id} = req.body;
    const role = req.user.role;
    if(role==Roles.student){
      res.status(500).json({ message: "Student cannot update questions" });
    }
    let updateList = {};
    if(status){
       updateList["status"] = status;
    }
    if(answer){
      updateList["answer"] = answer;
    }
   
    const updated = await Question.findByIdAndUpdate(
      id,
     updateList,
      { new: true }
    );
    console.log("Updated", updated);
    if (!updated)
      return res.status(404).json({ message: "Question not found" });

    req.io.emit("updateQuestion", updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating question" });
  }
};

export const clearQuestions = async (req, res) => {
  try {
    if(role==Roles.student){
      res.status(500).json({ message: "Student cannot update questions" });
    }
    await Question.deleteMany({});
    req.io.emit("clearQuestions");
    res.json({ message: "All questions cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing questions" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const questionID = req.body._id;
    const role = req.user.role;
    if(role==Roles.student){
      res.status(500).json({ message: "Student cannot delete questions" });
    }
    const deleteAck = await Question.deleteOne({
      _id: questionID,
    });
    // console.log("deleted",updated);
    if (!deleteAck)
      return res.status(404).json({ message: "Question deleted failed" });

    req.io.emit("deleteQuestion", deleteAck);
    res.json(deleteAck);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting question" + error.message });
  }
};

export const upvoteQuestion = async (req, res) => {
  const { id } = req.params; // question ID
  const userId = req.body.userId; // get from frontend or auth middleware

  try {
    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    if (question.upvotes.includes(userId)) {
      question.upvotes = question.upvotes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      question.upvotes.push(userId);
    }

    await question.save();

    if (req.io) {
      req.io.emit("questionUpvoted", {
        questionId: id,
        upvotes: question.upvotes.length,
      });
    }

    res.json({ upvotes: question.upvotes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

