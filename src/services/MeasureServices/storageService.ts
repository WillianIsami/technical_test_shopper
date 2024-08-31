import { AppDataSource } from "../../config/initializeDB";
import { Measure } from "../../models/Measure";
import { Repository } from "typeorm";

export class StorageService {
  constructor(private measureRepository: Repository<Measure>) {
    this.measureRepository = AppDataSource.getRepository(Measure);
  }

  async duplicateDatetime(
    customer_code: string,
    measure_datetime: Date,
  ): Promise<boolean> {
    const existingMeasures = await this.measureRepository.find({
      where: { customer_code },
      order: { measure_datetime: "DESC" }, // Order by latest datetime first
    });
    if (existingMeasures.length > 0) {
      const latestMeasure = existingMeasures[0];
      if (
        latestMeasure.measure_datetime.getFullYear() ===
          measure_datetime?.getFullYear() &&
        latestMeasure.measure_datetime.getMonth() ===
          measure_datetime?.getMonth()
      ) {
        return true;
      }
    }
    return false;
  }

  async saveMeasure(measureData: Partial<Measure>): Promise<Measure> {
    const measure = this.measureRepository.create(measureData);
    return await this.measureRepository.save(measure);
  }

  async updateMeasure(
    measureUuid: string,
    correctValue: number,
  ): Promise<object | null | number> {
    try {
      const measure = await this.measureRepository.findOne({
        where: { measure_uuid: measureUuid },
      });
      if (!measure) {
        return null;
      }
      if (measure.has_confirmed === true) {
        return 409;
      }
      this.measureRepository.update(measureUuid, {
        measure_value: correctValue,
        has_confirmed: true,
      });
      return { success: true };
    } catch {
      return 400;
    }
  }

  async listMeasures(
    customerCode: string,
    measureType: string,
  ): Promise<object | null> {
    const queryBuilder = this.measureRepository
      .createQueryBuilder("measure")
      .where("measure.customer_code = :customerCode", { customerCode });
    if (measureType) {
      queryBuilder.andWhere("measure.measure_type = :measureType", {
        measureType: measureType,
      });
    }
    const measures = await queryBuilder.getMany();
    if (measures.length === 0) {
      return null;
    }
    const result = {
      customer_code: customerCode,
      measures: measures.map((measure) => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
      })),
    };
    return result;
  }
}
