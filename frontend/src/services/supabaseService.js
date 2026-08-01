import { supabase } from '../supabaseClient';

/**
 * Fetch user profile from Supabase profiles table
 */
export async function fetchUserProfile(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (data) {
      return {
        name: data.name || '',
        email: data.email || '',
        age: data.age || '34',
        gender: data.gender || 'male',
        targetWeight: data.target_weight || '70',
        dietPref: data.diet_pref || 'Vegetarian (Pure Veg)',
        healthGoals: data.health_goals || ['Type 2 Diabetes Control', 'Weight Loss & Fat Loss'],
      };
    }
    return null;
  } catch (err) {
    console.error('Unexpected error fetching profile:', err);
    return null;
  }
}

/**
 * Upsert (Create or Update) user profile in Supabase profiles table
 */
export async function upsertUserProfile(userId, profile) {
  if (!userId) return;
  try {
    const payload = {
      id: userId,
      name: profile.name || '',
      email: profile.email || '',
      age: profile.age || '',
      gender: profile.gender || '',
      target_weight: profile.targetWeight || '',
      diet_pref: profile.dietPref || '',
      health_goals: profile.healthGoals || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Error saving profile to Supabase:', error);
    }
  } catch (err) {
    console.error('Unexpected error saving profile:', err);
  }
}

/**
 * Fetch all meal logs for the authenticated user from Supabase
 */
export async function fetchMealLogs(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meal logs:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      patient_id: row.patient_id,
      patient_name: row.patient_name,
      meal_time: row.meal_time,
      food_items: row.food_items || [],
      medical_conditions: row.medical_conditions || [],
      nutritional_breakdown: row.nutritional_breakdown || {},
      detailed_recommendations: row.detailed_recommendations || [],
      ingredient_modifications: row.ingredient_modifications || {},
      message_sent: row.message_sent || false,
      positive_notes: row.positive_notes || [],
      general_tips: row.general_tips || [],
      created_at: row.created_at
        ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      raw_created_at: row.created_at,
    }));
  } catch (err) {
    console.error('Unexpected error fetching meal logs:', err);
    return [];
  }
}

/**
 * Insert a new meal log into Supabase meal_logs table
 */
export async function createMealLog(userId, historyItem) {
  if (!userId) return null;
  try {
    const payload = {
      user_id: userId,
      patient_id: historyItem.patient_id || 'P001',
      patient_name: historyItem.patient_name || 'Patient',
      meal_time: historyItem.meal_time || 'lunch',
      food_items: historyItem.food_items || [],
      medical_conditions: historyItem.medical_conditions || [],
      nutritional_breakdown: historyItem.nutritional_breakdown || {},
      detailed_recommendations: historyItem.detailed_recommendations || [],
      ingredient_modifications: historyItem.ingredient_modifications || {},
      message_sent: historyItem.message_sent || false,
      positive_notes: historyItem.positive_notes || [],
      general_tips: historyItem.general_tips || [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('meal_logs')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating meal log in Supabase:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error creating meal log:', err);
    return null;
  }
}

/**
 * Delete a specific meal log by ID
 */
export async function deleteMealLog(userId, logId) {
  if (!userId || !logId) return;
  try {
    const { error } = await supabase
      .from('meal_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting meal log:', error);
    }
  } catch (err) {
    console.error('Unexpected error deleting meal log:', err);
  }
}

/**
 * Clear all meal logs for a user from Supabase
 */
export async function clearAllMealLogs(userId) {
  if (!userId) return;
  try {
    const { error } = await supabase
      .from('meal_logs')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing meal logs:', error);
    }
  } catch (err) {
    console.error('Unexpected error clearing meal logs:', err);
  }
}
