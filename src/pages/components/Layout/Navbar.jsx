import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ pageTitle = "Dashboard" }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('aims-theme');
    return savedTheme === 'dark';
  });

  // --- استیت جدید برای ذخیره عکس آپلود شده ---
  const [profileImg, setProfileImg] = useState(() => {
    return localStorage.getItem('user-avatar') || null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('aims-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- تابع مدیریت انتخاب عکس ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        localStorage.setItem('user-avatar', reader.result); // ذخیره موقت در مرورگر
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="page-title">{pageTitle}</h2>
      </div>

      <div className="nav-search">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for patents, users..." />
        </div>
      </div>

      <div className="nav-right">
                {/* بخش آیکون خورشید و ماه برای تم */}
        <div className="theme-toggle-icon" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <FaSun className="sun-icon" title="Switch to Light Mode" />
          ) : (
            <FaMoon className="moon-icon" title="Switch to Dark Mode" />
          )}
        </div>

        <div className="nav-icon-badge">
          <FaBell />
          <span className="badge">3</span>
        </div>

        {/* بخش پروفایل داینامیک با قابلیت آپلود */}
        <div className="nav-user" onClick={() => document.getElementById('avatarInput').click()}>
          <input 
            type="file" 
            id="avatarInput" 
            hidden 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          
          {profileImg ? (
            <img src={profileImg} alt="Profile" className="nav-avatar" />
          ) : (
            <FaUserCircle className="user-avatar-icon" />
          )}
          <span className="user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;