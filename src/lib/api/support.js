import { apiGet, apiPatch } from './client';

/**
 * Get all support requests
 * @param {Object} params - Query parameters (status, module)
 */
export async function getSupportRequests(params = {}) {
  try {
    const response = await apiGet('/support', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw error;
  }
}

/**
 * Get support request by ID
 * @param {string} requestId - Support request ID
 */
export async function getSupportRequestById(requestId) {
  try {
    const response = await apiGet(`/support/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching support request:', error);
    throw error;
  }
}

/**
 * Update support request status
 * @param {string} requestId - Support request ID
 * @param {string} status - New status (open, in_progress, resolved, closed)
 */
export async function updateSupportStatus(requestId, status) {
  try {
    const data = await apiPatch(`/support/${requestId}/status`, { status });
    return data;
  } catch (error) {
    console.error('Error updating support request status:', error);
    throw error;
  }
}
