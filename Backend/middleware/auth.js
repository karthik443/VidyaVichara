import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET ;

export const verifyToken = (req, res, next) => {
  try {
    // Get token from headers: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // get the token
    console.log(JWT_SECRET,'***************');
    const decoded = jwt.verify(token, JWT_SECRET); // verify + decode

    req.user = decoded; // attach payload (id, role, etc.) to req.user
    next(); // go to next middleware / route
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
