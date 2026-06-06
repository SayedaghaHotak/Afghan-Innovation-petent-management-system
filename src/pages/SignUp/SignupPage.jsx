// src/pages/SignUp/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🟢 اضافه شد تا مشکل ارور useNavigate حل شود
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import './SignupPage.css';
import signupImage from '../../assets/image2.jpg';
import axios from 'axios';

const SignupPage = ({ onSignupSuccess }) => {
  const navigate = useNavigate(); // 🟢 اکنون بدون خطا در روتر کار می‌کند
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '', 
    phoneNumber: '', 
    password: '', 
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({}); 
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // تابع اعتبارسنجی دستی شما (کامپکت و فکس)
  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "Required";
    if (!formData.email) tempErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email";
    if (formData.password.length < 6) tempErrors.password = "Min 6 chars";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Not match";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);
    
    // دیتایی که دقیقاً همنام با فیلدهای دیتابیس جاوای دوستت است
    const registerData = {
      firstName: formData.firstName, 
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
      // اتصال کاملاً واقعی و زنده به API بک‌اِند جاوا
      const response = await axios.post(
        'http://localhost:8081/api/v1.0/auth/register', 
        registerData 
      );
      
      console.log("پاسخ موفقیت‌آمیز:", response.data);
      setMessage("Register successful! Please login.");
      
      if (onSignupSuccess) onSignupSuccess(response.data);
      
      // هدایت خودکار کاربر به صفحه لاگین بعد از ۲ ثانیه موفقیت
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("جزئیات خطا:", error);
      console.log("پیام دقیق بک‌اِند:", error.response?.data); 
      setMessage(error.response?.data?.message || "Registration failed! Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-left-content">
        <div className="signup-inner-form">
          <header className="signup-header">
            <h1>Join Innovation</h1>
            <p>Ready to start your journey?</p>
          </header>

          <form onSubmit={handleSubmit} className="actual-form">
            
            {/* 🟢 ویژگی value به تمام فیلدها اضافه شد تا استیت‌ها در فرانت‌اِند قفل و شُو شوند */}
            <InputField 
              variant="underlined" 
              icon={<FiUser />} 
              name="firstName" 
              placeholder="First Name" 
              value={formData.firstName}
              onChange={handleChange} 
              error={errors.firstName} 
            />
            
            <InputField 
              variant="underlined" 
              icon={<FiUser />} 
              name="lastName" 
              placeholder="Last Name" 
              value={formData.lastName}
              onChange={handleChange} 
              error={errors.lastName} 
            />
            
            <InputField 
              variant="underlined" 
              icon={<FiMail />} 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange} 
              error={errors.email} 
            />
            
            <InputField 
              variant="underlined" 
              icon={<FiPhone />} 
              name="phoneNumber" 
              placeholder="Phone" 
              value={formData.phoneNumber}
              onChange={handleChange} 
              error={errors.phoneNumber} 
            />
            
            <InputField 
              variant="underlined" 
              icon={<FiLock />} 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              error={errors.password} 
            />
            
            <InputField 
              variant="underlined" 
              icon={<FiLock />} 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange} 
              error={errors.confirmPassword} 
            />

            <Button type="submit" className="signup-main-btn" disabled={loading}>
              {loading ? "Wait..." : "Create Account"}
            </Button>
            
            {message && (
              <p className={message.includes("successful") ? "success-txt" : "error-message"} style={{ textAlign: 'center', marginTop: '10px' }}>
                {message}
              </p>
            )}

            <div className="footer-links">
              Already have an account?{' '}
              <button 
                type="button" 
                className="back-to-login-btn" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="signup-right-visual">
        <img src={signupImage} alt="Innovation" className="animated-signup-img" />
      </div>
    </div>
  );
};

export default SignupPage;