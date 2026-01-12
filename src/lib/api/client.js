// Base API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Base fetch function with authentication and error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { ok: true, data: null };
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
      // Handle API error responses
      const errorMessage = data.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return { ok: true, data };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  const { data } = await apiRequest(url, { method: 'GET' });
  return data;
}

/**
 * POST request helper
 */
export async function apiPost(endpoint, body = {}) {
  const { data } = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data;
}

/**
 * PUT request helper
 */
export async function apiPut(endpoint, body = {}) {
  const { data } = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return data;
}

/**
 * DELETE request helper
 */
export async function apiDelete(endpoint) {
  const { data } = await apiRequest(endpoint, { method: 'DELETE' });
  return data;
}


