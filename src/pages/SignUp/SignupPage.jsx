import React, { useState } from 'react';
import { registerUser } from '../data/mockUsers'; 
import InputField from '../components/InputField'; 
import Button from '../components/Button'; 
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import './SignupPage.css';
import signupImage from '../../assets/image2.jpg';

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
    if (!validate()) return; // اگر معتبر نبود متوقف شو

    setLoading(true);
    try {
      const response = await registerUser(formData);
      if (response.success) {
        setMessage("Success! Redirecting...");
        setTimeout(() => onSignupSuccess?.(), 2000);
      }
    } catch (error) {
      alert(error.message || "Error!");
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
            <InputField variant="underlined" icon={<FiUser />} name="firstName" placeholder="First Name" onChange={handleChange} error={errors.firstName} />
            <InputField variant="underlined" icon={<FiUser />} name="lastName" placeholder="Last Name" onChange={handleChange} error={errors.lastName} />
            <InputField variant="underlined" icon={<FiMail />} type="email" name="email" placeholder="Email" onChange={handleChange} error={errors.email} />
            <InputField variant="underlined" icon={<FiPhone />} name="phone" placeholder="Phone" onChange={handleChange} />
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