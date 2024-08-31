import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export class GeminiService {
  verifyImageFormat(base64Data: string): string | null {
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    const mimeTypeRegex = /^data:(image\/[a-zA-Z]+);base64,/;
    const match = base64Data.match(mimeTypeRegex);
    if (match && allowedFormats.includes(match[1])) {
      return match[1];
    }
    return null;
  }

  public isBase64(str: string): boolean {
    try {
      return Buffer.from(str, "base64").toString("base64") === str;
    } catch {
      return false;
    }
  }

  public extractBase64Data(base64Data: string): string {
    // Regex to remove MIME type prefix
    const base64DataRegex = /^data:image\/[a-zA-Z]+;base64,/;
    const base64Image = base64Data.replace(base64DataRegex, "");
    return base64Image;
  }

  public async getValueFromImage(
    filePath: string,
    mimeType: string,
    measure_type: string,
  ): Promise<number | null> {
    const gemini_api_key = process.env.GEMINI_API_KEY || "GEMINI_API_KEY";
    const genAI = new GoogleGenerativeAI(gemini_api_key);
    const fileManager = new GoogleAIFileManager(gemini_api_key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    try {
      const prompt = `Provide the value that is being shown on the ${measure_type.toUpperCase() === "WATER" ? "water" : "gas"} meter. Give me the value as an integer with exactly number on it`;
      const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: mimeType,
      });
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: prompt },
      ]);
      const regexResult = result.response.text();
      const match = regexResult.match(/\d+(\.\d+)?/);
      if (match) {
        return parseInt(match[0]);
      }
      return 0;
    } catch {
      return null;
    }
  }
}
