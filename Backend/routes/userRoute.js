import express from "express";
import {
  checkUserTerm,
  loginUser,
  payment,
  registerUser,
  selectLotteryWinner,
  updateUserTerm,
} from "../controller/user_Controller.js";
import auth_user from "../middleWare/auth_user.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/check", auth_user, checkUserTerm);
userRouter.post("/update-term", auth_user, updateUserTerm);

userRouter.post("/payment", auth_user, payment);
userRouter.get("/select-winner", selectLotteryWinner);

export default userRouter;
