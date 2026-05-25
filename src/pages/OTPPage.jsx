import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import toast from 'react-hot-toast';

const OTPPage = () => {
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Get userId from session storage
  const userId = sessionStorage.getItem('pendingUserId');
  const email  = sessionStorage.getItem('pendingEmail');

  // If no pending userId redirect to login
  if (!userId) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6 digit OTP');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOTP(userId, otp);
      toast.success('Verified successfully!');

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      const message = error.response?.data?.error || 'Invalid OTP. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify OTP">

      {/* Info text */}
      <p style={{
        fontSize: '15px',
        color: '#555',
        fontFamily: 'DM Sans',
        marginBottom: '32px',
        lineHeight: '1.6',
      }}>
        We sent a 6 digit verification code to
        <br />
        <strong style={{ color: '#000' }}>{email}</strong>
      </p>

      {/* OTP Form */}
      <form onSubmit={handleSubmit}>

        {/* OTP Input */}
        <input
          type="text"
          placeholder="Enter 6 digit code"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '999px',
            border: '1.5px solid #e5e7eb',
            fontSize: '24px',
            fontWeight: '700',
            outline: 'none',
            fontFamily: 'DM Sans',
            marginBottom: '24px',
            boxSizing: 'border-box',
            textAlign: 'center',
            letterSpacing: '8px',
          }}
          onFocus={e => e.target.style.borderColor = '#000'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          maxLength={6}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '999px',
            backgroundColor: otp.length === 6 ? '#E4F222' : '#f0f0f0',
            color: '#000',
            fontWeight: '700',
            fontSize: '15px',
            border: '2px solid #000',
            cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
            fontFamily: 'DM Sans',
            letterSpacing: '0.5px',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Verifying...' : 'VERIFY OTP'}
        </button>

      </form>

      {/* Resend OTP */}
      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#888',
        fontFamily: 'DM Sans',
      }}>
        Didn't receive the code?{' '}
        <button
          onClick={() => navigate('/login')}
          style={{
            color: '#000',
            fontWeight: '700',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'DM Sans',
          }}
        >
          Login again to resend
        </button>
      </p>

    </AuthLayout>
  );
};

export default OTPPage;