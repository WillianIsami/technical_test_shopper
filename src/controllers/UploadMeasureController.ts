import { Request, Response } from "express";
import { parse, isValid } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fse from "fs-extra";
import { GeminiService } from "../services/MeasureServices/geminiService";
import { StorageService } from "../services/MeasureServices/storageService";

export class UploadMeasureController {
  constructor(
    private geminiService: GeminiService,
    private storageService: StorageService,
  ) {}

  run = async (req: Request, res: Response) => {
    return await this.execute(req, res);
  };

  public async execute(req: Request, res: Response) {
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    const mimeType = this.geminiService.verifyImageFormat(image);
    const base64Image = this.geminiService.extractBase64Data(image);
    const parsedDate = parse(
      measure_datetime,
      "yyyy-MM-dd'T'HH:mm:ss.SSSX",
      new Date(),
    );

    if (
      !image ||
      typeof image !== "string" ||
      !this.geminiService.isBase64(base64Image) ||
      mimeType === null
    ) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid base64 format",
      });
    }
    if (
      !measure_type ||
      typeof measure_type !== "string" ||
      !["WATER", "GAS"].includes(measure_type.toUpperCase())
    ) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid measure type",
      });
    }
    if (!measure_datetime || !isValid(parsedDate)) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid datetime format",
      });
    }
    if (!customer_code) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Customer code field is missing",
      });
    }
    if (
      await this.storageService.duplicateDatetime(customer_code, parsedDate)
    ) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }
    const fileExtension = mimeType.replace("image/", "");
    const filename = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(__dirname, "../../public/uploads", filename);
    try {
      const imageBuffer = Buffer.from(base64Image, "base64");
      await fse.ensureDir(path.join(__dirname, "../../public", "uploads"));
      await fse.writeFile(filePath, imageBuffer);

      const host = req.get("host");
      const protocol = req.protocol;
      const image_url = `${protocol}://${host}/uploads/${filename}`; // Generate a temporary link (valid for 1 hour)

      // Set up a timer to delete the file after 1 hour
      setTimeout(() => {
        fse
          .remove(filePath)
          .catch((err) => console.error("Error deleting file:", err)); // TODO: Logging for this error
      }, 3600000);
      const measure_value = await this.geminiService.getValueFromImage(
        filePath,
        mimeType,
        measure_type,
      );
      if (measure_value === null) {
        fse.remove(filePath);
        return res.status(500).json({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "Error trying to read image with gemini",
        });
      }
      const measure = {
        customer_code: customer_code,
        measure_datetime: new Date(measure_datetime),
        measure_type: measure_type.toUpperCase() as "WATER" | "GAS",
        measure_value: measure_value,
        image_url: image_url,
      };
      const savedMeasure = await this.storageService.saveMeasure(measure);
      return res.status(200).json({
        image_url,
        measure_value,
        measure_uuid: savedMeasure.measure_uuid,
      });
    } catch {
      return res.status(500).json({
        error_code: "ERROR_SAVING_FILE ",
        error_description: "Error saving file",
      });
    }
  }
}
