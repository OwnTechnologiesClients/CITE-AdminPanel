import { apiGet } from './client';

/**
 * Get all roles
 */
export async function getRoles() {
  try {
    const response = await apiGet('/roles/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Get role by ID
 */
export async function getRoleById(roleId) {
  try {
    const response = await apiGet(`/roles/list/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
}

/**
 * Get role permissions (grouped by permission groups with selection status)
 */
export async function getRolePermissions(roleId) {
  try {
    const response = await apiGet(`/roles/${roleId}/permissions`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
}

