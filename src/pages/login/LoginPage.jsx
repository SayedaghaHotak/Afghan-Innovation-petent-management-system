import React, { useState, useRef, useEffect } from 'react';
import { loginUser } from '../data/mockUsers'; // اگر پوشه data کنار پوشه login است
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import './LoginPage.css';
import image from '../../assets/image2.jpg'; // فرض بر این است که assets خارج از components است

const LoginPage = ({ onLoginSuccess, onForgotPassword }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  // شبیه‌سازی انتظار برای سرور (مثل کد قبلی خودت)
  setTimeout(() => {
    // استفاده از تابعی که در mockData ساختیم
    const user = loginUser(formData.email, formData.password);
    
    if (user) {
      onLoginSuccess?.(user); // ورود موفقیت‌آمیز
    } else {
      setErrors({ general: 'ایمیل یا رمز عبور اشتباه است!' });
    }
    setLoading(false);
  }, 1000);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-form-card">
          <div className="login-header">
            <h1>Login</h1>
            <p>Sign in to your Afghan Innovation account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
            
            <InputField 
              inputRef={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              error={errors.email}
              disabled={loading}
            />

            <InputField 
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              error={errors.password}
              disabled={loading}
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </InputField>

            <Button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="forgot-password">
              <Button 
                onClick={() => onForgotPassword?.(formData.email)}
                disabled={!formData.email || loading}
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="login-right">
        <div className='image-right' style={{height : '100%'}}>
          <img src={image} alt="innovation" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;