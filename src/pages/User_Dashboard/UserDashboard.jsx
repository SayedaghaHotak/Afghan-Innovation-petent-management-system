import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { userLinks } from '../../config/navigation'; // منوهای آماده خودت
import SubmitIdea from './SubmitIdea'; // اضافه کردن این خط در بالای فایل
import MyIdeas from './MyIdeas'; // Adjust the folder path if needed
import UserNotifications from './UserNotifications'; // Adjust the folder path if needed
import ProfileSettings from './ProfileSettings'; // اگر این فایل را ساختی، این خط را اضافه کن

// ۱. وارد کردن کامپوننت داینامیک که با هم ساختیم (آدرسش را دقیق چک کن)
import UserOverview from './UserOverview'; 

// ۲. ساختن کامپوننت‌های فرعی معلومات سیستم (آماده برای کدهای آینده شما)
const AboutPage = () => <div className="table-full-width-container"><h2>About AIMS</h2><p>Official system information and institutional guidelines go here...</p></div>;
const ContactPage = () => <div className="table-full-width-container"><h2>Contact Us</h2><p>Technical support lines, institutional desks, and active support tools...</p></div>;
const PrivacyPage = () => <div className="table-full-width-container"><h2>Cookies & Privacy</h2><p>Stateless JWT security compliance and data validation policies...</p></div>;

const UserDashboard = () => {
  // این پروفایل بعداً از دیتای واقعی لاگین خوانده می‌شود
  const userProfile = { name: "User Name", role: "User", avatar: null };

  return (
    <DashboardLayout links={userLinks} userProfile={userProfile} pageTitle="User Dashboard">
      
      {/* محتوای داخلی داشبورد کاربر - پدینگ چپ را کمی اصلاح کردیم تا با استایل افقی جدیدت همخوانی داشته باشد */}
      <div className="user-content" style={{ width: '100%', display: 'block', padding: '20px 25px 20px 25px', boxSizing: 'border-box' }}>
        <Routes>
          {/* ⚡ بیخیییی کلیدی: زمانیکه روی Dashboard Home کلیک شود، کامپوننت تو اجرا می‌شود */}
          <Route index element={<UserOverview />} />

          {/* مسیرهای مربوط به لینک‌های معلومات سیستم که در پایین صفحه کلیک می‌شوند */}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />

          {/* مسیرهای فرعی طبق چارت شما */}
          <Route path="submit" element={<SubmitIdea />} />
          <Route path="my-ideas" element={<MyIdeas />} />
          <Route path="idea/:id" element={<div>جزئیات ایده</div>} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </div>

    </DashboardLayout>
  );
};

export default UserDashboard;