import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; 


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, 
    },
    post: [
      {
        title: String,
        Post: {
          publicId: String,
          secureUrl: String,
        },
        like:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"

        }],
        commentData:[{
          comment:{
            type: String
          },
          user:{
            type:mongoose.Schema.Types.ObjectId
          }
      }]
    }
    ],
    avatar: {
      publicId: String,
      secureUrl: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    forgetPasswordToken: String,
    forgetPasswordDate: Date,
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});


userSchema.methods = {

  generateJWTToken() {
    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  generatePasswordResetToken() {
      const resetToken= crypto.randomBytes(20).toString("hex");
      this.forgetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      this.forgetPasswordDate = Date.now() + 30 * 60 * 1000; // 30 minutes
      return resetToken;
  },

comparePassword(enteredPassword) {
    return bcryptjs.compare(enteredPassword, this.password);
  },
};

const User = mongoose.model("User", userSchema);
export default User;
