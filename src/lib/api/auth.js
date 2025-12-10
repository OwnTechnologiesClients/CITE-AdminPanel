import { apiPost, apiGet } from './client';

/**
 * Login with email/username and password
 * @param {string} identifier - Email or username
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function login(identifier, password) {
  try {
    const response = await apiPost('/auth/login', {
      identifier,
      password,
    });
    
    // Backend may return { token, user } directly or nested in data
    // apiPost already extracts data, so response is the data object
    const token = response?.token || response?.data?.token;
    const user = response?.user || response?.data?.user;
    
    if (!token) {
      throw new Error('No authentication token received from server');
    }
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    
    return { token, user };
  } catch (error) {
    console.error('Error logging in:', error);
    // Re-throw with a more user-friendly message if needed
    if (error.message && !error.message.includes('HTTP')) {
      throw error;
    }
    throw new Error(error.message || 'Failed to login. Please check your credentials.');
  }
}

/**
 * Logout - Clear token from localStorage
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  try {
    const response = await apiGet('/auth/me');
    return response.user || response.data || response;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated (has token)
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

/**
 * Get stored authentication token
 * @returns {string|null}
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

