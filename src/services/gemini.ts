// Google Gemini AI Service
// Note: In production, API calls should go through Supabase Edge Functions
// to keep the API key secure

import type {
  GeminiRecipeRequest,
  GeminiRecipeResponse,
  GeminiNutritionRequest,
  GeminiNutritionResponse,
  GeminiImageAnalysisRequest,
  GeminiImageAnalysisResponse,
} from '../types/api.types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_MODEL = 'gemini-pro';
const GEMINI_VISION_MODEL = 'gemini-pro-vision';

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Generate recipes based on available ingredients
  async generateRecipes(request: GeminiRecipeRequest): Promise<GeminiRecipeResponse> {
    const prompt = this.buildRecipePrompt(request);

    try {
      const response = await this.callGemini(prompt, GEMINI_MODEL);
      return this.parseRecipeResponse(response);
    } catch (error) {
      console.error('Error generating recipes:', error);
      throw new Error('Fehler beim Generieren der Rezepte');
    }
  }

  // Analyze nutrition from recipe ingredients
  async analyzeNutrition(
    request: GeminiNutritionRequest
  ): Promise<GeminiNutritionResponse> {
    const prompt = this.buildNutritionPrompt(request);

    try {
      const response = await this.callGemini(prompt, GEMINI_MODEL);
      return this.parseNutritionResponse(response);
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      throw new Error('Fehler bei der Nährwertanalyse');
    }
  }

  // Analyze image for pantry items or recipe detection
  async analyzeImage(
    request: GeminiImageAnalysisRequest
  ): Promise<GeminiImageAnalysisResponse> {
    const prompt = this.buildImageAnalysisPrompt(request.type);

    try {
      const response = await this.callGeminiVision(
        prompt,
        request.imageBase64,
        GEMINI_VISION_MODEL
      );
      return this.parseImageAnalysisResponse(response);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Fehler bei der Bildanalyse');
    }
  }

  // Suggest recipes based on search query
  async suggestRecipes(query: string): Promise<string[]> {
    const prompt = `
Du bist ein Koch-Assistent. Basierend auf der Suchanfrage "${query}",
schlage 5 relevante Rezepttitel vor. Gebe nur die Titel zurück,
jeweils in einer neuen Zeile, ohne Nummerierung.
    `.trim();

    try {
      const response = await this.callGemini(prompt, GEMINI_MODEL);
      return response.split('\n').filter((line) => line.trim().length > 0);
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      return [];
    }
  }

  // Private helper methods
  private buildRecipePrompt(request: GeminiRecipeRequest): string {
    const { ingredients, preferences } = request;

    let prompt = `
Du bist ein professioneller Koch. Erstelle Rezepte basierend auf folgenden Zutaten:
${ingredients.join(', ')}

Präferenzen:
`;

    if (preferences?.dietary) {
      prompt += `- Ernährungsweise: ${preferences.dietary.join(', ')}\n`;
    }
    if (preferences?.cuisine) {
      prompt += `- Küche: ${preferences.cuisine}\n`;
    }
    if (preferences?.maxTime) {
      prompt += `- Maximale Zeit: ${preferences.maxTime} Minuten\n`;
    }
    if (preferences?.difficulty) {
      prompt += `- Schwierigkeit: ${preferences.difficulty}\n`;
    }
    if (preferences?.servings) {
      prompt += `- Portionen: ${preferences.servings}\n`;
    }

    prompt += `
Erstelle 3 verschiedene Rezepte im folgenden JSON-Format:
{
  "recipes": [
    {
      "title": "Rezeptname",
      "description": "Kurze Beschreibung",
      "ingredients": [
        {"name": "Zutat", "quantity": 100, "unit": "g"}
      ],
      "instructions": [
        {"step": 1, "description": "Anweisung"}
      ],
      "prepTime": 15,
      "cookTime": 30,
      "difficulty": "Einfach",
      "servings": 4,
      "estimatedCalories": 350
    }
  ]
}

Wichtig: Antworte NUR mit validem JSON, ohne zusätzlichen Text.
    `.trim();

    return prompt;
  }

  private buildNutritionPrompt(request: GeminiNutritionRequest): string {
    const ingredientsList = request.ingredients
      .map((ing) => `${ing.quantity} ${ing.unit} ${ing.name}`)
      .join('\n');

    return `
Analysiere die Nährwerte für folgende Zutaten:

${ingredientsList}

Gebe die Nährwerte im folgenden JSON-Format zurück:
{
  "totalCalories": 850,
  "macros": {
    "protein": 45,
    "carbs": 80,
    "fat": 25,
    "fiber": 12
  },
  "vitamins": {
    "A": 500,
    "C": 60,
    "D": 10
  },
  "minerals": {
    "Calcium": 300,
    "Iron": 15
  },
  "perServing": {
    "calories": 425,
    "protein": 22.5,
    "carbs": 40,
    "fat": 12.5
  }
}

Wichtig: Antworte NUR mit validem JSON, ohne zusätzlichen Text.
Alle Werte in Gramm (außer Kalorien), pro Portion bei 2 Portionen.
    `.trim();
  }

  private buildImageAnalysisPrompt(type: string): string {
    if (type === 'pantry') {
      return `
Analysiere dieses Bild und identifiziere alle sichtbaren Lebensmittel und Zutaten.
Für jedes erkannte Element, schätze die Menge ab wenn möglich.

Antworte im folgenden JSON-Format:
{
  "detectedItems": [
    {
      "name": "Tomaten",
      "confidence": 0.95,
      "quantity": 5,
      "unit": "Stück"
    }
  ],
  "suggestions": ["Tomatensauce zubereiten", "Salat machen"]
}

Wichtig: Antworte NUR mit validem JSON.
      `.trim();
    }

    return `
Analysiere dieses Bild und beschreibe, was du siehst.
Antworte im JSON-Format mit einer Liste von erkannten Objekten.
    `.trim();
  }

  private async callGemini(prompt: string, model: string): Promise<string> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private async callGeminiVision(
    prompt: string,
    imageBase64: string,
    model: string
  ): Promise<string> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private parseRecipeResponse(response: string): GeminiRecipeResponse {
    try {
      // Remove markdown code blocks if present
      const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse recipe response:', response);
      throw new Error('Ungültige Antwort vom AI-Service');
    }
  }

  private parseNutritionResponse(response: string): GeminiNutritionResponse {
    try {
      const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse nutrition response:', response);
      throw new Error('Ungültige Antwort vom AI-Service');
    }
  }

  private parseImageAnalysisResponse(response: string): GeminiImageAnalysisResponse {
    try {
      const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse image analysis response:', response);
      throw new Error('Ungültige Antwort vom AI-Service');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService(GEMINI_API_KEY);

// Export class for testing
export { GeminiService };
