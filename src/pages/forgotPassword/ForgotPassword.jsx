import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({
    code: '', // Aligned name with Spring Boot PasswordResetRequest DTO
    newPassword: '',
    confirmPassword: ''
  });

  // 1. Request verification code via email
  const handleRequestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/v1.0/auth/forgot-password/request', { email });
      alert("کد بازنشانی به ایمیل شما ارسال شد!");
      setStep(2); 
    } catch (error) {
      console.error("خطا در درخواست:", error);
      alert(error.response?.data || "ایمیل وارد شده یافت نشد!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit new password and verification code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Local safety check before network roundtrip
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert("پسوردها با هم مطابقت ندارند!");
      return;
    }
    
    setLoading(true);
    try {
      // Matches the precise body schema your Java endpoint demands
      const payload = {
        code: resetData.code, 
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      };

      await axios.post('http://localhost:8081/api/v1.0/auth/forgot-password/reset', payload);
      
      alert("پسورد شما با موفقیت تغییر کرد! حالا می‌توانید لاگین کنید.");
      navigate('/login'); 
    } catch (error) {
      console.error("خطا در بازنشانی رمز عبور:", error);
      alert(error.response?.data || "کد تایید اشتباه یا منقضی شده است!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      
      {step === 1 ? (
        /* Step 1 Form */
        <form onSubmit={handleRequestEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '320px' }}>
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a reset code.</p>
          <input 
            type="email" 
            placeholder="Enter your Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      ) : (
        /* Step 2 Form */
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '320px' }}>
          <h2>Reset Password</h2>
          <p>Enter the code sent to your email and your new password.</p>
          
          <input 
            type="text" // Changed to text to properly handle leading zeros if code starts with 0
            placeholder="Reset Code / Token" 
            value={resetData.code}
            onChange={(e) => setResetData({...resetData, code: e.target.value})}
            required
            style={{ padding: '10px' }}
          />
          
          <input 
            type="password" 
            placeholder="New Password" 
            value={resetData.newPassword}
            onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
            required
            style={{ padding: '10px' }}
          />

          <input 
            type="password" 
            placeholder="Confirm New Password" 
            value={resetData.confirmPassword}
            onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
            required
            style={{ padding: '10px' }}
          />

          <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
            {loading ? 'Resetting...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;