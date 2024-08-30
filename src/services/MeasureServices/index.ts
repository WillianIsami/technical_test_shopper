import { Measure } from "src/models/Measure";
import { GeminiService } from "./geminiService";
import { StorageService } from "./storageService";
import { AppDataSource } from "src/config/initializeDB";

const appDataSource = AppDataSource.getRepository(Measure);

export default function MeasureServices() {
  return {
    gemini: new GeminiService(),
    storage: new StorageService(appDataSource),
  };
}
