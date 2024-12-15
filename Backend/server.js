import cors from "cors";
import "dotenv/config";
import express from "express";

//app config
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cors());

//Api endpoints
app.get("/", (req, res) => {
  res.send("Api Start Working");
});

app.listen(port, () => console.log("Server Started", port));
