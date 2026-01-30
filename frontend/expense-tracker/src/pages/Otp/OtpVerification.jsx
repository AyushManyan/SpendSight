import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/Layout/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Clock, 
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, signupData } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (!email || !signupData) {
    navigate('/signup');
    return null;
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
      await axiosInstance.post(API_PATHS.OTP.SEND_OTP, { email });
      setResendCooldown(30);
      setCanResend(false);
      toast.success('New OTP sent to your email!');
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Verify OTP
      await axiosInstance.post(API_PATHS.OTP.VERIFY_OTP, { email, otp: otpString });
      
      // 2. Register user (save to DB)
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, signupData);
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success('Account verified successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP or registration failed.');
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="card bg-white rounded-2xl shadow-md p-6 shadow-gray-100 border border-gray-200/50">
            {/* Back Button */}
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Signup
            </button>

            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-pink-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h1>
              
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                <Mail className="w-4 h-4" />
                <p className="text-sm">
                  Code sent to 
                  <span className="font-semibold text-primary ml-1">
                    {email}
                  </span>
                </p>
              </div>
              
              <p className="text-xs text-gray-500">
                Enter the 6-digit verification code from your email
              </p>
            </div>

            {/* OTP Input Section */}
            <form onSubmit={handleVerify}>
              <div className="mb-8">
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <div key={index} className="relative">
                      <input
                        ref={(el) => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-14 text-xl font-semibold text-center bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                      {digit && (
                        <div className="absolute inset-0 border border-primary rounded-lg animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm text-center mt-3 animate-shake">
                    {error}
                  </p>
                )}
              </div>

              {/* Resend OTP Section */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-primary cursor-pointer font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-gray-500">
                        Resend code in <span className="font-semibold">{resendCooldown}s</span>
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="btn-primary w-full bg-primary text-white py-3 rounded mt-4 hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Complete Signup
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                By verifying, you agree to our Terms of Service & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to global styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </AuthLayout>
  );
};

export default OtpVerification;