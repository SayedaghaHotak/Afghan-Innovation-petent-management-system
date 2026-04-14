import React, { useState } from 'react';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/SignUp/SignupPage';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('signup');

  if (user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome {user.firstName}! ✅</h1>
        <button onClick={() => setUser(null)}>Logout</button>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'signup' ? (
        <SignupPage 
          onSignupSuccess={() => setCurrentPage('login')} 
          onBackToLogin={() => setCurrentPage('login')} 
        />
      ) : (
        <LoginPage 
          onLoginSuccess={(data) => setUser(data)} 
          onGoToSignup={() => setCurrentPage('signup')} 
        />
      )}
    </>
  );
}

export default App;