import { createClient } from '@supabase/supabase-js';

// Environment Variables - Replace with your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth Service
export const authService = {
  async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Pantry Service
export const pantryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(item: Omit<any, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('pantry_items')
      .insert(item as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<any>
  ) {
    const { data, error } = await supabase
      .from('pantry_items')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('pantry_items').delete().eq('id', id);
    if (error) throw error;
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getExpiringSoon(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .lte('expiry_date', futureDate.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// Recipe Service
export const recipeService = {
  async getAll(limit?: number) {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRecipes() {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(recipe: any) {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) throw error;
  },

  async search(query: string, filters?: any) {
    let dbQuery = supabase.from('recipes').select('*');

    // Text search
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters?.difficulty) {
      dbQuery = dbQuery.in('difficulty', filters.difficulty);
    }

    if (filters?.maxPrepTime) {
      dbQuery = dbQuery.lte('prep_time', filters.maxPrepTime);
    }

    if (filters?.maxCookTime) {
      dbQuery = dbQuery.lte('cook_time', filters.maxCookTime);
    }

    if (filters?.maxCalories) {
      dbQuery = dbQuery.lte('calories', filters.maxCalories);
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Goals Service
export const goalsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(goal: any) {
    const { data, error } = await supabase
      .from('user_goals')
      .insert(goal as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('user_goals')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProgress(id: string, currentValue: number) {
    return this.update(id, { current_value: currentValue });
  },

  async delete(id: string) {
    const { error } = await supabase.from('user_goals').delete().eq('id', id);
    if (error) throw error;
  },
};

// Shopping List Service
export const shoppingListService = {
  async getAll() {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(list: any) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert(list as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: any
  ) {
    const { data, error } = await supabase
      .from('shopping_lists')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('shopping_lists').delete().eq('id', id);
    if (error) throw error;
  },

  async getActive() {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('status', 'Aktiv')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Meal Plan Service
export const mealPlanService = {
  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*, recipes(*)')
      .gte('plan_date', startDate)
      .lte('plan_date', endDate)
      .order('plan_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async create(mealPlan: any) {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlan as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('meal_plans').delete().eq('id', id);
    if (error) throw error;
  },

  async getWeekPlan(weekStart: string) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return this.getByDateRange(weekStart, weekEnd.toISOString());
  },
};

// Storage Service
export const storageService = {
  async uploadImage(file: File, bucket: string = 'recipe-images') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  },

  async deleteImage(path: string, bucket: string = 'recipe-images') {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },

  getPublicUrl(path: string, bucket: string = 'recipe-images') {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  },
};
