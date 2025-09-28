import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

// Pre-save hook to hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;



// import mongoose, { mongo } from "mongoose";
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, default: "Anonymus" },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: {
//       type: String,
//       enum: ["student", "teacher"],
//       default: "student",
//     },
//     isBlocked: { type: Boolean, default: false },
//   },
//   { timeStamps: true }
// );
// const User = mongoose.model("user", userSchema);
// export default User;
