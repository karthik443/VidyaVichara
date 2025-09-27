import express from "express";
import {verifyToken} from "../middleware/auth.js"
import {
    getLecture,
    createLecture,
    endLecture,
} from "../controllers/lectureController.js";


const router = express.Router();
// router.use(verifyToken);
router.get("/", getLecture);
router.post("/", createLecture);
router.post("/:id", endLecture);


export default router;
