// Applicant dashboard page
// Shows loan stats, recent applications and quick actions

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';

// ── STAT CARD COMPONENT ───────────────────────────────────────
const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <p style={{
        fontFamily: 'DM Sans',
        fontSize: '13px',
        color: '#888',
        margin: 0,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'Radio Canada',
        fontSize: '24px',
        fontWeight: '900',
        color: '#000',
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  </div>
);

// ── MAIN DASHBOARD PAGE ───────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  // Fetch dashboard data from API when page loads
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getApplicantDashboard();
        setDashboard(response.data.dashboard);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          fontSize: '18px',
          color: '#888',
          fontFamily: 'DM Sans',
        }}>
          Loading your dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Welcome header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Radio Canada',
          fontSize: '32px',
          fontWeight: '900',
          color: '#000',
          margin: 0,
        }}>
          Hi, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p style={{
          fontFamily: 'DM Sans',
          fontSize: '15px',
          color: '#888',
          margin: '4px 0 0',
        }}>
          What would you like to do today?
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard
          label="Total Applications"
          value={dashboard?.stats?.totalApplications || 0}
          icon="📋"
          color="#E4F222"
        />
        <StatCard
          label="Approved Loans"
          value={dashboard?.stats?.approvedLoans || 0}
          icon="✅"
          color="#d4f5d4"
        />
        <StatCard
          label="Declined"
          value={dashboard?.stats?.declinedLoans || 0}
          icon="❌"
          color="#ffd4d4"
        />
        <StatCard
          label="Total Borrowed"
          value={`MK ${(dashboard?.stats?.totalBorrowed || 0).toLocaleString()}`}
          icon="💰"
          color="#d4e8ff"
        />
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{
          fontFamily: 'Radio Canada',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#000',
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <Link
            to="/loans/apply"
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              backgroundColor: '#E4F222',
              color: '#000',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              fontFamily: 'DM Sans',
              border: '2px solid #000',
            }}
          >
            📝 Apply for Loan
          </Link>
          <Link
            to="/repayments"
            style={{
              padding: '12px 24px',
              borderRadius: '999px',
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: '700',
              fontSize: '14px',
              textDecoration: 'none',
              fontFamily: 'DM Sans',
              border: '2px solid #000',
            }}
          >
            💰 View Repayments
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{
          fontFamily: 'Radio Canada',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#000',
        }}>
          Recent Applications
        </h2>

        {dashboard?.recentLoans?.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#888',
            fontFamily: 'DM Sans',
          }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>📋</p>
            <p>No loan applications yet</p>
            <Link
              to="/loans/apply"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: '#E4F222',
                color: '#000',
                fontWeight: '700',
                fontSize: '14px',
                textDecoration: 'none',
                fontFamily: 'DM Sans',
              }}
            >
              Apply Now
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'DM Sans',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  {['National ID', 'Amount', 'Term', 'Status', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard?.recentLoans?.map((loan) => (
                  <tr
                    key={loan._id}
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                      {loan.nationalId}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      MK {loan.loanAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {loan.termMonths} months
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: loan.approved ? '#d4f5d4' : '#ffd4d4',
                        color: loan.approved ? '#1a7a1a' : '#7a1a1a',
                      }}>
                        {loan.approved ? '✅ Approved' : '❌ Declined'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#888' }}>
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;