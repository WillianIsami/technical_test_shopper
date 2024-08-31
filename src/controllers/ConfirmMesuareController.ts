import { Request, Response } from "express";
import { StorageService } from "../services/MeasureServices/storageService";

export class ConfirmMeasureController {
  constructor(private storageService: StorageService) {}

  run = async (req: Request, res: Response) => {
    return await this.execute(req, res);
  };

  public async execute(req: Request, res: Response) {
    const { measure_uuid, confirmed_value } = req.body;
    if (!measure_uuid || typeof measure_uuid !== "string") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid measure uuid format",
      });
    }
    if (!confirmed_value || typeof confirmed_value !== "number") {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid confirmed value format",
      });
    }
    const response = await this.storageService.updateMeasure(
      measure_uuid,
      confirmed_value,
    );
    if (response === 400) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Invalid measure uuid format",
      });
    }
    if (!response) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura do mês não encontrada",
      });
    }
    if (response === 409) {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada",
      });
    }
    return res.status(200).json(response);
  }
}
