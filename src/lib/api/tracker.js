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

/**
 * Start a challenge tracker session
 * @param {Object} params - Session parameters
 * @param {string} params.challengeId - Challenge ID
 * @param {number} params.dayNumber - Day number in the challenge
 * @param {string} [params.activityType] - Activity type (running, walking, cycling, etc.)
 * @returns {Promise<Object>} Created session data with sessionId
 */
export async function startChallengeSession({ challengeId, dayNumber, activityType = 'running' }) {
  try {
    const response = await apiPost('/tracker/running/start', {
      source: 'challenge',
      challengeId,
      dayNumber,
      activityType,
    });
    return response.data;
  } catch (error) {
    console.error('Error starting challenge session:', error);
    throw error;
  }
}

/**
 * End/complete a challenge tracker session
 * @param {string} sessionId - Session ID
 * @param {Object} sessionData - Session completion data
 * @param {number} sessionData.durationSeconds - Duration in seconds
 * @param {number} [sessionData.distanceMeters] - Distance in meters
 * @param {number} [sessionData.calories] - Calories burned
 * @param {number} [sessionData.averageSpeed] - Average speed (km/h)
 * @param {number} [sessionData.averagePace] - Average pace (min/km)
 * @param {Array} [sessionData.gpsPoints] - GPS tracking points
 * @param {string} [sessionData.polyline] - Encoded polyline for route
 * @param {Object} [sessionData.startLocation] - { lat, lng }
 * @param {Object} [sessionData.endLocation] - { lat, lng }
 * @param {boolean} [sessionData.wasGpsOn] - Whether GPS was enabled
 * @param {number} [sessionData.minAccuracy] - Minimum GPS accuracy achieved
 * @returns {Promise<Object>} Completed session data
 */
export async function endChallengeSession(sessionId, sessionData) {
  try {
    const response = await apiPost(`/tracker/running/${sessionId}/end`, {
      ...sessionData,
      status: 'completed',
    });
    return response.data;
  } catch (error) {
    console.error('Error ending challenge session:', error);
    throw error;
  }
}

/**
 * Get tracker sessions for a specific challenge
 * @param {string} challengeId - Challenge ID
 * @param {Object} [params] - Additional query parameters
 * @param {number} [params.dayNumber] - Filter by specific day number
 * @param {string} [params.status] - Filter by status (completed, active, cancelled, etc.)
 * @param {string} [params.userId] - Filter by user ID
 * @returns {Promise<Object>} Sessions data with pagination
 */
export async function getChallengeSessions(challengeId, params = {}) {
  try {
    const response = await apiGet('/tracker/running', {
      source: 'challenge',
      challengeId,
      ...params,
    });
    return {
      data: response.data || [],
      pagination: response.pagination || {},
    };
  } catch (error) {
    console.error('Error fetching challenge sessions:', error);
    throw error;
  }
}

/**
 * Get tracker sessions for a specific challenge day
 * @param {string} challengeId - Challenge ID
 * @param {number} dayNumber - Day number
 * @param {string} [userId] - Optional user ID filter
 * @returns {Promise<Array>} Array of sessions for that day
 */
export async function getChallengeDaySessions(challengeId, dayNumber, userId = null) {
  try {
    const params = {
      source: 'challenge',
      challengeId,
      dayNumber,
    };
    if (userId) {
      params.userId = userId;
    }
    const response = await apiGet('/tracker/running', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching challenge day sessions:', error);
    throw error;
  }
}

/**
 * Cancel/abort a challenge tracker session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Updated session data
 */
export async function cancelChallengeSession(sessionId) {
  try {
    const response = await apiPut(`/tracker/running/${sessionId}`, {
      status: 'cancelled',
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling challenge session:', error);
    throw error;
  }
}
