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

/**
 * Get families dashboard statistics
 * Note: Backend doesn't have this endpoint yet, so we'll aggregate from existing endpoints
 */
export async function getFamiliesDashboardStats() {
  try {
    // Import here to avoid circular dependency
    const { getFamilies } = await import('./families');
    
    const families = await getFamilies();
    
    // Calculate stats from families data
    const totalFamilies = families.length;
    const activeFamilies = families.filter(f => f.status === 1).length;
    
    // Get total members (need to fetch members for each family)
    let totalMembers = 0;
    try {
      const { getFamilyMembers } = await import('./families');
      const memberPromises = families.map(family => 
        getFamilyMembers(family._id).catch(() => [])
      );
      const membersArrays = await Promise.all(memberPromises);
      totalMembers = membersArrays.reduce((sum, members) => sum + members.length, 0);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
    
    return {
      totalFamilies: { value: totalFamilies },
      activeFamilies: { value: activeFamilies },
      totalMembers: { value: totalMembers }
    };
  } catch (error) {
    console.error('Error fetching families dashboard stats:', error);
    throw error;
  }
}

