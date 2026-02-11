import { apiGet } from './client';

/**
 * Get unlocked achievements (title + unlockedAt) for a user (admin only)
 */
export async function getUserAchievements(userId) {
  try {
    const response = await apiGet(`/admin/users/${userId}/achievements`);
    return response?.data?.unlockedAchievements || [];
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
}
