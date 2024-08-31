import { Router } from "express";
import multer from "multer";
import path from "path";
import { ConfirmMeasureController } from "../controllers/ConfirmMesuareController";
import { ListMeasureController } from "../controllers/ListMeasuresController";
import { UploadMeasureController } from "../controllers/UploadMeasureController";
import MeasureServices from "../services/MeasureServices";

const router = Router();

const measureServices = MeasureServices();
const uploadMeasureController = new UploadMeasureController(
  measureServices.gemini,
  measureServices.storage,
);
const confirmMeasureController = new ConfirmMeasureController(
  measureServices.storage,
);
const listMeasureController = new ListMeasureController(
  measureServices.storage,
);

const uploadDir = path.join(__dirname, "../public", "uploads");
const upload = multer({ dest: uploadDir });

router.post("/upload", upload.single("image"), uploadMeasureController.run);
router.patch("/confirm", confirmMeasureController.run);
router.get("/:customer_code/list", listMeasureController.run);

export default router;
