import { apiGet } from './client';

/**
 * Get coin balance and transactions for a kid
 */
export async function getKidCoins(kidId, params = {}) {
  try {
    const response = await apiGet(`/coins/${kidId}`, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching kid coins:', error);
    throw error;
  }
}

/**
 * Get coin transactions for a kid
 */
export async function getKidCoinTransactions(kidId, params = {}) {
  try {
    const response = await apiGet(`/coins/${kidId}/transactions`, params);
    return {
      data: response.data || [],
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching coin transactions:', error);
    throw error;
  }
}

/**
 * Get all coin transactions across all kids (admin only)
 * This fetches all kids first, then gets transactions for each
 */
export async function getAllCoinTransactions(params = {}) {
  try {
    // Import getKids here to avoid circular dependency
    const { getKids } = await import('./kids');
    
    // Fetch all kids first
    const kids = await getKids();
    
    // Fetch transactions for all kids in parallel
    const transactionPromises = kids.map(async (kid) => {
      try {
        const kidTransactions = await getKidCoinTransactions(kid._id, {
          ...params,
          page: 1,
          limit: 1000 // Get all transactions for this kid
        });
        // Add kid info to each transaction
        return kidTransactions.data.map(transaction => ({
          ...transaction,
          kidId: kid._id,
          kidName: kid.name,
          parentName: kid.parentId?.fullName || 'Unknown'
        }));
      } catch (error) {
        console.error(`Error fetching transactions for kid ${kid._id}:`, error);
        return [];
      }
    });
    
    const allTransactionsArrays = await Promise.all(transactionPromises);
    const allTransactions = allTransactionsArrays.flat();
    
    // Sort by transaction date (newest first)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a.transactionDate || a.createdAt);
      const dateB = new Date(b.transactionDate || b.createdAt);
      return dateB - dateA;
    });
    
    // Apply filters if provided
    let filtered = allTransactions;
    if (params.kidId) {
      filtered = filtered.filter(t => t.kidId === params.kidId);
    }
    if (params.type) {
      filtered = filtered.filter(t => t.transactionType === params.type);
    }
    if (params.startDate || params.endDate) {
      filtered = filtered.filter(t => {
        const transDate = new Date(t.transactionDate || t.createdAt);
        if (params.startDate && transDate < new Date(params.startDate)) return false;
        if (params.endDate && transDate > new Date(params.endDate)) return false;
        return true;
      });
    }
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching all coin transactions:', error);
    throw error;
  }
}

