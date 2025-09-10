// API configuration and helper functions for visitor management system

const API_BASE_URL = 'http://localhost/visitor-management/backend/api';

export interface VisitorData {
  name: string;
  email: string;
  phone: string;
  company: string;
  hostName: string;
  purpose: string;
  department: string;
}

export interface Visitor extends VisitorData {
  id: number;
  checkInTime: string;
  checkOutTime?: string;
  status: 'active' | 'checked_out' | 'no_show';
  duration?: number;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(errorData.message || 'API request failed', response.status);
  }
  return response.json();
};

export const api = {
  // Check in a visitor
  checkInVisitor: async (visitorData: VisitorData): Promise<{ success: boolean; visitor_id: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors.php?action=checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitorData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Check-in failed:', error);
      throw error;
    }
  },

  // Check out a visitor
  checkOutVisitor: async (visitorId: number): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors.php?action=checkout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Check-out failed:', error);
      throw error;
    }
  },

  // Get active visitors
  getActiveVisitors: async (): Promise<Visitor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors.php?action=active`);
      const result = await handleResponse(response);
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch active visitors:', error);
      throw error;
    }
  },

  // Get visitor history
  getVisitorHistory: async (
    limit = 50,
    offset = 0,
    status = 'all',
    search = ''
  ): Promise<{ data: Visitor[]; total: number }> => {
    try {
      const params = new URLSearchParams({
        action: 'history',
        limit: limit.toString(),
        offset: offset.toString(),
        status,
        search,
      });
      
      const response = await fetch(`${API_BASE_URL}/visitors.php?${params}`);
      const result = await handleResponse(response);
      return {
        data: result.data || [],
        total: result.total || 0,
      };
    } catch (error) {
      console.error('Failed to fetch visitor history:', error);
      throw error;
    }
  },

  // Get analytics data
  getAnalytics: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors.php?action=analytics`);
      const result = await handleResponse(response);
      return result.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  },
};

// Utility function to format dates
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

// Utility function to calculate time ago
export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;
  return `${diffInHours}h ${remainingMinutes}m ago`;
};

// Utility function to format duration
export const formatDuration = (minutes?: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};