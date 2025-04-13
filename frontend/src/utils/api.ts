import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * API client for communicating with the backend
 */
export const api = {
  /**
   * Base fetch method with authentication and error handling
   */
  async fetch(endpoint: string, options: RequestInit = {}) {
    // Get the auth token from Supabase
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // Make the API request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle error responses
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    // Return the response data
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  },

  // Airports
  airports: {
    getAll: () => api.fetch('/airports'),
    getById: (id: string) => api.fetch(`/airports/${id}`),
    create: (data: any) => api.fetch('/airports', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => api.fetch(`/airports/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => api.fetch(`/airports/${id}`, { method: 'DELETE' }),
  },

  // Stands
  stands: {
    getAll: (airportId?: string) => api.fetch(`/stands${airportId ? `?airportId=${airportId}` : ''}`),
    getById: (id: string) => api.fetch(`/stands/${id}`),
    create: (data: any) => api.fetch('/stands', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => api.fetch(`/stands/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => api.fetch(`/stands/${id}`, { method: 'DELETE' }),
  },

  // Maintenance Requests
  maintenance: {
    getAll: (filters: Record<string, any> = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });
      return api.fetch(`/maintenance?${queryParams.toString()}`);
    },
    getById: (id: string) => api.fetch(`/maintenance/${id}`),
    create: (data: any) => api.fetch('/maintenance', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => api.fetch(`/maintenance/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    changeStatus: (id: string, status: string) => api.fetch(`/maintenance/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status }) 
    }),
    delete: (id: string) => api.fetch(`/maintenance/${id}`, { method: 'DELETE' }),
  },

  // User Profiles
  users: {
    getProfile: () => api.fetch('/users/profile'),
    getUserById: (id: string) => api.fetch(`/users/${id}`),
    createOrUpdateProfile: (data: any) => api.fetch('/users/profile', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  },
  
  // Organizations (Airport Clients)
  organizations: {
    getAll: () => api.fetch('/organizations'),
    getCurrentOrganization: () => api.fetch('/organizations/current'),
    getById: (id: string) => api.fetch(`/organizations/${id}`),
    create: (data: any) => api.fetch('/organizations', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => api.fetch(`/organizations/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => api.fetch(`/organizations/${id}`, { method: 'DELETE' }),
    getUsers: (id: string) => api.fetch(`/organizations/${id}/users`),
  },
}; 