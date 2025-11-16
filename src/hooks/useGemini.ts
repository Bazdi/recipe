import { useState } from 'react';
import { geminiService } from '../services/gemini';
import type {
  GeminiRecipeRequest,
  GeminiRecipeResponse,
  GeminiNutritionRequest,
  GeminiNutritionResponse,
  GeminiImageAnalysisRequest,
  GeminiImageAnalysisResponse,
} from '../types/api.types';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecipes = async (
    request: GeminiRecipeRequest
  ): Promise<GeminiRecipeResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiService.generateRecipes(request);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Generieren der Rezepte';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeNutrition = async (
    request: GeminiNutritionRequest
  ): Promise<GeminiNutritionResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiService.analyzeNutrition(request);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler bei der Nährwertanalyse';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async (
    request: GeminiImageAnalysisRequest
  ): Promise<GeminiImageAnalysisResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiService.analyzeImage(request);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler bei der Bildanalyse';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const suggestRecipes = async (query: string): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const suggestions = await geminiService.suggestRecipes(query);
      return suggestions;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Abrufen von Vorschlägen';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateRecipes,
    analyzeNutrition,
    analyzeImage,
    suggestRecipes,
  };
}
