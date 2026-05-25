import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import toast from 'react-hot-toast';

// Reusable input component for the form fields
const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{
      width: '100%',
      padding: '16px 20px',
      borderRadius: '999px',
      border: '1.5px solid #e5e7eb',
      fontSize: '15px',
      outline: 'none',
      fontFamily: 'DM Sans',
      marginBottom: '16px',
      boxSizing: 'border-box',
    }}
    onFocus={e => e.target.style.borderColor = '#000'}
    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
  />
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error('Please fill in all fields');
    return;
  }

  setLoading(true);
  try {
    // Login now returns userId not token
    await login(email, password);

    toast.success('OTP sent to your email!');

    // Redirect to OTP verification page
    navigate('/verify-otp');

  } catch (error) {
    const message = error.response?.data?.error || 'Login failed. Please try again.';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout title="Sign In">

      {/* Social buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {/* Facebook button */}
        <button style={{
          flex: 1,
          padding: '12px',
          borderRadius: '999px',
          border: '1.5px solid #e5e7eb',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          fontFamily: 'DM Sans',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <span style={{ color: '#1877F2', fontWeight: '900' }}>f</span>
          Facebook
        </button>

        {/* Google button */}
        <button
          onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '999px',
            border: '1.5px solid #e5e7eb',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            fontFamily: 'DM Sans',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#EA4335', fontWeight: '900' }}>G</span>
          Google
        </button>
      </div>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        <span style={{ fontSize: '13px', color: '#888', fontFamily: 'DM Sans' }}>
          or use your email
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* Forgot password */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link
            to="/forgot-password"
            style={{
              fontSize: '14px',
              color: '#000',
              fontFamily: 'DM Sans',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '999px',
            backgroundColor: loading ? '#ccc' : '#E4F222',
            color: '#000',
            fontWeight: '700',
            fontSize: '15px',
            border: '2px solid #000',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans',
            letterSpacing: '0.5px',
          }}
        >
          {loading ? 'Signing in...' : 'CONTINUE'}
        </button>
      </form>

      {/* Register link */}
      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#888',
        fontFamily: 'DM Sans',
      }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          style={{ color: '#000', fontWeight: '700', textDecoration: 'none' }}
        >
          Create Account
        </Link>
      </p>

    </AuthLayout>
  );
};

export default LoginPage;