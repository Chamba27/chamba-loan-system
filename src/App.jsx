// App.jsx is the main router of our application
// It defines which component shows for each URL
// Think of it like a traffic controller directing users to the right page

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages - we'll create these one by one
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import RepaymentsPage from './pages/RepaymentsPage';

// ── PROTECTED ROUTE ───────────────────────────────────────────
// This component blocks access to pages that require login
// If not logged in it redirects to login page
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// ── ADMIN ROUTE ───────────────────────────────────────────────
// This component blocks access to admin only pages
// If not admin it redirects to dashboard
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

// ── PUBLIC ROUTE ──────────────────────────────────────────────
// This blocks logged in users from seeing login/register pages
// If already logged in redirect to dashboard
const PublicRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public routes - anyone can access */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes - only for logged out users */}
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><RegisterPage /></PublicRoute>
      } />

      {/* Protected routes - must be logged in */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/loans/apply" element={
        <ProtectedRoute><LoanApplicationPage /></ProtectedRoute>
      } />
      <Route path="/repayments" element={
        <ProtectedRoute><RepaymentsPage /></ProtectedRoute>
      } />

      {/* Admin routes - must be admin */}
      <Route path="/admin" element={
        <AdminRoute><AdminDashboardPage /></AdminRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;