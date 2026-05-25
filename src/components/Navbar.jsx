import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '16px 24px',
    }}>
      {/* Main navbar pill */}
      <nav style={{
        width: 'min(100%, 1320px)',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: '999px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img
            src="/src/assets/logo.png"
            alt="Chamba Logo"
            style={{ height: '40px', width: 'auto' }}
          />
        </Link>

        {/* Desktop Nav Links - hidden on mobile */}
        <div style={{
          alignItems: 'center',
          gap: '32px',
        }} className="hidden md:flex">
          <a href="#how-it-works" style={{ fontSize: '14px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}>
            How it Works
          </a>
          <a href="#calculator" style={{ fontSize: '14px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}>
            Calculator
          </a>
          <a href="#about" style={{ fontSize: '14px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}>
            About
          </a>
        </div>

        {/* Desktop Auth Buttons - hidden on mobile */}
        <div className="hidden md:flex" style={{ gap: '12px', alignItems: 'center'}}>
          {isLoggedIn ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                style={{ fontSize: '14px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1.5px solid #000',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ fontSize: '14px', fontWeight: '500', color: '#000000', textDecoration: 'none' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  backgroundColor: '#E4F222',
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button - only shows on mobile */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          {/* Animated hamburger lines */}
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#000',
            borderRadius: '2px',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }}></span>
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#000',
            borderRadius: '2px',
            transition: 'all 0.3s',
            opacity: menuOpen ? 0 : 1,
          }}></span>
          <span style={{
            display: 'block',
            width: '24px',
            height: '2px',
            backgroundColor: '#000',
            borderRadius: '2px',
            transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }}></span>
        </button>

      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          width: 'min(100%, 1320px)',
          margin: '8px auto 0',
          backgroundColor: '#ffffff',
          border: '2px solid #000',
          borderRadius: '24px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: '500', color: '#000', textDecoration: 'none' }}
          >
            How it Works
          </a>
          
          <a
            href="#calculator"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: '500', color: '#000', textDecoration: 'none' }}
          >
            Calculator
          </a>
          
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: '500', color: '#000', textDecoration: 'none' }}
          >
            About
          </a>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#f0f0f0' }}></div>

          {isLoggedIn ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '15px', fontWeight: '500', color: '#000', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  padding: '12px',
                  borderRadius: '999px',
                  border: '2px solid #000',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '15px', fontWeight: '500', color: '#000', textDecoration: 'none' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  padding: '12px',
                  borderRadius: '999px',
                  backgroundColor: '#E4F222',
                  color: '#000',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
