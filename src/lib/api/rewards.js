import { apiGet } from './client';

/**
 * Get all rewards (admin sees all, parent sees their rewards, kid sees their rewards)
 */
export async function getRewards(params = {}) {
  try {
    const response = await apiGet('/rewards/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
}

/**
 * Get reward by ID
 */
export async function getRewardById(rewardId) {
  try {
    const response = await apiGet(`/rewards/list/${rewardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reward:', error);
    throw error;
  }
}

/**
 * Get rewards for a specific kid
 */
export async function getRewardsByKidId(kidId) {
  try {
    const response = await apiGet('/rewards/list', { kidId });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching rewards for kid:', error);
    throw error;
  }
}

/**
 * Get reward redemptions history for a kid (admin or parent)
 */
export async function getRewardRedemptions(kidId) {
  try {
    const response = await apiGet('/rewards/redemptions', { kidId });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching reward redemptions:', error);
    throw error;
  }
}


