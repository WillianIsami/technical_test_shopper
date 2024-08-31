import { Request, Response } from "express";
import { StorageService } from "../services/MeasureServices/storageService";

export class ListMeasureController {
  constructor(private storageService: StorageService) {}

  run = async (req: Request, res: Response) => {
    return await this.execute(req, res);
  };

  public async execute(req: Request, res: Response) {
    const customerCode = req.params.customer_code;
    let measureType = req.query.measure_type as string;
    let result;
    if (measureType) {
      measureType = measureType.toUpperCase();
      if (["WATER", "GAS"].includes(measureType)) {
        result = await this.storageService.listMeasures(
          customerCode,
          measureType,
        );
      } else {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        });
      }
    }
    result = await this.storageService.listMeasures(customerCode, measureType);
    if (result === null) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_descripton: "Nenhuma leitura encontrada",
      });
    }
    return res.status(200).json(result);
  }
}
