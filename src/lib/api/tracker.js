import { apiGet, apiPost, apiPut, apiDelete } from './client';

/**
 * Get all activity sessions
 */
export async function getActivitySessions(params = {}) {
  try {
    const response = await apiGet('/tracker/running', params);
    return {
      data: response.data || [],
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching activity sessions:', error);
    throw error;
  }
}

/**
 * Get activity session by ID
 */
export async function getActivitySessionById(sessionId) {
  try {
    const response = await apiGet(`/tracker/running/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activity session:', error);
    throw error;
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStatistics() {
  try {
    const response = await apiGet('/tracker/running/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    throw error;
  }
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit = 5) {
  try {
    const response = await apiGet('/tracker/running/recent', { limit });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
}

/**
 * Delete activity session
 */
export async function deleteActivitySession(sessionId) {
  try {
    await apiDelete(`/tracker/running/${sessionId}`);
    return true;
  } catch (error) {
    console.error('Error deleting activity session:', error);
    throw error;
  }
}

/**
 * Get steps data
 */
export async function getStepsData(params = {}) {
  try {
    const response = await apiGet('/tracker/steps', params);
    return {
      data: response.data || [],
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching steps data:', error);
    throw error;
  }
}

/**
 * Get steps statistics
 */
export async function getStepsStatistics(period = 'week') {
  try {
    const response = await apiGet('/tracker/steps/statistics', { period });
    return response.data;
  } catch (error) {
    console.error('Error fetching steps statistics:', error);
    throw error;
  }
}

/**
 * Get weight data
 */
export async function getWeightData(params = {}) {
  try {
    const response = await apiGet('/tracker/weight', params);
    return {
      data: response.data || [],
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching weight data:', error);
    throw error;
  }
}

/**
 * Get weight statistics
 */
export async function getWeightStatistics() {
  try {
    const response = await apiGet('/tracker/weight/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching weight statistics:', error);
    throw error;
  }
}

