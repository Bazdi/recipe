-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users_profile table
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  dietary_preferences JSONB DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pantry_items table
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL,
  expiry_date DATE,
  category TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions JSONB NOT NULL DEFAULT '[]',
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Einfach', 'Mittel', 'Schwer')),
  servings INTEGER NOT NULL DEFAULT 4,
  calories INTEGER,
  nutrition JSONB,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_goals table
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value DECIMAL(10, 2) NOT NULL,
  current_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('Täglich', 'Wöchentlich', 'Monatlich')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'Aktiv' CHECK (status IN ('Aktiv', 'Abgeschlossen', 'Archiviert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('Frühstück', 'Mittagessen', 'Abendessen', 'Snack')),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  servings INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nutrition_database table
CREATE TABLE nutrition_database (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  food_name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  calories_per_100g DECIMAL(10, 2) NOT NULL,
  protein_per_100g DECIMAL(10, 2) NOT NULL,
  carbs_per_100g DECIMAL(10, 2) NOT NULL,
  fat_per_100g DECIMAL(10, 2) NOT NULL,
  fiber_per_100g DECIMAL(10, 2) NOT NULL,
  vitamins JSONB,
  minerals JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_pantry_items_user_id ON pantry_items(user_id);
CREATE INDEX idx_pantry_items_category ON pantry_items(category);
CREATE INDEX idx_pantry_items_expiry_date ON pantry_items(expiry_date);

CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_title_search ON recipes USING GIN(to_tsvector('german', title));
CREATE INDEX idx_recipes_description_search ON recipes USING GIN(to_tsvector('german', description));

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_lists_status ON shopping_lists(status);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_date ON meal_plans(plan_date);
CREATE INDEX idx_meal_plans_recipe_id ON meal_plans(recipe_id);

CREATE INDEX idx_nutrition_database_food_name ON nutrition_database(food_name);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comments for documentation
COMMENT ON TABLE users_profile IS 'User profile information and preferences';
COMMENT ON TABLE pantry_items IS 'User pantry/ingredient inventory';
COMMENT ON TABLE recipes IS 'Recipe database with user and public recipes';
COMMENT ON TABLE user_goals IS 'User health and nutrition goals';
COMMENT ON TABLE shopping_lists IS 'Shopping lists with items';
COMMENT ON TABLE meal_plans IS 'Meal planning calendar';
COMMENT ON TABLE nutrition_database IS 'Nutrition information database';
