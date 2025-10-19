

import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = 'http://192.168.1.100:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  
  // Doctors
  DOCTORS: `${API_BASE_URL}/doctors`,
  DOCTOR_BY_ID: (id: number) => `${API_BASE_URL}/doctors/${id}`,
  DOCTOR_STATS: `${API_BASE_URL}/doctors/stats`,
  
  // Availability
  AVAILABILITY: `${API_BASE_URL}/availability`,
  DOCTOR_AVAILABILITY: (doctorId: number) => `${API_BASE_URL}/availability/doctor/${doctorId}`,
};

// Token management
export const TokenManager = {
  async setToken(token: string) {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },
  
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  async removeToken() {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// API request helper
async function apiRequest(
  url: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = false
) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await TokenManager.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const AuthAPI = {
  async login(email: string, password: string) {
    const data = await apiRequest(API_ENDPOINTS.LOGIN, 'POST', { email, password });
    
    if (data.success && data.data.token) {
      await TokenManager.setToken(data.data.token);
    }
    
    return data;
  },

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: string;
  }) {
    const data = await apiRequest(API_ENDPOINTS.REGISTER, 'POST', userData);
    
    if (data.success && data.data.token) {
      await TokenManager.setToken(data.data.token);
    }
    
    return data;
  },

  async getProfile() {
    return await apiRequest(API_ENDPOINTS.PROFILE, 'GET', undefined, true);
  },

  async updateProfile(profileData: { full_name: string; phone: string }) {
    return await apiRequest(API_ENDPOINTS.UPDATE_PROFILE, 'PUT', profileData, true);
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return await apiRequest(
      API_ENDPOINTS.CHANGE_PASSWORD,
      'PUT',
      { currentPassword, newPassword },
      true
    );
  },

  async logout() {
    await TokenManager.removeToken();
  }
};

// Doctor API
export const DoctorAPI = {
  async getAllDoctors(filters?: { status?: string; specialization?: string; search?: string }) {
    let url = API_ENDPOINTS.DOCTORS;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    
    return await apiRequest(url, 'GET');
  },

  async getDoctorById(id: number) {
    return await apiRequest(API_ENDPOINTS.DOCTOR_BY_ID(id), 'GET');
  },

  async createDoctor(doctorData: {
    name: string;
    email: string;
    phone?: string;
    specialization: string;
    license_number: string;
    address?: string;
    profile_image?: string;
    status?: string;
    primary_clinic?: string;
  }) {
    return await apiRequest(API_ENDPOINTS.DOCTORS, 'POST', doctorData, true);
  },

  async updateDoctor(id: number, doctorData: Partial<{
    name: string;
    email: string;
    phone: string;
    specialization: string;
    license_number: string;
    address: string;
    profile_image: string;
    status: string;
    primary_clinic: string;
  }>) {
    return await apiRequest(API_ENDPOINTS.DOCTOR_BY_ID(id), 'PUT', doctorData, true);
  },

  async deleteDoctor(id: number) {
    return await apiRequest(API_ENDPOINTS.DOCTOR_BY_ID(id), 'DELETE', undefined, true);
  },

  async getDoctorStats() {
    return await apiRequest(API_ENDPOINTS.DOCTOR_STATS, 'GET');
  }
};

// Availability API
export const AvailabilityAPI = {
  async getDoctorAvailability(doctorId: number) {
    return await apiRequest(API_ENDPOINTS.DOCTOR_AVAILABILITY(doctorId), 'GET');
  },

  async setAvailability(availabilityData: {
    doctor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
  }) {
    return await apiRequest(API_ENDPOINTS.AVAILABILITY, 'POST', availabilityData, true);
  },

  async updateAvailability(id: number, availabilityData: Partial<{
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>) {
    return await apiRequest(`${API_ENDPOINTS.AVAILABILITY}/${id}`, 'PUT', availabilityData, true);
  },

  async deleteAvailability(id: number) {
    return await apiRequest(`${API_ENDPOINTS.AVAILABILITY}/${id}`, 'DELETE', undefined, true);
  }
};

export default {
  AuthAPI,
  DoctorAPI,
  AvailabilityAPI,
  TokenManager,
  API_ENDPOINTS,
  API_BASE_URL,
};