import { AppDataSource } from "src/config/initializeDB";
import { Measure } from "src/models/Measure";
import { Repository } from "typeorm";

export class StorageService {
  constructor(private measureRepository: Repository<Measure>) {
    this.measureRepository = AppDataSource.getRepository(Measure);
  }

  async saveMeasure(measureData: Partial<Measure>): Promise<Measure> {
    const measure = this.measureRepository.create(measureData);
    return await this.measureRepository.save(measure);
  }

  async updateMeasure(
    measureUuid: string,
    correctValue: number,
  ): Promise<Measure | null | number> {
    const measure = await this.measureRepository.findOne({
      where: { measure_uuid: measureUuid },
    });
    if (!measure) {
      return null;
    }
    if (measure.has_confirmed === true) {
      return 409;
    }
    measure.has_confirmed = true;
    measure.measure_value = correctValue;
    return await this.measureRepository.save(measure);
  }

  async listMeasures(customerCode: string): Promise<Measure[]> {
    return await this.measureRepository.find({
      where: { customer_code: customerCode },
    });
  }
}
