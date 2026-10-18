import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const User = mongoose.model("User", userSchema);

export default User;
