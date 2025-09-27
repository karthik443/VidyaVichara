import express from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  clearQuestions,
  deleteQuestion,
  upvoteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/", clearQuestions);
router.post("/delete", deleteQuestion);
router.post("/upvote/:id", upvoteQuestion);

export default router;
