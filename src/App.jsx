import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/SignUp/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes> 
      {/* ۱. هدایت مستقیم به پنل ادمین در هنگام اجرای اپلیکیشن */}
      <Route path="/" element={<Navigate to="/admin" />} />

      {/* ۲. مسیر اصلی ادمین با ستاره (*) برای شناسایی زیر-مسیرها */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* ۳. مسیر ثبت نام */}
      <Route path="/signup" element={
          <SignupPage onSignupSuccess={() => {}} onBackToLogin={() => {}} />
      } />

      {/* ۴. مسیر ورود */}
      <Route path="/login" element={
          <LoginPage onLoginSuccess={(data) => setUser(data)} onGoToSignup={() => {}} />
      } />

      {/* ۵. صفحه پروفایل */}
      <Route path="/welcome" element={
          user ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Welcome {user.firstName}! ✅</h1>
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          ) : ( <Navigate to="/login" /> )
      } />
    </Routes>
  );
}

export default App;