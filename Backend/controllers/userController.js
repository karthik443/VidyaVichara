import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    const token = jwt.sign({ "id": newUser._id, "role":role, "userName":name }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, name, email, role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// // LOGIN
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });

//     const user = await User.findOne({ email, password });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//       const token = jwt.sign({ "id": user._id, "role":user.role, "userName":user.name }, JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in user" });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // Find user by email
    const user = await User.findOne({ email });
    console.log(user,"USER ACCOUNT")
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare plaintext password with hashed password
    // const isMatch = await bcrypt.compare(password, user.password);
const isMatch = password == user.password;  
    if (!isMatch){
      console.log("NOTMATCH")
      return res.status(400).json({ message: "Invalid credentials" });
      
    } 

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, userName: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};


// Logout route (client-side token deletion)
export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};


