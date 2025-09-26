import Question from "../models/question.js";

export const getQuestions = async (req, res) => {
  try {
    
    const { status } = req.query;

    let filter = {};
   
    if (status) filter.status = status;   // e.g., "answered" or "unanswered"
   
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text.trim())
      return res.status(400).json({ message: "Question cannot be empty" });

    const newQuestion = new Question({ text, author });
    await newQuestion.save();

    req.io.emit("newQuestion", newQuestion); // emit event using socket.io reference
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error adding question" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    console.log("Updated",updated);
    if (!updated) return res.status(404).json({ message: "Question not found" });

    req.io.emit("updateQuestion", updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating question" });
  }
};

export const clearQuestions = async (req, res) => {
  try {
    await Question.deleteMany({});
    req.io.emit("clearQuestions");
    res.json({ message: "All questions cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing questions" });
  }
};

export const deleteQuestion = async(req,res)=>{


    try {
        const questionID =  req.body._id;
        
    const deleteAck = await Question.deleteOne({
      "_id":questionID}
    );
    // console.log("deleted",updated);
    if (!deleteAck) return res.status(404).json({ message: "Question deleted failed" });

    req.io.emit("deleteQuestion", deleteAck);
    res.json(deleteAck);
  } catch (error) {
    res.status(500).json({ message: "Error deleting question"+error.message });
  }
        

}