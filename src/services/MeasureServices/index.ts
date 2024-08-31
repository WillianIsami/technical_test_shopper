import { AppDataSource } from "../../config/initializeDB";
import { Measure } from "../../models/Measure";
import { GeminiService } from "./geminiService";
import { StorageService } from "./storageService";

const appDataSource = AppDataSource.getRepository(Measure);

export default function MeasureServices() {
  return {
    gemini: new GeminiService(),
    storage: new StorageService(appDataSource),
  };
}
