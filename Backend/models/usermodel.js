import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_Name: { type: String, required: true },
    user_Email: { type: String, required: true, unique: true },
    user_Password: { type: String, required: true },
    user_Phone: { type: Number, required: true, unique: true },
    User_Lottery_Number: { type: Object, default: {} },
  },
  { minimize: false }
);

const usermodel =
  mongoose.models.user_Data || mongoose.model("user_Data", userSchema);

export default usermodel;
