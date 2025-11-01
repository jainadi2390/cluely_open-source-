export interface ElectronAPI {
  // Screenshot management
  takeScreenshot: () => Promise<{ path: string; preview: string }>;
  getScreenshots: () => Promise<Array<{ path: string; preview: string }>>;
  deleteScreenshot: (path: string) => Promise<{ success: boolean; error?: string }>;
  analyzeScreenshots: (imagePaths: string[], prompt?: string) => Promise<string>;

  // Window management
  moveWindowLeft: () => Promise<void>;
  moveWindowRight: () => Promise<void>;
  moveWindowUp: () => Promise<void>;
  moveWindowDown: () => Promise<void>;
  quitApp: () => Promise<void>;

  // Chat
  sendChatMessage: (message: string) => Promise<string>;

  // Audio processing
  analyzeAudioFromBase64: (data: string, mimeType: string) => Promise<{ text: string; timestamp: number }>;
  analyzeAudioFile: (path: string) => Promise<{ text: string; timestamp: number }>;

  // Settings
  saveApiKey: (apiKey: string) => Promise<{ success: boolean }>;
  getApiKey: () => Promise<string>;

  // Event listeners
  onScreenshotTaken: (callback: (data: { path: string; preview: string }) => void) => () => void;
  onClearAll: (callback: () => void) => () => void;

  // Generic invoke
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
