import React, { useState, useRef, useEffect } from 'react';
// import { loginUser } from '../data/mockUsers'; // اگر پوشه data کنار پوشه login است
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import './LoginPage.css';
import image from '../../assets/image2.jpg'; // فرض بر این است که assets خارج از components است
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // نام اصلاح شد تا بتوانی در زمان لودینگ از آن استفاده کنی
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
    
    // اول اعتبارسنجی فرم خودت اجرا شود
    if (!validateForm()) return;

    setLoading(true); // فعال کردن حالت لودینگ فرم خودت

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        username: formData.email 
      };

      const response = await axios.post('http://localhost:8080/api/v1.0/auth/login', loginData);
      
      const token = response.data.token;
      const rolesReceived = response.data.roles || response.data.authorities || [];

      localStorage.setItem('token', token);
      localStorage.setItem('userRoles', JSON.stringify(rolesReceived));

      alert("لاگین موفقیت‌آمیز بود!");

      // اجرای تابع موفقیت فرم خودت اگر وجود داشته باشد
      onLoginSuccess?.(response.data);

      const isAdmin = rolesReceived.some(role => {
        const roleName = typeof role === 'object' ? role.authority : role;
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
      });

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/user-dashboard'); 
      }

    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ general: error.response?.data?.message || "email or password is incorrect" });
    } finally {
      setLoading(false); // غیرفعال کردن لودینگ در هر صورت
    }
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
                type="button"
                onClick={() => navigate('/forgot-password')} // کاربر را می‌فرستد به صفحه فراموشی رمز
                disabled={loading}
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