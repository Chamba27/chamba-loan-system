// Loan Application Page
// Interactive form with live calculator
// Shows decision result after submission

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loanAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';

const LoanApplicationPage = () => {
  const { user } = useAuth();

  // Form state
  const [loanAmount, setLoanAmount] = useState(500000);
  const [termMonths, setTermMonths] = useState(12);
  const [loading, setLoading]       = useState(false);
  const [decision, setDecision]     = useState(null);

  // Live calculation
  const monthlyRepayment = (loanAmount / termMonths).toFixed(2);
  const totalRepayment   = loanAmount.toFixed(2);

  // Handle form submission
  const handleApply = async () => {
    setLoading(true);
    setDecision(null);
    try {
      const response = await loanAPI.apply({
        nationalId: user.nationalId,
        loanAmount,
        termMonths,
      });
      setDecision(response.data.decision);
      if (response.data.decision.approved) {
        toast.success('Congratulations! Loan approved!');
      } else {
        toast.error('Loan application declined');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Radio Canada',
          fontSize: '32px',
          fontWeight: '900',
          color: '#000',
          margin: 0,
        }}>
          Apply for a Loan 📝
        </h1>
        <p style={{
          fontFamily: 'DM Sans',
          fontSize: '15px',
          color: '#888',
          margin: '4px 0 0',
        }}>
          Adjust the sliders and see your repayment instantly
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>

        {/* ── LEFT - Form ── */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>

          {/* National ID - readonly from profile */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'DM Sans',
              fontSize: '13px',
              fontWeight: '600',
              color: '#888',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              National ID
            </label>
            <div style={{
              padding: '14px 20px',
              borderRadius: '999px',
              border: '1.5px solid #e5e7eb',
              backgroundColor: '#f9f9f9',
              fontFamily: 'DM Sans',
              fontSize: '15px',
              fontWeight: '600',
              color: '#555',
            }}>
              {user?.nationalId}
            </div>
            <p style={{
              fontFamily: 'DM Sans',
              fontSize: '12px',
              color: '#aaa',
              marginTop: '6px',
            }}>
              Auto-filled from your profile
            </p>
          </div>

          {/* Loan Amount Slider */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <label style={{
                fontFamily: 'DM Sans',
                fontSize: '13px',
                fontWeight: '600',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Loan Amount
              </label>
              <span style={{
                fontFamily: 'Radio Canada',
                fontSize: '16px',
                fontWeight: '900',
                color: '#000',
              }}>
                MK {loanAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#E4F222',
                height: '6px',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
            }}>
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'DM Sans' }}>
                MK 50,000
              </span>
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'DM Sans' }}>
                MK 5,000,000
              </span>
            </div>
          </div>

          {/* Term Slider */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <label style={{
                fontFamily: 'DM Sans',
                fontSize: '13px',
                fontWeight: '600',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Repayment Term
              </label>
              <span style={{
                fontFamily: 'Radio Canada',
                fontSize: '16px',
                fontWeight: '900',
                color: '#000',
              }}>
                {termMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              step="1"
              value={termMonths}
              onChange={e => setTermMonths(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#E4F222',
                height: '6px',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
            }}>
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'DM Sans' }}>
                3 Months
              </span>
              <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'DM Sans' }}>
                60 Months
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleApply}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '999px',
              backgroundColor: loading ? '#f0f0f0' : '#E4F222',
              color: '#000',
              fontWeight: '700',
              fontSize: '15px',
              border: '2px solid #000',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans',
              letterSpacing: '0.5px',
            }}
          >
            {loading ? '⏳ Checking eligibility...' : '🚀 APPLY NOW'}
          </button>

        </div>

        {/* ── RIGHT - Summary + Result ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Live Summary Card */}
          <div style={{
            backgroundColor: '#000',
            borderRadius: '20px',
            padding: '32px',
            color: '#fff',
          }}>
            <p style={{
              fontFamily: 'DM Sans',
              fontSize: '13px',
              color: '#888',
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Monthly Repayment
            </p>
            <p style={{
              fontFamily: 'Radio Canada',
              fontSize: '40px',
              fontWeight: '900',
              color: '#E4F222',
              margin: '0 0 24px',
            }}>
              MK {Number(monthlyRepayment).toLocaleString()}
            </p>

            {/* Details */}
            {[
              { label: 'Loan Amount',    value: `MK ${loanAmount.toLocaleString()}` },
              { label: 'Total Repayable', value: `MK ${Number(totalRepayment).toLocaleString()}` },
              { label: 'Term',           value: `${termMonths} Months` },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #222',
              }}>
                <span style={{
                  fontFamily: 'DM Sans',
                  fontSize: '13px',
                  color: '#888',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: 'DM Sans',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#fff',
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Decision Result Card */}
          {decision && (
            <div style={{
              backgroundColor: decision.approved ? '#d4f5d4' : '#ffd4d4',
              borderRadius: '20px',
              padding: '24px',
              border: `2px solid ${decision.approved ? '#1a7a1a' : '#7a1a1a'}`,
            }}>

              {/* Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '32px' }}>
                  {decision.approved ? '✅' : '❌'}
                </span>
                <p style={{
                  fontFamily: 'Radio Canada',
                  fontSize: '22px',
                  fontWeight: '900',
                  color: decision.approved ? '#1a7a1a' : '#7a1a1a',
                  margin: 0,
                }}>
                  {decision.approved ? 'Loan Approved!' : 'Loan Declined'}
                </p>
              </div>

              {/* Approved details */}
              {decision.approved && (
                <>
                  <p style={{
                    fontFamily: 'DM Sans',
                    fontSize: '14px',
                    color: '#1a7a1a',
                    marginBottom: '12px',
                  }}>
                    {decision.message}
                  </p>
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <p style={{
                      fontFamily: 'DM Sans',
                      fontSize: '13px',
                      color: '#888',
                      margin: '0 0 4px',
                    }}>
                      Monthly Repayment
                    </p>
                    <p style={{
                      fontFamily: 'Radio Canada',
                      fontSize: '24px',
                      fontWeight: '900',
                      color: '#000',
                      margin: 0,
                    }}>
                      MK {Number(decision.monthlyRepayment).toLocaleString()}
                    </p>
                  </div>
                </>
              )}

              {/* Declined reasons */}
              {!decision.approved && (
                <>
                  <p style={{
                    fontFamily: 'DM Sans',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#7a1a1a',
                    marginBottom: '8px',
                  }}>
                    Reasons:
                  </p>
                  <ul style={{
                    paddingLeft: '20px',
                    margin: 0,
                  }}>
                    {(decision.reasons || [decision.reason]).map((reason, i) => (
                      <li key={i} style={{
                        fontFamily: 'DM Sans',
                        fontSize: '13px',
                        color: '#7a1a1a',
                        marginBottom: '4px',
                      }}>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </>
              )}

            </div>
          )}

        </div>
      </div>

    </DashboardLayout>
  );
};

export default LoanApplicationPage;