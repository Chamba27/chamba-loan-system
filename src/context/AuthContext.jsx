import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // ── LOGIN ────────────────────────────────────────────────────
  // Step 1 of 2 factor auth - returns userId for OTP verification
  // Token is NOT returned here - only after OTP is verified!
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });

    // Store userId temporarily so OTP page knows who to verify
    sessionStorage.setItem('pendingUserId', response.data.userId);
    sessionStorage.setItem('pendingEmail',  response.data.email);

    return response.data;
  };

  // ── VERIFY OTP ───────────────────────────────────────────────
  // Step 2 of 2 factor auth - verifies OTP and returns real token
  const verifyOTP = async (userId, otp) => {
    const response = await authAPI.verifyOTP({ userId, otp });
    const { token, user } = response.data;

    // Now we have the real token - save it!
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Clear temporary OTP session data
    sessionStorage.removeItem('pendingUserId');
    sessionStorage.removeItem('pendingEmail');

    setToken(token);
    setUser(user);

    return user;
  };

  // ── REGISTER ─────────────────────────────────────────────────
  // Creates new account and logs in immediately (no OTP for register)
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

  // ── LOGOUT ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    verifyOTP,
    isLoggedIn: !!token,
    isAdmin:    user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;