import { apiGet } from './client';

/**
 * Get all parents (admin only)
 */
export async function getParents() {
  try {
    const response = await apiGet('/users/list', { userType: 'parent' });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching parents:', error);
    throw error;
  }
}

/**
 * Get parent by ID (admin only)
 */
export async function getParentById(parentId) {
  try {
    const response = await apiGet(`/users/list/${parentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent:', error);
    throw error;
  }
}

/**
 * Get parent statistics (kids count, tasks created, rewards created)
 */
export async function getParentStats(parentId) {
  try {
    // Aggregate from kids, tasks, and rewards
    const [kidsResponse, tasksResponse, rewardsResponse] = await Promise.all([
      apiGet('/kids/list', { parentId }),
      apiGet('/tasks/list', { parentId }),
      apiGet('/rewards/list', { parentId }),
    ]);
    
    // Backend returns { data: [...], count: ... }
    const kids = Array.isArray(kidsResponse?.data) ? kidsResponse.data : (Array.isArray(kidsResponse) ? kidsResponse : []);
    const tasks = Array.isArray(tasksResponse?.data) ? tasksResponse.data : (Array.isArray(tasksResponse) ? tasksResponse : []);
    const rewards = Array.isArray(rewardsResponse?.data) ? rewardsResponse.data : (Array.isArray(rewardsResponse) ? rewardsResponse : []);
    
    return {
      kidsCount: kids.length,
      tasksCreated: tasks.length,
      rewardsCreated: rewards.length,
    };
  } catch (error) {
    console.error('Error fetching parent stats:', error);
    throw error;
  }
}