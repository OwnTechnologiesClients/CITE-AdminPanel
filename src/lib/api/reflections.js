import { apiGet } from './client';

/**
 * Get all reflections (admin can see all, users see their own)
 */
export async function getReflections(params = {}) {
  try {
    const response = await apiGet('/reflections/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching reflections:', error);
    throw error;
  }
}

/**
 * Get reflection by ID
 */
export async function getReflectionById(reflectionId) {
  try {
    const response = await apiGet(`/reflections/list/${reflectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reflection:', error);
    throw error;
  }
}

/**
 * Get reflections for a specific user
 */
export async function getUserReflections(userId) {
  try {
    const response = await apiGet(`/reflections/user/${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user reflections:', error);
    throw error;
  }
}

/**
 * Get reflection stats for a user
 */
export async function getUserReflectionStats(userId) {
  try {
    const response = await apiGet(`/reflections/user/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reflection stats:', error);
    throw error;
  }
}

