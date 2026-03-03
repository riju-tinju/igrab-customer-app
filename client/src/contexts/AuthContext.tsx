import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    firstName: string;
    phone: string;
    countryCode: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (phone: string, countryCode: string, otp: string, guestCart: any[], guestWishlist: any[]) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (firstName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios for credentials
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get('/api/auth/status');
            if (res.data.isAuthenticated) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (phone: string, countryCode: string, otp: string, guestCart: any[], guestWishlist: any[]) => {
        try {
            const res = await axios.post('/api/auth/verify-otp', {
                phone,
                countryCode,
                otp,
                guestCart,
                guestWishlist
            });

            if (res.data.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                // After successful login, the Auth page will handle redirection
            }
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Login failed");
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/';
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const updateProfile = async (firstName: string) => {
        try {
            const res = await axios.post('/api/auth/update-profile', { firstName });
            if (res.data.success) {
                setUser(res.data.user);
            }
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Update failed");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
