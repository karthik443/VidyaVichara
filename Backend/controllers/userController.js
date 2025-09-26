import User from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    const if_user_Exists = await User.findOne({ email });
    if (if_user_Exists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error Logging in User" });
  }
};
