import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
//logout
router.post("/logout", logoutUser);

export default router;
