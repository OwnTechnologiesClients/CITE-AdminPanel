import { apiGet } from './client';

/**
 * Get all challenges (admin only - read-only)
 * @param {Object} params - Query parameters (module, challengeStatus, participantId, creatorId)
 */
export async function getChallenges(params = {}) {
  try {
    const response = await apiGet('/challenges/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}

/**
 * Get challenge by ID (admin only - read-only)
 * @param {string} challengeId - Challenge ID
 */
export async function getChallengeById(challengeId) {
  try {
    const response = await apiGet(`/challenges/list/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
}
