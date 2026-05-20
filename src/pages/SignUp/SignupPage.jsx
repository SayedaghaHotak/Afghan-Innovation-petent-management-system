import React, { useState } from 'react';
import { registerUser } from '../data/mockUsers'; 
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import './SignupPage.css';
import signupImage from '../../assets/image2.jpg';
import axios from 'axios';

const SignupPage = ({ onSignupSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({}); // برای نمایش ارورها
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // تابع اعتبارسنجی دستی
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
  
  // دیتایی که دقیقاً همنام با فیلدهای دیتابیس جاوای دوستت است
  const registerData = {
    firstName: formData.firstName, // تبدیل نام فرانت به بک‌اِند
    lastName: formData.lastName,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    password: formData.password,
    confirmPassword: formData.confirmPassword

  };

  try {
    const response = await axios.post(
      'http://localhost:8080/api/v1.0/auth/register', 
      registerData // فرستادن دیتای اصلاح شده
    );
    
    console.log("پاسخ موفقیت‌آمیز:", response.data);
    alert("Register successful! Please login.");
    
  } catch (error) {
    console.error("جزئیات خطا:", error);
    // این خط به تو نشان می‌دهد که جاوا دقیقاً چه اروری فرستاده است
    console.log("پیام دقیق بک‌اِند:", error.response?.data); 
    alert("Registration failed! Please check your details and try again.");
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
            <InputField variant="underlined" icon={<FiUser />} name="firstName" placeholder="First Name" onChange={handleChange} error={errors.firstName} />
            <InputField variant="underlined" icon={<FiUser />} name="lastName" placeholder="Last Name" onChange={handleChange} error={errors.lastName} />
            <InputField variant="underlined" icon={<FiMail />} type="email" name="email" placeholder="Email" onChange={handleChange} error={errors.email} />
            <InputField variant="underlined" icon={<FiPhone />} name="phoneNumber" placeholder="Phone" onChange={handleChange} error={errors.phoneNumber} />
            <InputField variant="underlined" icon={<FiLock />} type="password" name="password" placeholder="Password" onChange={handleChange} error={errors.password} />
            <InputField variant="underlined" icon={<FiLock />} type="password" name="confirmPassword" placeholder="Confirm" onChange={handleChange} error={errors.confirmPassword} />

            <Button type="submit" className="signup-main-btn" disabled={loading}>
              {loading ? "Wait..." : "Create Account"}
            </Button>
            {message && <p className="success-txt">{message}</p>}
            <div className="footer-links">
              <button type="button" onClick={onBackToLogin} className="back-to-login-btn">Login</button>
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