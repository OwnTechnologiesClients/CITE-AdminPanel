import { apiGet } from './client';

/**
 * Get dashboard statistics for Parents & Kids module
 */
export async function getParentsKidsDashboardStats() {
  try {
    const response = await apiGet('/admin/parents-kids/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}


