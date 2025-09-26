import express from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  clearQuestions,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/", clearQuestions);

export default router;
