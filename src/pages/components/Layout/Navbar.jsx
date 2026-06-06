// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaSun, FaMoon } from 'react-icons/fa'; // آیکون‌های استفاده شده در کد شما
import { useNavigate } from 'react-router-dom'; // در صورت نیاز به روتینگ
import './Navbar.css';

const Navbar = ({ pageTitle = "Dashboard", userProfile }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('aims-theme');
    return savedTheme === 'dark';
  });

  // ۱. دیتای ایمن برای جلوگیری از کرش
  const currentProfile = userProfile || { name: "Guest", role: "User", avatar: null };

  // ۲. استیت برای عکسی که کاربر روی سیستم خودش آپلود می‌کند
  const [uploadedImg, setUploadedImg] = useState(null);

  // ۳. اولویت‌بندی هوشمند برای نمایش عکس
  const finalAvatar = uploadedImg || currentProfile.avatar || localStorage.getItem('user-avatar') || null;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('aims-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- انتخاب عکس ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImg(reader.result); // ذخیره در استیت محلی
        localStorage.setItem('user-avatar', reader.result); // ذخیره موقت در مرورگر
      };
      reader.readAsDataURL(file);
    }
  };

  // ۱. گرفتن دیتای رول‌ها از مرورگر برای شرط بل (اعلان‌ها) شما
  const userRoles = localStorage.getItem('userRoles');
  const isAdmin = () => {
    if (!userRoles) return false;
    try {
      const parsed = JSON.parse(userRoles);
      if (Array.isArray(parsed)) {
        return parsed.includes('ROLE_ADMIN');
      }
    } catch (e) {}
    return String(userRoles).includes('ROLE_ADMIN');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      {/* بخش سرچ عریض‌تر و بیخی منظم */}
      <div className="nav-search">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="      Search for patents, users..." />
        </div>
      </div>

      <div className="nav-right">
        {/* بخش آیکون خورشید و ماه */}
        <div className="theme-toggle-icon" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <FaSun className="sun-icon" title="Switch to Light Mode" />
          ) : (
            <FaMoon className="moon-icon" title="Switch to Dark Mode" />
          )}
        </div>

        {/* 🛡️ شرط نهایی و اصلی شما برای نمایش آیکون زنگوله ادمین */}
        {(String(localStorage.getItem('userRoles')).includes('ROLE_ADMIN') || 
          String(localStorage.getItem('role')).includes('ROLE_ADMIN')) && (
          <div className="nav-icon-badge">
            <FaBell />
            <span className="badge">3</span>
          </div>
        )}

        {/* بخش پروفایل داینامیک با قابلیت آپلود (کاملاً منظم و تراز شده) */}
        <div className="nav-user" onClick={() => document.getElementById('avatarInput').click()}>
          <input 
            type="file" 
            id="avatarInput" 
            hidden 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          
          {finalAvatar ? (
            <img src={finalAvatar} alt="Profile" className="nav-avatar" />
          ) : (
            /* 🟢 ایجاد دایره شیک با حرف اول اسم کاربر در صورت نبود تصویر */
            <div className="default-avatar">
              <span>{currentProfile.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          
          <span className="user-name">{currentProfile.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;