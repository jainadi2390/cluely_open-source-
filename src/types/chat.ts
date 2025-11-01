export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSettings {
  apiKey: string;
  theme: 'light' | 'dark';
  focusMode: boolean;
}

export interface ApiError {
  message: string;
  type: 'invalid_key' | 'rate_limit' | 'network' | 'unknown';
}
