import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";

//app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();

//middlewares
app.use(express.json());
app.use(cors());

//Api endpoints
app.get("/", (req, res) => {
  res.send("Api Start Working");
});
app.use("/api/user", userRouter);

app.listen(port, () => console.log("Server Started", port));
