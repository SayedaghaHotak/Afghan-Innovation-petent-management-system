// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/SignUp/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import UserDashboard from "./pages/User_Dashboard/UserDashboard";

import CommitteeLayout from "./pages/Committee_Dashboard/CommitteeLayout";
import CommitteeHome from "./pages/Committee_Dashboard/CommitteeHome";
import CommitteeAssigned from "./pages/Committee_Dashboard/CommitteeAssigned";
import AllIdeas from "./pages/Committee_Dashboard/AllIdeas";
import IdeaReviewPage from "./pages/Committee_Dashboard/CommitteeReview";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedRoles = sessionStorage.getItem("userRoles");

    if (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname === "/forgot-password"
    ) {
      return;
    }

    if (!token) {
      sessionStorage.clear();
      if (location.pathname !== "/") {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        const plainRoles = roles.map((role) =>
          typeof role === "object" ? role.authority : role,
        );

        const isAdminLive =
          plainRoles.includes("ADMIN") || plainRoles.includes("ROLE_ADMIN");
        const isReviewerLive =
          plainRoles.includes("REVIEWER") ||
          plainRoles.includes("ROLE_REVIEWER");

        if (isAdminLive) {
          if (!location.pathname.startsWith("/admin")) {
            navigate("/admin", { replace: true });
          }
        } else if (isReviewerLive) {
          if (!location.pathname.startsWith("/committee_dashboard")) {
            navigate("/committee_dashboard/home", { replace: true });
          }
        } else {
          if (!location.pathname.startsWith("/user-dashboard")) {
            navigate("/user-dashboard", { replace: true });
          }
        }
      } catch (e) {
        console.error("Error parsing user roles from sessionStorage:", e);
        sessionStorage.clear();
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  const handleLoginSuccess = (data) => {
    setUser(data);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          sessionStorage.getItem("token") ? (
            <div
              className="profile-loading-fallback"
              style={{ padding: "20px", textAlign: "center" }}
            >
              Loading Workspace...
            </div>
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route
        path="/signup"
        element={
          <SignupPage onSignupSuccess={() => {}} onBackToLogin={() => {}} />
        }
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onGoToSignup={() => {}}
          />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user-dashboard/*" element={<UserDashboard />} />

      <Route path="/committee_dashboard" element={<CommitteeLayout />}>
        <Route index element={<CommitteeHome />} />
        <Route path="home" element={<CommitteeHome />} />
        <Route path="assigned" element={<CommitteeAssigned />} />
        <Route path="all" element={<AllIdeas />} />
        <Route path="review/:id" element={<IdeaReviewPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
