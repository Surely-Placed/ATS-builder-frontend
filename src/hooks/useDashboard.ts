import { useState, useEffect } from 'react';
import { DashboardStats } from '../types/dashboard.types';
import { apiClient } from '../services/resumeApi';
import { AxiosError } from 'axios';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 500; // Start with 500ms delay

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<{ success: boolean; data: DashboardStats; message?: string }>('/dashboard/stats');

      if (response.data.success) {
        setStats(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard stats');
      }
    } catch (err: any) {
      const axiosError = err as AxiosError;
      
      // Retry on 401 (Unauthorized) - cookie might not be set yet
      if (axiosError.response?.status === 401 && retryCount < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchDashboardStats(retryCount + 1);
      }
      
      const errorMessage = axiosError.response?.data?.message || err.message || 'An error occurred while fetching dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure cookie is set after login
    const timer = setTimeout(() => {
      fetchDashboardStats();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: () => fetchDashboardStats(0),
  };
};

