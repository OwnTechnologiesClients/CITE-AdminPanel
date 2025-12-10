import { apiGet } from './client';

/**
 * Get all tasks (admin sees all, parent sees their tasks, kid sees assigned tasks)
 */
export async function getTasks(params = {}) {
  try {
    const response = await apiGet('/tasks/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Get task by ID
 */
export async function getTaskById(taskId) {
  try {
    const response = await apiGet(`/tasks/list/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

/**
 * Get tasks for a specific kid
 */
export async function getTasksByKidId(kidId) {
  try {
    const response = await apiGet('/tasks/list', { kidId });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks for kid:', error);
    throw error;
  }
}


