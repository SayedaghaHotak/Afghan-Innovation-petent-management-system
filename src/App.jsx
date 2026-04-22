import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/SignUp/SignupPage';
import AdminDashboard from './pages/admin/AdminDashboard';
function App() {
const [user, setUser] = useState(null);

  return (
    <Routes> 
      {/* 1. This makes the Admin Dashboard the first thing you see when the app runs */}
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      {/* 2. Admin Dashboard Route */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* 3. Signup Route */}
      <Route 
        path="/signup" 
        element={
          <SignupPage 
            onSignupSuccess={() => {}} // You can update these later with navigate('/login')
            onBackToLogin={() => {}} 
          />
        } 
      />

      {/* 4. Login Route */}
      <Route 
        path="/login" 
        element={
          <LoginPage 
            onLoginSuccess={(data) => setUser(data)} 
            onGoToSignup={() => {}} 
          />
        } 
      />

      {/* 5. Welcome/Profile Route (The code you had for 'if (user)') */}
      <Route 
        path="/welcome" 
        element={
          user ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Welcome {user.firstName}! ✅</h1>
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
}

export default App;