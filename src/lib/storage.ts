const STORAGE_KEYS = {
  API_KEY: 'cluely_lite_api_key',
  THEME: 'cluely_lite_theme',
  FOCUS_MODE: 'cluely_lite_focus_mode',
} as const;

export const storage = {
  // API Key
  getApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  },

  setApiKey: (key: string): void => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  },

  removeApiKey: (): void => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Theme
  getTheme: (): 'light' | 'dark' => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme === 'dark' || theme === 'light') ? theme : 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Focus Mode
  getFocusMode: (): boolean => {
    const focusMode = localStorage.getItem(STORAGE_KEYS.FOCUS_MODE);
    return focusMode === 'true';
  },

  setFocusMode: (enabled: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.FOCUS_MODE, enabled.toString());
  },
};
