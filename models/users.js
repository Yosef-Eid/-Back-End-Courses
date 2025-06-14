import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    avatar: { type: String, default: "" },
    name: { type: String, required: true, trim: true, },
    email: { type: String, required: true, unique: true, lowercase: true, },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    favorite: [],
    cart: [],
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    
  }, { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
