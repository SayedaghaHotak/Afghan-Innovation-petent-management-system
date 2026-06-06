// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/SignUp/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import UserDashboard from './pages/User_Dashboard/UserDashboard';

import CommitteeLayout from './pages/Committee_Dashboard/CommitteeLayout';
import CommitteeHome from './pages/Committee_Dashboard/CommitteeHome';
import CommitteeAssigned from './pages/Committee_Dashboard/CommitteeAssigned';
import AllIdeas from './pages/Committee_Dashboard/AllIdeas';
import IdeaReviewPage from './pages/Committee_Dashboard/CommitteeReview';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 👑 مانیتور هوشمند رول‌بیس اکسس برای زمان رفرش یا باز شدن دوباره سایت
  useEffect(() => {
    // 👑 تغییر به sessionStorage جهت امنیت چرخه احراز هویت
    const token = sessionStorage.getItem('token');
    const storedRoles = sessionStorage.getItem('userRoles');

    // اگر کاربر در صفحات عمومی است، سیستم کاری به کارش نداشته باشد
    if (
      location.pathname === '/login' || 
      location.pathname === '/signup' || 
      location.pathname === '/forgot-password'
    ) {
      return;
    }

    // =========================================================
    // 🛑 تغییر موقت برای پیش‌دفاع: اگر کاربر خواست دستی به داشبورد کمیته برود، جلویش را نگیر
    // =========================================================
    if (location.pathname.startsWith('/committee_dashboard')) {
      return; // قفل احراز هویت و ریدایرکت برای مسیرهای کمیته کاملاً باز شد
    }

    // ۱. اگر توکنی در کار نبود، فوراً او را به صفحه لاگین هدایت کن
    if (!token) {
      if (location.pathname !== '/') {
        navigate('/login');
      }
      return;
    }

    // ۲. خواندن رول‌ها از دیتابیس زنده و هدایت دقیق کاربر به داشبورد اختصاصی خود
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        const plainRoles = roles.map(role => typeof role === 'object' ? role.authority : role);
        
        const isAdminLive = plainRoles.includes('ADMIN') || plainRoles.includes('ROLE_ADMIN');
        const isReviewerLive = plainRoles.includes('REVIEWER') || plainRoles.includes('ROLE_REVIEWER');

        // جلوگیری از ریدایرکت تکراری برای رفع خطای لوپ بی‌نهایت
        if (isAdminLive) {
          if (!location.pathname.startsWith('/admin')) {
            navigate('/admin');
          }
        } else if (isReviewerLive) {
          if (!location.pathname.startsWith('/committee_dashboard')) {
            navigate('/committee_dashboard/home');
          }
        } else {
          // کاربر عادی (User)
          if (!location.pathname.startsWith('/user-dashboard')) {
            navigate('/user-dashboard');
          }
        }
      } catch (e) {
        console.error("Error parsing user roles from sessionStorage:", e);
      }
    }
  }, [navigate, location.pathname]);

  // متد کمکی برای هندل کردن لاگین موفق و ذخیره در استیت
  const handleLoginSuccess = (data) => {
    setUser(data);
  };

  return (
    <Routes> 
      {/* ⚡ مسیر اصلی سایت پیش‌فرض چک می‌کند؛ اگر توکن بود به داشبورد می‌رود، در غیر این صورت لاگین */}
      <Route path="/" element={
        sessionStorage.getItem('token') ? (
          <Navigate to="/login" replace /> // useEffect بالا خودش جابجایی به داشبورد اصلی را انجام می‌دهد
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )
      } />

      {/* روت ادمین */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* روت ثبت نام */}
      <Route path="/signup" element={
          <SignupPage onSignupSuccess={() => {}} onBackToLogin={() => {}} />
      } />

      {/* روت لاگین مستقیم */}
      <Route path="/login" element={
          <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignup={() => {}} />
      } />

      {/* روت فراموشی رمز عبور */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* روت کاربر عادی */}
      <Route path="/user-dashboard/*" element={<UserDashboard />} />

      {/* 👑 روت اصلی کمیته (Reviewer) با ساختار استاندارد Layout - کاملاً آزاد برای دمو فردا */}
      <Route path="/committee_dashboard" element={<CommitteeLayout />}>
        <Route index element={<CommitteeHome />} /> 
        <Route path="home" element={<CommitteeHome />} />
        <Route path="assigned" element={<CommitteeAssigned />} />
        <Route path="all" element={<AllIdeas />} />
        <Route path="review/:id" element={<IdeaReviewPage />} />
      </Route>

      {/* اگر مسیری اشتباه یا روت تعریف نشده وارد شد، مستقیم به صفحه اصلی هدایت شود */}
      <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}

export default App;