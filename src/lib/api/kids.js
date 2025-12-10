import { apiGet } from './client';

/**
 * Get all kids (admin sees all, parent sees only their kids)
 */
export async function getKids(params = {}) {
  try {
    const response = await apiGet('/kids/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching kids:', error);
    throw error;
  }
}

/**
 * Get kid by ID
 */
export async function getKidById(kidId) {
  try {
    const response = await apiGet(`/kids/list/${kidId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching kid:', error);
    throw error;
  }
}

/**
 * Get kid statistics (tasks completed, coins, rewards)
 */
export async function getKidStats(kidId) {
  try {
    const response = await apiGet(`/kids/list/stats/${kidId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching kid stats:', error);
    throw error;
  }
}


