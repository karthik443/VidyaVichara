import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getLecture,
  createLecture,
  endLecture,
  joinLecture, // import together
} from "../controllers/lectureController.js";

const router = express.Router();

router.get("/", verifyToken, getLecture);
router.post("/", verifyToken, createLecture);
router.post("/join", verifyToken, joinLecture); // put this BEFORE :id
router.post("/:id", verifyToken, endLecture);

export default router;
