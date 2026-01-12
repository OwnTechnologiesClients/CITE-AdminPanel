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
 * Logout - Clear token from localStorage and redirect to login
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  }
}

/**
 * Get current authenticated user info from token
 * Note: Token contains user info, but we can also fetch from /users/list/:id if needed
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  try {
    // Since token contains user info, we can decode it
    // But for consistency, we'll use the users endpoint
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    // Decode token to get user ID (just for extracting info, not for verification)
    // Actual verification happens via API call
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const userId = payload.id;

    if (!userId) {
      throw new Error('No user ID in token');
    }

    // Return basic info from token
    return {
      id: userId,
      username: payload.username,
      userType: payload.userType,
      isOwner: payload.isOwner || false,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
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

/**
 * Verify if token is valid by calling the backend
 * Uses /users/list endpoint with limit=1 as a lightweight auth check
 * @returns {Promise<boolean>}
 */
export async function verifyToken() {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    // Use a lightweight authenticated endpoint to verify token
    // Using /users/list with limit=1 is lightweight
    const { apiGet } = await import('./client');
    await apiGet('/users/list', { limit: 1 });
    return true;
  } catch (error) {
    // If error (especially 401), token is invalid or expired
    if (error.message?.includes('401') || error.message?.includes('Invalid token') || error.message?.includes('No token')) {
      console.error('Token verification failed:', error);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return false;
    }
    // For other errors, assume token is valid (network issues, etc.)
    // Don't log them as token verification failures
    return true;
  }
}
