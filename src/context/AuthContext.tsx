import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from @react-native-async-storage/async-storage'';
import { Alert } from 'react-native';

interface User {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, full_name: string, phone?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (full_name: string, phone: string) => Promise<boolean>;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


const API_BASE_URL = 'http://192.168.1.100:5000/api';

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Load stored auth data on app start
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedUser = await AsyncStorage.getItem('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const { token, ...userData } = data.data;
                
                // Store token and user data
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                setToken(token);
                setUser(userData);
                
                return true;
            } else {
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
                return false;
            }
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Unable to connect to server. Please check your connection.');
            return false;
        }
    };

    const register = async (
        email: string, 
        password: string, 
        full_name: string, 
        phone?: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, full_name, phone }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const { token, ...userData } = data.data;
                
                // Store token and user data
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                setToken(token);
                setUser(userData);
                
                Alert.alert('Success', 'Registration successful!');
                return true;
            } else {
                Alert.alert('Registration Failed', data.message || 'Unable to register');
                return false;
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Unable to connect to server. Please check your connection.');
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (full_name: string, phone: string): Promise<boolean> => {
        try {
            if (!token) return false;

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ full_name, phone }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                await AsyncStorage.setItem('userData', JSON.stringify(data.data));
                setUser(data.data);
                Alert.alert('Success', 'Profile updated successfully');
                return true;
            } else {
                Alert.alert('Update Failed', data.message || 'Unable to update profile');
                return false;
            }
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'Unable to connect to server. Please check your connection.');
            return false;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                token,
                loading,
                login, 
                register,
                logout,
                updateProfile,
                isAuthenticated: !!user && !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};