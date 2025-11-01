import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Screenshot management
  takeScreenshot: () => ipcRenderer.invoke("take-screenshot"),
  getScreenshots: () => ipcRenderer.invoke("get-screenshots"),
  deleteScreenshot: (path: string) =>
    ipcRenderer.invoke("delete-screenshot", path),
  analyzeScreenshots: (imagePaths: string[], prompt?: string) =>
    ipcRenderer.invoke("analyze-screenshots", imagePaths, prompt),

  // Window management
  moveWindowLeft: () => ipcRenderer.invoke("move-window-left"),
  moveWindowRight: () => ipcRenderer.invoke("move-window-right"),
  moveWindowUp: () => ipcRenderer.invoke("move-window-up"),
  moveWindowDown: () => ipcRenderer.invoke("move-window-down"),
  quitApp: () => ipcRenderer.invoke("quit-app"),

  // Chat
  sendChatMessage: (message: string) =>
    ipcRenderer.invoke("send-chat-message", message),

  // Audio processing
  analyzeAudioFromBase64: (data: string, mimeType: string) =>
    ipcRenderer.invoke("analyze-audio-base64", data, mimeType),
  analyzeAudioFile: (path: string) =>
    ipcRenderer.invoke("analyze-audio-file", path),

  // Settings
  saveApiKey: (apiKey: string) => ipcRenderer.invoke("save-api-key", apiKey),
  getApiKey: () => ipcRenderer.invoke("get-api-key"),

  // Event listeners
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => {
    const subscription = (_event: any, data: any) => callback(data);
    ipcRenderer.on("screenshot-taken", subscription);
    return () => ipcRenderer.removeListener("screenshot-taken", subscription);
  },

  onClearAll: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on("clear-all", subscription);
    return () => ipcRenderer.removeListener("clear-all", subscription);
  },

  // Generic invoke for flexibility
  invoke: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke(channel, ...args),
});

console.log("[Preload] Electron API exposed to renderer");
