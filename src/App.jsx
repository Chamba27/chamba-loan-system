import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import RepaymentsPage from './pages/RepaymentsPage';

// Blocks logged out users from protected pages
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Blocks non-admin users from admin pages
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

// Blocks logged in users from seeing login/register
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
      {/* Public - anyone can access */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth - only logged out users */}
      <Route path="/login" element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><RegisterPage /></PublicRoute>
      } />

      {/* OTP - no protection needed, user not logged in yet */}
      <Route path="/verify-otp" element={<OTPPage />} />

      {/* Protected - must be logged in */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/loans/apply" element={
        <ProtectedRoute><LoanApplicationPage /></ProtectedRoute>
      } />
      <Route path="/repayments" element={
        <ProtectedRoute><RepaymentsPage /></ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/admin" element={
        <AdminRoute><AdminDashboardPage /></AdminRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;