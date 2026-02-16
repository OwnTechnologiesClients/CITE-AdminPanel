import { apiGet, apiPost, apiPut, apiDelete } from './client';

/**
 * Get all adult challenges
 * @param {Object} params - Query parameters
 */
export async function getAdultChallenges(params = {}) {
  try {
    const response = await apiGet('/adult-challenges', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching adult challenges:', error);
    throw error;
  }
}

/**
 * Get adult challenge by ID
 * @param {string} challengeId - Challenge ID
 */
export async function getAdultChallengeById(challengeId) {
  try {
    const response = await apiGet(`/adult-challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching adult challenge:', error);
    throw error;
  }
}

/**
 * Get challenge participants
 * @param {string} challengeId - Challenge ID
 */
export async function getChallengeParticipants(challengeId) {
  try {
    const response = await apiGet(`/adult-challenges/${challengeId}/participants`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}

/**
 * Get participant progress
 * @param {string} challengeId - Challenge ID
 * @param {string} userId - User ID
 */
export async function getParticipantProgress(challengeId, userId) {
  try {
    const response = await apiGet(`/adult-challenges/${challengeId}/participants/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching participant progress:', error);
    throw error;
  }
}

/**
 * Get leaderboard
 * @param {string} challengeId - Challenge ID
 */
export async function getLeaderboard(challengeId) {
  try {
    const response = await apiGet(`/adult-challenges/${challengeId}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Create challenge (uses FormData, call separately)
 */
export async function createChallenge(formData) {
  // This is handled via FormData upload
  // Use apiPostFormData directly from client
}

/**
 * Update challenge (uses FormData, call separately)
 */
export async function updateChallenge(challengeId, formData) {
  // This is handled via FormData upload
  // Use apiPutFormData directly from client
}

/**
 * Delete challenge
 * @param {string} challengeId - Challenge ID
 */
export async function deleteChallenge(challengeId) {
  try {
    const response = await apiDelete(`/adult-challenges/${challengeId}`);
    return response;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
}

/**
 * Disqualify a participant
 * @param {string} challengeId - Challenge ID
 * @param {string} userId - User ID
 * @param {string} reason - Disqualification reason
 */
export async function disqualifyParticipant(challengeId, userId, reason) {
  try {
    const response = await apiPost(`/adult-challenges/${challengeId}/participants/${userId}/disqualify`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error disqualifying participant:', error);
    throw error;
  }
}

/**
 * Remove disqualification from a participant
 * @param {string} challengeId - Challenge ID
 * @param {string} userId - User ID
 */
export async function removeDisqualification(challengeId, userId) {
  try {
    const response = await apiPost(`/adult-challenges/${challengeId}/participants/${userId}/remove-disqualification`);
    return response.data;
  } catch (error) {
    console.error('Error removing disqualification:', error);
    throw error;
  }
}

/**
 * Finalize winners and transfer rewards
 * @param {string} challengeId - Challenge ID
 * @param {object} winners - Winner selections { position1UserId, position2UserId, position3UserId }
 */
export async function finalizeWinnersAndTransferRewards(challengeId, winners) {
  try {
    const response = await apiPost(`/adult-challenges/${challengeId}/finalize-winners`, { winners });
    return response.data;
  } catch (error) {
    console.error('Error finalizing winners:', error);
    throw error;
  }
}
