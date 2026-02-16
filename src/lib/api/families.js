import { apiGet } from './client';

/**
 * Get all families (admin only - read-only)
 */
export async function getFamilies() {
  try {
    const response = await apiGet('/families/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching families:', error);
    throw error;
  }
}

/**
 * Get family by ID (admin only - read-only)
 */
export async function getFamilyById(familyId) {
  try {
    const response = await apiGet(`/families/list/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family:', error);
    throw error;
  }
}

/**
 * Get family statistics (admin only - read-only)
 */
export async function getFamilyStats(familyId) {
  try {
    const response = await apiGet(`/families/stats/${familyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family stats:', error);
    throw error;
  }
}

/**
 * Get family members (admin only - read-only)
 */
export async function getFamilyMembers(familyId) {
  try {
    const response = await apiGet(`/families/${familyId}/members`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family members:', error);
    throw error;
  }
}

/**
 * Get family invitations (admin only - read-only)
 */
export async function getFamilyInvitations(familyId = null) {
  try {
    const params = familyId ? { familyId } : {};
    const response = await apiGet('/family-invitations/list', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family invitations:', error);
    throw error;
  }
}

/**
 * Get family lists (admin only - read-only)
 */
export async function getFamilyLists(familyId, params = {}) {
  try {
    const queryParams = { familyId, ...params };
    const response = await apiGet('/family-lists/list', queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family lists:', error);
    throw error;
  }
}

/**
 * Get family list by ID (admin only - read-only)
 */
export async function getFamilyListById(listId) {
  try {
    const response = await apiGet(`/family-lists/list/${listId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family list:', error);
    throw error;
  }
}

/**
 * Get family meals (admin only - read-only)
 */
export async function getFamilyMeals(familyId, params = {}) {
  try {
    const queryParams = { familyId, ...params };
    const response = await apiGet('/family-meals/list', queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family meals:', error);
    throw error;
  }
}

/**
 * Get family meal by ID (admin only - read-only)
 */
export async function getFamilyMealById(mealId) {
  try {
    const response = await apiGet(`/family-meals/list/${mealId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family meal:', error);
    throw error;
  }
}

/**
 * Get family recipes (admin only - read-only)
 */
export async function getFamilyRecipes(familyId, params = {}) {
  try {
    const queryParams = { familyId, ...params };
    const response = await apiGet('/family-recipes/list', queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family recipes:', error);
    throw error;
  }
}

/**
 * Get family recipe by ID (admin only - read-only)
 */
export async function getFamilyRecipeById(recipeId) {
  try {
    const response = await apiGet(`/family-recipes/list/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family recipe:', error);
    throw error;
  }
}

/**
 * Get family events (admin only - read-only)
 */
export async function getFamilyEvents(familyId, params = {}) {
  try {
    const queryParams = { familyId, ...params };
    const response = await apiGet('/family-events/list', queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family events:', error);
    throw error;
  }
}

/**
 * Get family event by ID (admin only - read-only)
 */
export async function getFamilyEventById(eventId) {
  try {
    const response = await apiGet(`/family-events/list/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family event:', error);
    throw error;
  }
}

/**
 * Get family schedules/timetable (admin only - read-only)
 */
export async function getFamilySchedules(familyId, params = {}) {
  try {
    const queryParams = { familyId, ...params };
    const response = await apiGet('/family-timetable/list', queryParams);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family schedules:', error);
    throw error;
  }
}

/**
 * Get family schedule by ID (admin only - read-only)
 */
export async function getFamilyScheduleById(scheduleId) {
  try {
    const response = await apiGet(`/family-timetable/list/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family schedule:', error);
    throw error;
  }
}

/**
 * Get family calendar (aggregated view) (admin only - read-only)
 */
export async function getFamilyCalendar(familyId, date) {
  try {
    const response = await apiGet('/family-calendar/date', { familyId, date });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching family calendar:', error);
    throw error;
  }
}
