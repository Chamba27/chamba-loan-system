import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import toast from 'react-hot-toast';

// Reusable input component
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fullName:   '',
    email:      '',
    phone:      '',
    nationalId: '',
    password:   '',
  });
  const [loading, setLoading] = useState(false);

  // Update form field
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const { fullName, email, phone, nationalId, password } = formData;
    if (!fullName || !email || !phone || !nationalId || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Call register from AuthContext
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');

    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">

      {/* Social buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
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
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange('fullName')}
        />
        <InputField
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange('email')}
        />
        <InputField
          type="tel"
          placeholder="Phone Number e.g +265991234567"
          value={formData.phone}
          onChange={handleChange('phone')}
        />
        <InputField
          type="text"
          placeholder="National ID e.g NAT001"
          value={formData.nationalId}
          onChange={handleChange('nationalId')}
        />
        <InputField
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange('password')}
        />

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
          {loading ? 'Creating account...' : 'CONTINUE'}
        </button>
      </form>

      {/* Login link */}
      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#888',
        fontFamily: 'DM Sans',
      }}>
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: '#000', fontWeight: '700', textDecoration: 'none' }}
        >
          Sign In
        </Link>
      </p>

    </AuthLayout>
  );
};

export default RegisterPage;