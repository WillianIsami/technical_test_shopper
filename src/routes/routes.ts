import { Router } from "express";
import multer from "multer";
import path from "path";
import { UploadMeasureController } from "src/controllers/UploadMeasureController";
import MeasureServices from "src/services/MeasureServices";

const router = Router();

const measureServices = MeasureServices();
const uploadMeasureController = new UploadMeasureController(
  measureServices.gemini,
  measureServices.storage,
);

const uploadDir = path.join(__dirname, "../public", "uploads");
const upload = multer({ dest: uploadDir });

router.post("/upload", upload.single("image"), uploadMeasureController.execute);

export default router;
