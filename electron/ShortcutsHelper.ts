import { globalShortcut, app } from "electron";

export interface ShortcutsCallbacks {
  onToggleWindow: () => void;
  onShowWindow: () => void;
  onTakeScreenshot: () => Promise<void>;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClearAll: () => void;
}

export class ShortcutsHelper {
  private callbacks: ShortcutsCallbacks;

  constructor(callbacks: ShortcutsCallbacks) {
    this.callbacks = callbacks;
  }

  public registerGlobalShortcuts(): void {
    // Show/Center window
    globalShortcut.register("CommandOrControl+Shift+Space", () => {
      console.log("Show/Center window shortcut pressed");
      this.callbacks.onShowWindow();
    });

    // Take screenshot
    globalShortcut.register("CommandOrControl+H", async () => {
      console.log("Taking screenshot...");
      try {
        await this.callbacks.onTakeScreenshot();
      } catch (error) {
        console.error("Error capturing screenshot:", error);
      }
    });

    // Toggle window visibility
    globalShortcut.register("CommandOrControl+B", () => {
      console.log("Toggle window visibility");
      this.callbacks.onToggleWindow();
    });

    // Clear all screenshots
    globalShortcut.register("CommandOrControl+R", () => {
      console.log("Clear all screenshots");
      this.callbacks.onClearAll();
    });

    // Window movement shortcuts
    globalShortcut.register("CommandOrControl+Left", () => {
      console.log("Move window left");
      this.callbacks.onMoveLeft();
    });

    globalShortcut.register("CommandOrControl+Right", () => {
      console.log("Move window right");
      this.callbacks.onMoveRight();
    });

    globalShortcut.register("CommandOrControl+Up", () => {
      console.log("Move window up");
      this.callbacks.onMoveUp();
    });

    globalShortcut.register("CommandOrControl+Down", () => {
      console.log("Move window down");
      this.callbacks.onMoveDown();
    });

    // Unregister shortcuts when quitting
    app.on("will-quit", () => {
      globalShortcut.unregisterAll();
    });

    console.log("[ShortcutsHelper] Global shortcuts registered");
  }

  public unregisterAll(): void {
    globalShortcut.unregisterAll();
    console.log("[ShortcutsHelper] All shortcuts unregistered");
  }
}
