import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { ApiError } from '../types/chat';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const initializeGemini = (apiKey: string): void => {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    throw {
      message: 'Failed to initialize Gemini API',
      type: 'invalid_key',
    } as ApiError;
  }
};

export const sendMessage = async (message: string): Promise<string> => {
  if (!model) {
    throw {
      message: 'Gemini API not initialized. Please set your API key in settings.',
      type: 'invalid_key',
    } as ApiError;
  }

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    // Handle different error types
    if (error?.message?.includes('API key')) {
      throw {
        message: 'Invalid API key. Please check your API key in settings.',
        type: 'invalid_key',
      } as ApiError;
    }

    if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      throw {
        message: 'Rate limit exceeded. Please try again later.',
        type: 'rate_limit',
      } as ApiError;
    }

    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      throw {
        message: 'Network error. Please check your connection.',
        type: 'network',
      } as ApiError;
    }

    throw {
      message: error?.message || 'An unexpected error occurred.',
      type: 'unknown',
    } as ApiError;
  }
};

export const isApiKeyValid = (apiKey: string): boolean => {
  return Boolean(apiKey && apiKey.trim().length > 0);
};
