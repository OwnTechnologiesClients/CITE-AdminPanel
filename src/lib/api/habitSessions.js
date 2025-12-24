import { apiGet } from './client';

/**
 * Get all habit sessions (admin only)
 */
export async function getHabitSessions(params = {}) {
  try {
    const response = await apiGet('/habit-sessions', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching habit sessions:', error);
    throw error;
  }
}

/**
 * Get active habit sessions
 */
export async function getActiveHabitSessions() {
  try {
    const response = await apiGet('/habit-sessions/active');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching active habit sessions:', error);
    throw error;
  }
}

/**
 * Get habit session by ID
 */
export async function getHabitSessionById(sessionId) {
  try {
    const response = await apiGet(`/habit-sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching habit session:', error);
    throw error;
  }
}

/**
 * Get sessions for a specific habit
 */
export async function getHabitSessionsByHabit(habitId) {
  try {
    const response = await apiGet(`/habit-sessions/habit/${habitId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching habit sessions:', error);
    throw error;
  }
}


