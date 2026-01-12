import { apiGet, apiPut } from './client';

/**
 * Get all users (admin only)
 */
export async function getUsers(params = {}) {
  try {
    const response = await apiGet('/users/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const response = await apiGet(`/users/list/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Update user by ID
 */
export async function updateUser(userId, userData) {
  try {
    const response = await apiPut(`/users/list/${userId}`, userData);
    return response.data || response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

