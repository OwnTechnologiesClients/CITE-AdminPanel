import { apiGet } from './client';

/**
 * Get all habits (admin can see all, users see their own)
 */
export async function getHabits(params = {}) {
  try {
    const response = await apiGet('/habits/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
}

/**
 * Get habit by ID
 */
export async function getHabitById(habitId) {
  try {
    const response = await apiGet(`/habits/list/${habitId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habit:', error);
    throw error;
  }
}

/**
 * Get habits for a specific user
 */
export async function getUserHabits(userId) {
  try {
    const response = await apiGet(`/habits/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user habits:', error);
    throw error;
  }
}

/**
 * Get habit streak
 */
export async function getHabitStreak(habitId) {
  try {
    const response = await apiGet(`/habits/list/${habitId}/streak`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habit streak:', error);
    throw error;
  }
}

