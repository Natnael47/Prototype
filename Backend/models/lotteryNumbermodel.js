import mongoose from "mongoose";

const lotterySchema = new mongoose.Schema(
  {
    lottery_number: {
      type: String,
      required: true,
      match: /^\d{12}$/, // Ensures it's a 12-digit number
      unique: true, // Each lottery number must be unique
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_Data", // References the User model
      required: true,
    },
    purchase_date: {
      type: Date,
      default: Date.now, // Automatically sets the current date
    },
    is_winner: {
      type: Boolean,
      default: false, // Indicates if the ticket is a winning ticket
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const LotteryModel =
  mongoose.models.lottery_numbers ||
  mongoose.model("lottery_numbers", lotterySchema);

export default LotteryModel;
