// src/layouts/CommitteeLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; // 👁️ Outlet اضافه شد
import { FaSearch, FaBell, FaSun, FaMoon, FaAward } from "react-icons/fa";
import axios from "axios";
import "./CommitteeLayout.css";

const CommitteeLayout = ({ userProfile }) => {
  // 👁️ دریافت پراپس پروفایل
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("aims-theme") === "dark";
  });

  // استیت‌های متصل به بک‌اِند
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // 👁️ گرفتن دیتای زنده کاربر (اولویت با پراپس > دیتای ذخیره شده لوکال)
  const currentProfile = userProfile || {
    name: localStorage.getItem("userName") || "Committee Member",
    avatar: localStorage.getItem("user-avatar") || null,
  };

  // لیست منوهای افقی زیر نوبار
  const menuItems = [
    { id: "home", label: "Dashboard Home", path: "/committee_dashboard/home" },
    {
      id: "assigned",
      label: "Assigned Ideas",
      path: "/committee_dashboard/assigned",
    },
    { id: "all", label: "All Ideas", path: "/committee_dashboard/all" },
  ];

  // هندل لایت‌مود و دارک‌مود اتوماتیک با پروژه شما
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
    localStorage.setItem("aims-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // ۱. افکت گرفتن تعداد نوتیفیکیشن‌های زنده از بک‌اِند فرید
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8081/api/notifications/committee",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to sync live notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // ۲. هندل کردن سرچ زنده به بک‌اِند
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/committee_dashboard/all?search=${searchQuery}`);
    }
  };

  return (
    <div className="committee-layout-container">
      {/* 👑 بخش بالایی: نوبار اصلی */}
      <nav className="committee-navbar">
        {/* الف: نام پروژه یا مارک سیستم */}
        <div
          className="navbar-brand-zone"
          onClick={() => navigate("/committee_dashboard/home")}
        >
          <FaAward className="brand-icon-orange" />
          <span className="brand-text">
            AIMS <small>Committee</small>
          </span>
        </div>

        {/* ب: باکس جستجوی آماده متصل به بک‌اِند */}
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-bar-wrapper">
            <FaSearch className="search-field-icon" />
            <input
              type="text"
              placeholder="Search assigned ideas, criteria, patents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* ج: آپشن‌ها، نوتیفیکیشن و مشخصات ادمین/کمیته */}
        <div className="navbar-actions-zone">
          {/* دکمه تم */}
          <div
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <FaSun className="sun" />
            ) : (
              <FaMoon className="moon" />
            )}
          </div>

          {/* زنگوله نوتیفیکیشن داینامیک */}
          <div
            className="notification-bell-wrapper"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
            <FaBell className="bell-icon" />
            {notifications.length > 0 && (
              <span className="bell-badge-orange">{notifications.length}</span>
            )}

            {showNotifDropdown && (
              <div className="notif-dropdown-box">
                <h4>Recent Task Assignments</h4>
                {notifications.length === 0 ? (
                  <p className="empty-notif">No pending evaluations.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="notif-item">
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* پروفایل و نام کاربر زنده از پراپس پروژه شما */}
          <div className="user-profile-meta">
            <div className="user-avatar-circle">
              {currentProfile.avatar ? (
                <img
                  src={currentProfile.avatar}
                  alt="User"
                  className="nav-avatar-img"
                />
              ) : (
                currentProfile.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="user-info-text">
              <span className="profile-name">{currentProfile.name}</span>
              <span className="profile-role">Committee Board</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 📑 بخش دوم: منوهای افقی در پایین نوبار */}
      <div className="committee-sub-navigation">
        <div className="sub-nav-links-wrapper">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sub-nav-link-btn ${location.pathname === item.path ? "active-tab" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 💻 بخش سوم: نمایش صفحات به صورت کاملاً اتوماتیک و نیِستد */}
      <main className="committee-workspace-viewport">
        <Outlet />
      </main>
    </div>
  );
};

export default CommitteeLayout;
