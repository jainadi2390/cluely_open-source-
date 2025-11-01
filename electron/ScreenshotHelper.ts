import path from "node:path";
import fs from "node:fs";
import { app } from "electron";
import { v4 as uuidv4 } from "uuid";
import screenshot from "screenshot-desktop";

export class ScreenshotHelper {
  private screenshotQueue: string[] = [];
  private readonly MAX_SCREENSHOTS = 10;
  private readonly screenshotDir: string;

  constructor() {
    // Initialize screenshot directory
    this.screenshotDir = path.join(app.getPath("userData"), "screenshots");

    // Create directory if it doesn't exist
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  public getScreenshotQueue(): string[] {
    return this.screenshotQueue;
  }

  public clearQueue(): void {
    // Delete all screenshots from disk
    this.screenshotQueue.forEach((screenshotPath) => {
      fs.unlink(screenshotPath, (err) => {
        if (err)
          console.error(`Error deleting screenshot at ${screenshotPath}:`, err);
      });
    });
    this.screenshotQueue = [];
  }

  public async takeScreenshot(
    hideMainWindow: () => void,
    showMainWindow: () => void
  ): Promise<string> {
    try {
      hideMainWindow();

      // Add a small delay to ensure window is hidden
      await new Promise((resolve) => setTimeout(resolve, 150));

      const screenshotPath = path.join(this.screenshotDir, `${uuidv4()}.png`);
      await screenshot({ filename: screenshotPath });

      this.screenshotQueue.push(screenshotPath);

      // Remove oldest screenshot if queue exceeds max
      if (this.screenshotQueue.length > this.MAX_SCREENSHOTS) {
        const removedPath = this.screenshotQueue.shift();
        if (removedPath) {
          try {
            await fs.promises.unlink(removedPath);
          } catch (error) {
            console.error("Error removing old screenshot:", error);
          }
        }
      }

      return screenshotPath;
    } catch (error) {
      console.error("Error taking screenshot:", error);
      throw new Error(`Failed to take screenshot: ${(error as Error).message}`);
    } finally {
      // Ensure window is always shown again
      showMainWindow();
    }
  }

  public async getImagePreview(filepath: string): Promise<string> {
    try {
      const data = await fs.promises.readFile(filepath);
      return `data:image/png;base64,${data.toString("base64")}`;
    } catch (error) {
      console.error("Error reading image:", error);
      throw error;
    }
  }

  public async deleteScreenshot(
    path: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await fs.promises.unlink(path);
      this.screenshotQueue = this.screenshotQueue.filter(
        (filePath) => filePath !== path
      );
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error: (error as Error).message };
    }
  }

  public async getScreenshotsWithPreviews(): Promise<
    Array<{ path: string; preview: string }>
  > {
    const screenshots = await Promise.all(
      this.screenshotQueue.map(async (path) => {
        const preview = await this.getImagePreview(path);
        return { path, preview };
      })
    );
    return screenshots;
  }
}
