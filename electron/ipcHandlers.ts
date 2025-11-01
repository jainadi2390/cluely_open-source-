import { ipcMain } from "electron";
import { AppState } from "./main";

export function initializeIpcHandlers(appState: AppState) {
  // Screenshot handlers
  ipcMain.handle("take-screenshot", async () => {
    try {
      const screenshotPath = await appState.takeScreenshot();
      const preview = await appState.screenshotHelper.getImagePreview(
        screenshotPath
      );
      return { path: screenshotPath, preview };
    } catch (error) {
      console.error("Error taking screenshot:", error);
      throw error;
    }
  });

  ipcMain.handle("get-screenshots", async () => {
    try {
      return await appState.screenshotHelper.getScreenshotsWithPreviews();
    } catch (error) {
      console.error("Error getting screenshots:", error);
      throw error;
    }
  });

  ipcMain.handle("delete-screenshot", async (_event, path: string) => {
    try {
      return await appState.screenshotHelper.deleteScreenshot(path);
    } catch (error) {
      console.error("Error deleting screenshot:", error);
      throw error;
    }
  });

  ipcMain.handle(
    "analyze-screenshots",
    async (_event, imagePaths: string[], prompt?: string) => {
      try {
        if (!appState.llmHelper) {
          throw new Error("LLM Helper not initialized. Please set API key.");
        }
        return await appState.llmHelper.analyzeScreenshots(imagePaths, prompt);
      } catch (error) {
        console.error("Error analyzing screenshots:", error);
        throw error;
      }
    }
  );

  // Window movement handlers
  ipcMain.handle("move-window-left", async () => {
    appState.windowHelper.moveWindowLeft();
  });

  ipcMain.handle("move-window-right", async () => {
    appState.windowHelper.moveWindowRight();
  });

  ipcMain.handle("move-window-up", async () => {
    appState.windowHelper.moveWindowUp();
  });

  ipcMain.handle("move-window-down", async () => {
    appState.windowHelper.moveWindowDown();
  });

  ipcMain.handle("quit-app", async () => {
    const { app } = require("electron");
    app.quit();
  });

  // Chat handler
  ipcMain.handle("send-chat-message", async (_event, message: string) => {
    try {
      if (!appState.llmHelper) {
        throw new Error("LLM Helper not initialized. Please set API key.");
      }
      return await appState.llmHelper.chat(message);
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  });

  // Audio handlers
  ipcMain.handle(
    "analyze-audio-base64",
    async (_event, data: string, mimeType: string) => {
      try {
        if (!appState.llmHelper) {
          throw new Error("LLM Helper not initialized. Please set API key.");
        }
        return await appState.llmHelper.analyzeAudioFromBase64(data, mimeType);
      } catch (error) {
        console.error("Error analyzing audio:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("analyze-audio-file", async (_event, path: string) => {
    try {
      if (!appState.llmHelper) {
        throw new Error("LLM Helper not initialized. Please set API key.");
      }
      return await appState.llmHelper.analyzeAudioFile(path);
    } catch (error) {
      console.error("Error analyzing audio file:", error);
      throw error;
    }
  });

  // Settings handlers
  ipcMain.handle("save-api-key", async (_event, apiKey: string) => {
    try {
      appState.setApiKey(apiKey);
      return { success: true };
    } catch (error) {
      console.error("Error saving API key:", error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle("get-api-key", async () => {
    return appState.getApiKey();
  });

  console.log("[IPC] Handlers initialized");
}
