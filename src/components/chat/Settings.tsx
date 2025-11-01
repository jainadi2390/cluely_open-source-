import React, { useState } from 'react';
import { X, Moon, Sun, Key } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  theme,
  onThemeToggle,
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <Card className="relative w-full max-w-md mx-4 z-10 bg-[#0b0b0f] border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white">Settings</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* API Key Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-white">
              <Key className="h-4 w-4" />
              Gemini API Key
            </label>
            <Input
              type={showKey ? 'text' : 'password'}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="font-mono text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {showKey ? 'Hide' : 'Show'} API key
              </button>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-400 hover:underline"
              >
                Get API key
              </a>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Theme</label>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={onThemeToggle}
                className="flex-1"
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={onThemeToggle}
                className="flex-1"
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
