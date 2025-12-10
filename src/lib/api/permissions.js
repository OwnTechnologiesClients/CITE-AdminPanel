import { apiGet } from './client';

/**
 * Get all permissions
 */
export async function getPermissions() {
  try {
    const response = await apiGet('/permissions/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

/**
 * Get permission by ID
 */
export async function getPermissionById(permissionId) {
  try {
    const response = await apiGet(`/permissions/list/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching permission:', error);
    throw error;
  }
}

/**
 * Get grouped permissions (grouped by permission groups)
 */
export async function getGroupedPermissions() {
  try {
    const response = await apiGet('/permissions/grouped');
    return response.data || response;
  } catch (error) {
    console.error('Error fetching grouped permissions:', error);
    throw error;
  }
}

/**
 * Get permission group names
 */
export async function getPermissionGroupNames() {
  try {
    const response = await apiGet('/permissions/group-names');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching permission group names:', error);
    throw error;
  }
}

/**
 * Get all permission groups
 */
export async function getPermissionGroups() {
  try {
    const response = await apiGet('/permissions/group/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching permission groups:', error);
    throw error;
  }
}

/**
 * Get permission group by ID
 */
export async function getPermissionGroupById(groupId) {
  try {
    const response = await apiGet(`/permissions/group/list/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching permission group:', error);
    throw error;
  }
}

