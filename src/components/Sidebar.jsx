// Sidebar navigation component
// Shows on all dashboard pages
// Highlights the current active page

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Navigation items for applicant
const navItems = [
  { path: '/dashboard',    icon: '📊', label: 'Dashboard'    },
  { path: '/loans/apply',  icon: '📝', label: 'Apply Loan'   },
  { path: '/repayments',   icon: '💰', label: 'Repayments'   },
  { path: '/profile',      icon: '👤', label: 'Profile'      },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#5a5a5a',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: '0 12px',
        marginBottom: '40px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'Radio Canada',
            fontWeight: '900',
            fontSize: '22px',
            color: '#E4F222',
          }}>
            CHAMBA
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '4px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#E4F222' : 'transparent',
                color: isActive ? '#000' : '#888',
                fontFamily: 'DM Sans',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div style={{
        borderTop: '1px solid #222',
        paddingTop: '16px',
      }}>
        {/* User avatar and name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#E4F222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '14px',
            color: '#000',
            flexShrink: 0,
          }}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{
              fontFamily: 'DM Sans',
              fontWeight: '700',
              fontSize: '13px',
              color: '#fff',
              margin: 0,
            }}>
              {user?.fullName}
            </p>
            <p style={{
              fontFamily: 'DM Sans',
              fontSize: '11px',
              color: '#888',
              margin: 0,
            }}>
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
            border: '1px solid #333',
            color: '#888',
            fontFamily: 'DM Sans',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;