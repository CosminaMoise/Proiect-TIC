import express from "express";
import cors from "cors";
import bookRouter from "./routes/bookRoutes.js";
import authRouter from "./routes/authRoutes.js";
import db, {
  testConnection,
  populateDatabase,
  clearDatabase,
} from "../backend/config/dbConfig.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);

app.post("/api/populate-db", async (req, res) => {
  try {
    await populateDatabase();
    res.status(200).json({ message: "Database populated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to populate database" });
  }
});

app.post("/api/clear-db", async (req, res) => {
  try {
    await clearDatabase();
    res.status(200).json({ message: "Database cleared successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear database" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
  testConnection();
});
