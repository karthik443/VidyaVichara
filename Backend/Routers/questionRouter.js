import express from "express";
import {verifyToken} from "../middleware/auth.js"
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  clearQuestions,
  deleteQuestion,
  upvoteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();
// router.use(verifyToken);
router.get("/", getQuestions);
router.post("/", createQuestion);
router.post("/update", updateQuestion);
router.delete("/", verifyToken,clearQuestions);
router.post("/delete", deleteQuestion);
router.post("/upvote/:id", upvoteQuestion);

export default router;
