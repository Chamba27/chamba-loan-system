// This file manages authentication state across the entire app
// Any component can check if user is logged in, get user details
// or call login/logout without passing props around
// Think of it as a global "who is logged in" store

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the context
// This is like creating an empty container
const AuthContext = createContext();

// AuthProvider wraps our entire app and provides auth state
// to every component inside it
export const AuthProvider = ({ children }) => {

  // Store the logged in user's details
  const [user, setUser] = useState(null);

  // Store the JWT token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Track if we're still loading user data
  const [loading, setLoading] = useState(true);

  // ── CHECK IF USER IS ALREADY LOGGED IN ──────────────────────
  // When app loads check localStorage for existing token
  // If found fetch the user's details from API
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          // Fetch current user details from API
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid or expired - clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      // Done loading
      setLoading(false);
    };

    initAuth();
  }, []);

  // ── LOGIN FUNCTION ───────────────────────────────────────────
  // Called when user submits login form
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    // Save token to localStorage so user stays logged in
    // even after refreshing the page
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

  // ── REGISTER FUNCTION ────────────────────────────────────────
  // Called when user submits registration form
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

  // ── LOGOUT FUNCTION ──────────────────────────────────────────
  // Called when user clicks logout
  const logout = () => {
    // Clear everything from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  // ── VALUES AVAILABLE TO ALL COMPONENTS ──────────────────────
  const value = {
    user,       // the logged in user object
    token,      // the JWT token
    loading,    // whether we're still checking auth
    login,      // login function
    register,   // register function
    logout,     // logout function
    isLoggedIn: !!token,           // true if logged in
    isAdmin: user?.role === 'admin', // true if admin
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we know auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
// Instead of writing useContext(AuthContext) every time
// we just write useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;