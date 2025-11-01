import { useState, useEffect } from "react";
import { X, Camera, Trash2, Send } from "lucide-react";
import { Button } from "./ui/button";

interface Screenshot {
  path: string;
  preview: string;
}

interface ScreenshotGalleryProps {
  onAnalyze?: (imagePaths: string[], prompt?: string) => void;
}

export function ScreenshotGallery({ onAnalyze }: ScreenshotGalleryProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedScreenshots, setSelectedScreenshots] = useState<Set<string>>(
    new Set()
  );
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check if we're in Electron
  const isElectron = typeof window !== "undefined" && window.electronAPI;

  useEffect(() => {
    if (!isElectron) return;

    // Load existing screenshots
    loadScreenshots();

    // Listen for new screenshots
    const cleanup = window.electronAPI.onScreenshotTaken((data) => {
      setScreenshots((prev) => [...prev, data]);
    });

    // Listen for clear all event
    const cleanupClear = window.electronAPI.onClearAll(() => {
      setScreenshots([]);
      setSelectedScreenshots(new Set());
    });

    return () => {
      cleanup();
      cleanupClear();
    };
  }, [isElectron]);

  const loadScreenshots = async () => {
    if (!isElectron) return;
    try {
      const shots = await window.electronAPI.getScreenshots();
      setScreenshots(shots);
    } catch (error) {
      console.error("Error loading screenshots:", error);
    }
  };

  const takeScreenshot = async () => {
    if (!isElectron) return;
    try {
      const screenshot = await window.electronAPI.takeScreenshot();
      setScreenshots((prev) => [...prev, screenshot]);
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  };

  const deleteScreenshot = async (path: string) => {
    if (!isElectron) return;
    try {
      await window.electronAPI.deleteScreenshot(path);
      setScreenshots((prev) => prev.filter((s) => s.path !== path));
      setSelectedScreenshots((prev) => {
        const newSet = new Set(prev);
        newSet.delete(path);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting screenshot:", error);
    }
  };

  const toggleSelection = (path: string) => {
    setSelectedScreenshots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleAnalyze = async () => {
    if (!isElectron || selectedScreenshots.size === 0) return;

    setIsAnalyzing(true);
    try {
      const paths = Array.from(selectedScreenshots);
      const result = await window.electronAPI.analyzeScreenshots(
        paths,
        analysisPrompt || undefined
      );

      // Call the callback with results
      if (onAnalyze) {
        onAnalyze(paths, result);
      }

      // Clear selection and prompt
      setSelectedScreenshots(new Set());
      setAnalysisPrompt("");
    } catch (error) {
      console.error("Error analyzing screenshots:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isElectron) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Screenshot feature is only available in the desktop app.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <h3 className="font-semibold">Screenshots ({screenshots.length})</h3>
        </div>
        <Button
          onClick={takeScreenshot}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Camera className="w-4 h-4" />
          Capture (Cmd+H)
        </Button>
      </div>

      {/* Screenshot Grid */}
      {screenshots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.path}
              className={`relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                selectedScreenshots.has(screenshot.path)
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleSelection(screenshot.path)}
            >
              <img
                src={screenshot.preview}
                alt="Screenshot"
                className="w-full h-32 object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteScreenshot(screenshot.path);
                }}
                className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {selectedScreenshots.has(screenshot.path) && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No screenshots yet</p>
          <p className="text-sm">Press Cmd+H to capture your screen</p>
        </div>
      )}

      {/* Analysis Section */}
      {selectedScreenshots.size > 0 && (
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedScreenshots.size} selected
            </p>
            <Button
              onClick={() => setSelectedScreenshots(new Set())}
              size="sm"
              variant="ghost"
            >
              Clear
            </Button>
          </div>

          <input
            type="text"
            value={analysisPrompt}
            onChange={(e) => setAnalysisPrompt(e.target.value)}
            placeholder="What would you like to know about these screenshots?"
            className="w-full px-3 py-2 rounded-md border bg-background text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full gap-2"
          >
            {isAnalyzing ? (
              "Analyzing..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Selected
              </>
            )}
          </Button>
        </div>
      )}

      {/* Clear All */}
      {screenshots.length > 0 && (
        <Button
          onClick={() => {
            setScreenshots([]);
            setSelectedScreenshots(new Set());
          }}
          variant="outline"
          size="sm"
          className="w-full gap-2 text-muted-foreground"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Screenshots
        </Button>
      )}
    </div>
  );
}
