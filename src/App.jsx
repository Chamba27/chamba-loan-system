import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import RepaymentsPage from './pages/RepaymentsPage';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (isLoggedIn) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} />;
  }
  return children;
};

function App() {
  return (
    <div>
      {/* Tailwind test - should show red box */}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/loans/apply" element={<ProtectedRoute><LoanApplicationPage /></ProtectedRoute>} />
        <Route path="/repayments" element={<ProtectedRoute><RepaymentsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;