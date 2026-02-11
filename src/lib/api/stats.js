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
 * Get main admin dashboard statistics (aggregated from existing APIs)
 */
export async function getAdminDashboardStats() {
  try {
    const { getUsers } = await import('./users');
    const { getFamilies } = await import('./families');
    const { getTasks } = await import('./tasks');
    const [users, families, parentsKidsStats, tasks] = await Promise.all([
      getUsers().catch(() => []),
      getFamilies().catch(() => []),
      getParentsKidsDashboardStats().catch(() => null),
      getTasks().catch(() => []),
    ]);

    const totalUsers = users.length;
    const totalFamilies = families.length;
    const activeTasks = parentsKidsStats?.activeTasks?.value ?? 0;
    const rewardsCreated = parentsKidsStats?.rewardsCreated?.value ?? 0;
    const tasksCompleted = Array.isArray(tasks) ? tasks.filter((t) => t.isCompleted).length : 0;

    // Recent activity: latest users (use createdAt if available, else order by list order)
    const sortedUsers = [...(users || [])].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA;
    });
    const recentActivity = (sortedUsers.slice(0, 5) || []).map((u) => ({
      type: 'user_joined',
      title: `${u.fullName || u.username || u.email || 'User'} joined`,
      time: u.createdAt || null,
      id: u._id || u.id,
    }));

    return {
      totalUsers,
      totalFamilies,
      activeTasks,
      rewardsCreated,
      tasksCompleted,
      parentsKidsStats,
      recentActivity,
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
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

