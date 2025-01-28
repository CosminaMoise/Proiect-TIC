import express from "express";
import cors from "cors";
import db from '../backend/config/dbConfig.js';
import authRouter from "./routes/authRoutes.js";

// const FIREBASE_API_KEY = "AIzaSyABPk94L4Sk2yUvQO2o4at82BtefXeoc2Q";

const app = express();
app.use(cors());
app.use(express.json());
const port = 1234;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
