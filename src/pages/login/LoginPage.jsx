// src/pages/login/LoginPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import './LoginPage.css';
import image from '../../assets/image2.jpg'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
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

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        username: formData.email 
      };

      const response = await axios.post('http://localhost:8081/api/v1.0/auth/login', loginData);
      
      let token = response.data.token;
      if (typeof token === 'object' && token !== null) {
        token = token.token || Object.values(token)[0];
      }
      if (Array.isArray(token)) {
        token = token[0];
      }

      if (!token) {
        throw new Error("Token not found in response");
      }

      const rolesReceived = response.data.roles || response.data.authorities || [];

      sessionStorage.setItem('token', token.trim());
      sessionStorage.setItem('userRoles', JSON.stringify(rolesReceived));
      
      if (response.data.user || response.data.username) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user || { email: response.data.username }));
      }

      onLoginSuccess?.(response.data);

      const plainRoles = rolesReceived.map(role => {
        return typeof role === 'object' ? role.authority : role;
      });

      const isAdmin = plainRoles.includes('ADMIN') || plainRoles.includes('ROLE_ADMIN');
      const isReviewer = plainRoles.includes('REVIEWER') || plainRoles.includes('ROLE_REVIEWER');

      if (isAdmin) {
        navigate('/admin');
      } else if (isReviewer) {
        navigate('/committee_dashboard/home'); 
      } else {
        navigate('/user-dashboard'); 
      }

    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ general: error.response?.data?.message || "Email or password is incorrect" });
    } finally {
      setLoading(false); 
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
      
      {/* سمت چپ: بخش لاگین فرم */}
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

            {/* بخش لینک‌های پایینی */}
            <div className="login-footer-links">
              <div className="forgot-password">
                <Button 
                  type="button"
                  onClick={() => navigate('/forgot-password')} 
                  disabled={loading}
                >
                  Forgot Password?
                </Button>
              </div>

              <div className="signup-prompt-text">
                Don't have an account?{' '}
                <span onClick={() => !loading && navigate('/signup')}>
                  Create Account / Sign Up
                </span>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* سمت راست: بخش تصویر همراه با کلاسی که انیمیشن را فعال می‌کند */}
      <div className="login-right">
        <div className="image-right">
          <img src={image} alt="innovation" className="animated-login-img" />
        </div>
      </div>

    </div>
  );
};

export default LoginPage;