import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import fs from "fs";

export class LLMHelper {
  private model: GenerativeModel | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      console.log("[LLMHelper] Initialized with Gemini API");
    } else {
      throw new Error("Gemini API key is required");
    }
  }

  private async fileToGenerativePart(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath);
    return {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: "image/png",
      },
    };
  }

  public async analyzeScreenshots(
    imagePaths: string[],
    userPrompt?: string
  ): Promise<string> {
    try {
      if (!this.model) {
        throw new Error("LLM not initialized");
      }

      const imageParts = await Promise.all(
        imagePaths.map((path) => this.fileToGenerativePart(path))
      );

      const prompt =
        userPrompt ||
        `Analyze these screenshots and provide helpful insights. What do you see? What might the user need help with?`;

      const result = await this.model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error analyzing screenshots:", error);
      throw error;
    }
  }

  public async analyzeImage(imagePath: string): Promise<string> {
    try {
      if (!this.model) {
        throw new Error("LLM not initialized");
      }

      const imagePart = await this.fileToGenerativePart(imagePath);
      const prompt =
        "Describe this image and provide any helpful insights or information.";

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  }

  public async chat(message: string): Promise<string> {
    try {
      if (!this.model) {
        throw new Error("LLM not initialized");
      }

      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("[LLMHelper] Error in chat:", error);
      throw error;
    }
  }

  public async analyzeAudioFromBase64(
    data: string,
    mimeType: string
  ): Promise<{ text: string; timestamp: number }> {
    try {
      if (!this.model) {
        throw new Error("LLM not initialized");
      }

      const audioPart = {
        inlineData: {
          data,
          mimeType,
        },
      };

      const prompt =
        "Transcribe and analyze this audio. Provide a summary of what was said and any key points.";

      const result = await this.model.generateContent([prompt, audioPart]);
      const response = await result.response;
      const text = response.text();

      return { text, timestamp: Date.now() };
    } catch (error) {
      console.error("Error analyzing audio from base64:", error);
      throw error;
    }
  }

  public async analyzeAudioFile(
    audioPath: string
  ): Promise<{ text: string; timestamp: number }> {
    try {
      if (!this.model) {
        throw new Error("LLM not initialized");
      }

      const audioData = await fs.promises.readFile(audioPath);
      const audioPart = {
        inlineData: {
          data: audioData.toString("base64"),
          mimeType: "audio/mp3",
        },
      };

      const prompt =
        "Transcribe and analyze this audio. Provide a summary of what was said and any key points.";

      const result = await this.model.generateContent([prompt, audioPart]);
      const response = await result.response;
      const text = response.text();

      return { text, timestamp: Date.now() };
    } catch (error) {
      console.error("Error analyzing audio file:", error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.model !== null;
  }
}
