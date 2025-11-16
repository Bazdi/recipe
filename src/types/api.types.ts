// API Response Types

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Auth Types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  displayName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
  error: ApiError | null;
}

// Gemini AI Types
export interface GeminiRecipeRequest {
  ingredients: string[];
  preferences?: {
    dietary?: string[];
    cuisine?: string;
    maxTime?: number;
    difficulty?: string;
    servings?: number;
  };
}

export interface GeminiRecipeResponse {
  recipes: {
    title: string;
    description: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
    instructions: Array<{
      step: number;
      description: string;
    }>;
    prepTime: number;
    cookTime: number;
    difficulty: string;
    servings: number;
    estimatedCalories: number;
  }[];
}

export interface GeminiNutritionRequest {
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
}

export interface GeminiNutritionResponse {
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  perServing?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface GeminiImageAnalysisRequest {
  imageBase64: string;
  type: 'pantry' | 'recipe' | 'nutrition';
}

export interface GeminiImageAnalysisResponse {
  detectedItems: Array<{
    name: string;
    confidence: number;
    quantity?: number;
    unit?: string;
  }>;
  suggestions?: string[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// File Upload
export interface FileUploadResponse {
  url: string;
  path: string;
  size: number;
  mimeType: string;
}
