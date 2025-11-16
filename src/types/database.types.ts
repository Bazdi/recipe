// Database Types - Based on Supabase Schema

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      pantry_items: {
        Row: PantryItem;
        Insert: Omit<PantryItem, 'id' | 'created_at'>;
        Update: Partial<Omit<PantryItem, 'id' | 'created_at'>>;
      };
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at' | 'rating'>;
        Update: Partial<Omit<Recipe, 'id' | 'created_at'>>;
      };
      user_goals: {
        Row: UserGoal;
        Insert: Omit<UserGoal, 'id' | 'created_at'>;
        Update: Partial<Omit<UserGoal, 'id' | 'created_at'>>;
      };
      shopping_lists: {
        Row: ShoppingList;
        Insert: Omit<ShoppingList, 'id' | 'created_at'>;
        Update: Partial<Omit<ShoppingList, 'id' | 'created_at'>>;
      };
      meal_plans: {
        Row: MealPlan;
        Insert: Omit<MealPlan, 'id' | 'created_at'>;
        Update: Partial<Omit<MealPlan, 'id' | 'created_at'>>;
      };
      nutrition_database: {
        Row: NutritionData;
        Insert: Omit<NutritionData, 'id' | 'created_at'>;
        Update: Partial<Omit<NutritionData, 'id' | 'created_at'>>;
      };
    };
  };
}

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  dietary_preferences: DietaryPreferences | null;
  allergies: string[] | null;
  created_at: string;
}

export interface DietaryPreferences {
  vegetarian?: boolean;
  vegan?: boolean;
  pescatarian?: boolean;
  glutenfree?: boolean;
  dairyfree?: boolean;
  nutfree?: boolean;
  halal?: boolean;
  kosher?: boolean;
  other?: string[];
}

// Pantry Items
export interface PantryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  category: PantryCategory;
  photo_url: string | null;
  created_at: string;
}

export type PantryCategory =
  | 'Gemüse'
  | 'Obst'
  | 'Fleisch'
  | 'Fisch'
  | 'Milchprodukte'
  | 'Getreide'
  | 'Gewürze'
  | 'Konserven'
  | 'Tiefkühl'
  | 'Sonstiges';

// Recipes
export interface Recipe {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  prep_time: number; // Minuten
  cook_time: number; // Minuten
  difficulty: Difficulty;
  servings: number;
  calories: number | null; // Pro Portion
  nutrition: NutritionInfo | null;
  tags: string[];
  image_url: string | null;
  rating: number | null;
  created_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  description: string;
  duration?: number; // Optional: Zeit für diesen Schritt in Minuten
}

export type Difficulty = 'Einfach' | 'Mittel' | 'Schwer';

export interface NutritionInfo {
  calories: number;
  protein: number; // Gramm
  carbs: number; // Gramm
  fat: number; // Gramm
  fiber: number; // Gramm
  sugar: number; // Gramm
  sodium: number; // Milligramm
  vitamins?: {
    [key: string]: number; // z.B. "A": 500, "C": 60
  };
  minerals?: {
    [key: string]: number; // z.B. "Calcium": 300, "Iron": 15
  };
}

// User Goals
export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  target_value: number;
  current_value: number;
  unit: string;
  period: GoalPeriod;
  created_at: string;
}

export type GoalType =
  | 'Kalorien'
  | 'Wasser'
  | 'Protein'
  | 'Kohlenhydrate'
  | 'Fett'
  | 'Schritte'
  | 'Gewicht';

export type GoalPeriod = 'Täglich' | 'Wöchentlich' | 'Monatlich';

// Shopping Lists
export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  items: ShoppingItem[];
  status: ShoppingListStatus;
  created_at: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category?: PantryCategory;
}

export type ShoppingListStatus = 'Aktiv' | 'Abgeschlossen' | 'Archiviert';

// Meal Plans
export interface MealPlan {
  id: string;
  user_id: string;
  recipe_id: string;
  date: string; // ISO Date
  meal_type: MealType;
  servings: number;
  notes: string | null;
  is_completed: boolean;
  recipe?: Recipe; // Populated when queried with joins
  created_at: string;
}

export type MealType = 'Frühstück' | 'Mittagessen' | 'Abendessen' | 'Snack';

// Nutrition Database
export interface NutritionData {
  id: string;
  food_name: string;
  aliases: string[] | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  vitamins: { [key: string]: number } | null;
  minerals: { [key: string]: number } | null;
  created_at: string;
}

// Search & Filter Types
export interface SearchFilters {
  difficulty?: Difficulty[];
  maxPrepTime?: number;
  maxCookTime?: number;
  maxCalories?: number;
  tags?: string[];
  ingredients?: string[];
  excludeIngredients?: string[];
}

export interface RecipeSearchResult extends Recipe {
  match_score?: number;
  available_ingredients?: string[];
  missing_ingredients?: string[];
}
