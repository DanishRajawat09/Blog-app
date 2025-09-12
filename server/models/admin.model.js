import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "enter an velid email",
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_ACCESSTOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRY }
  );
};
adminSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_REFRESHTOKEN_SECRET,
    { expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRY }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
