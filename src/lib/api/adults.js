import { apiGet } from './client';

/**
 * Get adult module dashboard statistics
 */
export async function getAdultDashboardStats() {
  try {
    const response = await apiGet('/adults/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching adult dashboard stats:', error);
    throw error;
  }
}

/**
 * Get habit analytics
 */
export async function getHabitAnalytics() {
  try {
    const response = await apiGet('/adults/dashboard/analytics/habits');
    return response.data;
  } catch (error) {
    console.error('Error fetching habit analytics:', error);
    throw error;
  }
}

/**
 * Get reflection analytics
 */
export async function getReflectionAnalytics() {
  try {
    const response = await apiGet('/adults/dashboard/analytics/reflections');
    return response.data;
  } catch (error) {
    console.error('Error fetching reflection analytics:', error);
    throw error;
  }
}

/**
 * Get user engagement analytics
 */
export async function getUserEngagementAnalytics() {
  try {
    const response = await apiGet('/adults/dashboard/analytics/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching user engagement analytics:', error);
    throw error;
  }
}

