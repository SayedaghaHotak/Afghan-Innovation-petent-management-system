import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // مرحله ۱: ارسال ایمیل / مرحله ۲: وارد کردن کد و پسورد جدید
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({
    token: '', // یا code (بستگی دارد دوستت چه نامی گذاشته باشد)
    newPassword: '',
    confirmPassword: ''
  });

  // ۱. متد اول: درخواست ارسال لینک/کد به ایمیل (Request)
  const handleRequestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // آدرس متد اول بک‌اِند شما
      await axios.post('http://localhost:8080/api/v1.0/auth/forgot-password/request', { email });
      
      alert("کد بازنشانی به ایمیل شما ارسال شد!");
      setStep(2); // رفتن به مرحله دوم
    } catch (error) {
      console.error("خطا در درخواست:", error);
      alert(error.response?.data || "ایمیل وارد شده یافت نشد!");
    } finally {
      setLoading(false);
    }
  };

  // ۲. متد دوم: فرستادن پسورد جدید و کد تایید (Reset)
const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert("پسوردها با هم مطابقت ندارند!");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        email: email,
        token: resetData.token, // کدی که به ایمیل آمده
        newPassword: resetData.newPassword
      };

      // آدرس متد دوم بک‌اِند شما
      await axios.post('http://localhost:8080/api/v1.0/auth/forgot-password/reset', payload);
      
      alert("پسورد شما با موفقیت تغییر کرد! حالا می‌توانید لاگین کنید.");
      navigate('/login'); // هدایت به صفحه لاگین
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
        /* فرم مرحله اول: دریافت ایمیل */
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
        /* فرم مرحله دوم: وارد کردن کد و پسورد جدید */
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '320px' }}>
          <h2>Reset Password</h2>
          <p>Enter the code sent to your email and your new password.</p>
          
          <input 
            type="text" 
            placeholder="Reset Code / Token" 
            value={resetData.token}
            onChange={(e) => setResetData({...resetData, token: e.target.value})}
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