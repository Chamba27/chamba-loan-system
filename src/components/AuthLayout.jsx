// Shared layout for Login and Register pages
// Both pages have the same split layout - white left, lime right

import { Link } from 'react-router-dom';
import moneyLogo from '../assets/logo.png';

const AuthLayout = ({ children, title }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fff',
    }}>

      {/* ── LEFT SIDE - Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 64px',
      }}>

        {/* Back to home link */}
        <Link
          to="/"
          style={{
            fontSize: '13px',
            color: '#888',
            textDecoration: 'none',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Radio Canada',
          fontSize: '40px',
          fontWeight: '900',
          color: '#000',
          marginBottom: '32px',
        }}>
          {title}
        </h1>

        {/* Form content */}
        {children}

      </div>

      {/* ── RIGHT SIDE - Lime green panel ── */}
      <div style={{
        flex: 1,
        backgroundColor: '#E4F222',
        borderRadius: '32px',
        margin: '24px 24px 24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 48px)',
      }}>
        <img
          src={moneyLogo}
          alt="Chamba"
          style={{
            width: '60%',
            maxWidth: '280px',
            objectFit: 'contain',
          }}
        />
      </div>

    </div>
  );
};

export default AuthLayout;