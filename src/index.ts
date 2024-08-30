import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import router from "./routes/routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "../public", "uploads");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(router);
app.use("/uploads", express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
