import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import { initializeIpcHandlers } from "./ipcHandlers";
import { WindowHelper } from "./WindowHelper";
import { ScreenshotHelper } from "./ScreenshotHelper";
import { ShortcutsHelper } from "./ShortcutsHelper";
import { LLMHelper } from "./LLMHelper";
import path from "node:path";
import fs from "node:fs";

export class AppState {
  private static instance: AppState | null = null;

  public windowHelper: WindowHelper;
  public screenshotHelper: ScreenshotHelper;
  public shortcutsHelper: ShortcutsHelper;
  public llmHelper: LLMHelper | null = null;
  private tray: Tray | null = null;
  private apiKey: string = "";
  private configPath: string;

  constructor() {
    // Initialize helpers
    this.windowHelper = new WindowHelper();
    this.screenshotHelper = new ScreenshotHelper();

    // Initialize shortcuts with callbacks
    this.shortcutsHelper = new ShortcutsHelper({
      onToggleWindow: () => this.toggleMainWindow(),
      onShowWindow: () => this.centerAndShowWindow(),
      onTakeScreenshot: async () => await this.handleScreenshotShortcut(),
      onMoveLeft: () => this.windowHelper.moveWindowLeft(),
      onMoveRight: () => this.windowHelper.moveWindowRight(),
      onMoveUp: () => this.windowHelper.moveWindowUp(),
      onMoveDown: () => this.windowHelper.moveWindowDown(),
      onClearAll: () => this.clearAll(),
    });

    // Config path for storing API key
    this.configPath = path.join(app.getPath("userData"), "config.json");
    this.loadConfig();
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
        this.apiKey = config.apiKey || "";

        if (this.apiKey) {
          this.llmHelper = new LLMHelper(this.apiKey);
          console.log("[AppState] API key loaded from config");
        }
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  }

  private saveConfig(): void {
    try {
      const config = { apiKey: this.apiKey };
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      console.log("[AppState] Config saved");
    } catch (error) {
      console.error("Error saving config:", error);
    }
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.llmHelper = new LLMHelper(apiKey);
    this.saveConfig();
    console.log("[AppState] API key set and LLM initialized");
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  // Window management
  public getMainWindow(): BrowserWindow | null {
    return this.windowHelper.getMainWindow();
  }

  public createWindow(): void {
    this.windowHelper.createWindow();
  }

  public hideMainWindow(): void {
    this.windowHelper.hideMainWindow();
  }

  public showMainWindow(): void {
    this.windowHelper.showMainWindow();
  }

  public toggleMainWindow(): void {
    this.windowHelper.toggleMainWindow();
  }

  public centerAndShowWindow(): void {
    this.windowHelper.centerAndShowWindow();
  }

  public isVisible(): boolean {
    return this.windowHelper.isVisible();
  }

  // Screenshot management
  public async takeScreenshot(): Promise<string> {
    const screenshotPath = await this.screenshotHelper.takeScreenshot(
      () => this.hideMainWindow(),
      () => this.showMainWindow()
    );
    return screenshotPath;
  }

  private async handleScreenshotShortcut(): Promise<void> {
    try {
      const screenshotPath = await this.takeScreenshot();
      const preview = await this.screenshotHelper.getImagePreview(
        screenshotPath
      );
      const mainWindow = this.getMainWindow();
      if (mainWindow) {
        mainWindow.webContents.send("screenshot-taken", {
          path: screenshotPath,
          preview,
        });
      }
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  }

  public clearAll(): void {
    this.screenshotHelper.clearQueue();
    const mainWindow = this.getMainWindow();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("clear-all");
    }
    console.log("[AppState] Cleared all screenshots");
  }

  // Tray management
  public createTray(): void {
    const image = nativeImage.createEmpty();
    let trayImage = image;

    try {
      trayImage = nativeImage.createFromBuffer(Buffer.alloc(0));
    } catch (error) {
      console.log("Using empty tray image");
      trayImage = nativeImage.createEmpty();
    }

    this.tray = new Tray(trayImage);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show Cluely Desktop",
        click: () => {
          this.centerAndShowWindow();
        },
      },
      {
        label: "Toggle Window",
        click: () => {
          this.toggleMainWindow();
        },
      },
      {
        type: "separator",
      },
      {
        label: "Take Screenshot (Cmd+H)",
        click: async () => {
          await this.handleScreenshotShortcut();
        },
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setToolTip("Cluely Desktop - Press Cmd+Shift+Space to show");
    this.tray.setContextMenu(contextMenu);

    if (process.platform === "darwin") {
      this.tray.setTitle("CD");
    }

    this.tray.on("double-click", () => {
      this.centerAndShowWindow();
    });
  }
}

// Application initialization
async function initializeApp() {
  const appState = AppState.getInstance();

  // Initialize IPC handlers before window creation
  initializeIpcHandlers(appState);

  app.whenReady().then(() => {
    console.log("App is ready");
    appState.createWindow();
    appState.createTray();
    appState.shortcutsHelper.registerGlobalShortcuts();
  });

  app.on("activate", () => {
    console.log("App activated");
    if (appState.getMainWindow() === null) {
      appState.createWindow();
    }
  });

  // Quit when all windows are closed, except on macOS
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // Hide dock icon on macOS (optional - makes it more "invisible")
  if (app.dock) {
    app.dock.hide();
  }

  // Disable background timer throttling for better performance
  app.commandLine.appendSwitch("disable-background-timer-throttling");
}

// Start the application
initializeApp().catch(console.error);
