// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { adminLinks } from "../../config/navigation";
import StatCard from "../components/StatCard";
import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers,
} from "react-icons/fa";
import MainBarChart from "../components/MainBarChart";
import MainAreaChart from "../components/MainAreaChart";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import UserManagement from "../components/UserManagement";
import CommitteeManagement from "../components/Commitee/CommitteeManagement";
import AllInnovations from "../components/All-innovation/AllInnovation";
import BackupManagement from "./BackupManagement";

const AdminDashboard = () => {
  // ⚡ خواندن مستقیم از localStorage جهت جلوگیری از حذف داتا هنگام رفرش
  const [adminProfile, setAdminProfile] = useState(() => {
    const savedName = sessionStorage.getItem("admin_name") || "Admin";
    const savedAvatar =
      sessionStorage.getItem("admin_avatar") || "https://placehold.co/150";
    return {
      name: savedName,
      role: "Admin",
      avatar: savedAvatar,
    };
  });

  const [overviewData, setOverviewData] = useState(null);
  const [formattedChartData, setFormattedChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        let token = sessionStorage.getItem("token");

        if (!token) {
          setApiError("توکن امنیتی یافت نشد. لطفا دوباره وارد سیستم شوید.");
          setLoading(false);
          return;
        }

        token = token.replace(/^["']|["']$/g, "").trim();

        const response = await axios.get(
          "http://localhost:8081/api/v1.0/admin-dashboard/overview",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data) {
          setOverviewData(response.data);

          // به روز رسانی اختیاری اگر سرور دیتای جدیدی فرستاد
          if (response.data.adminName) {
            sessionStorage.setItem("admin_name", response.data.adminName);
            setAdminProfile((prev) => ({
              ...prev,
              name: response.data.adminName,
            }));
          }

          if (response.data.dailyActivity) {
            const formatted = response.data.dailyActivity.map((item) => ({
              day: item.day ? item.day.toString() : "",
              inventions: item.count ? Number(item.count) : 0,
            }));
            setFormattedChartData(formatted);
          }
          setApiError("");
        }
      } catch (error) {
        console.error("Critical Connection Context Trace:", error);
        if (error.response) {
          setApiError(
            `خطای سرور (${error.response.status}): عدم دسترسی یا خطا در پردازش اطلاعات.`,
          );
        } else if (error.request) {
          setApiError(
            "خطا در اتصال به بک‌اِند. سرور روشن است اما پورت 8081 پاسخ نمی‌دهد.",
          );
        } else {
          setApiError("خطای ناشناخته در لود دیتای داشبورد.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    width: "100%",
    marginBottom: "30px",
  };

  const chartGridStyle = {
    display: "grid",
    gridTemplateColumns: window.innerWidth > 1024 ? "1fr 1fr" : "1fr",
    gap: "25px",
    width: "100%",
  };

  return (
    <DashboardLayout
      links={adminLinks}
      userProfile={adminProfile}
      pageTitle="Admin Dashboard"
    >
      <div
        className="admin-content"
        style={{
          width: "100%",
          display: "block",
          padding: "20px 0px 20px 25px",
        }}
      >
        <Routes>
          <Route
            index
            element={
              loading ? (
                <div style={{ padding: "20px", fontSize: "16px" }}>
                  در حال بارگذاری داشبورد...
                </div>
              ) : apiError ? (
                <div
                  style={{ color: "red", padding: "20px", fontWeight: "bold" }}
                >
                  {apiError}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "calc(100vh - 80px)",
                    overflowY: "auto",
                    padding: "20px",
                    display: "block",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={gridStyle}>
                    <StatCard
                      title="Total Patents"
                      value={overviewData?.totalPatents || "0"}
                      icon={<FaFileAlt />}
                      color="#3b82f6"
                    />
                    <StatCard
                      title="Recent (30 Days)"
                      value={overviewData?.lastMonthCount || "0"}
                      icon={<FaUsers />}
                      color="#8b5cf6"
                    />
                    <StatCard
                      title="Approved"
                      value={overviewData?.approved || "0"}
                      icon={<FaCheckCircle />}
                      color="#10b981"
                    />
                    <StatCard
                      title="Pending"
                      value={overviewData?.pending || "0"}
                      icon={<FaClock />}
                      color="#f59e0b"
                    />
                    <StatCard
                      title="Rejected"
                      value={overviewData?.rejected || "0"}
                      icon={<FaExclamationTriangle />}
                      color="#ef4444"
                    />
                  </div>

                  <div style={chartGridStyle}>
                    <div className="chart-box">
                      <MainBarChart data={formattedChartData} color="#3b82f6" />
                    </div>
                    <div className="chart-box">
                      <MainAreaChart
                        data={formattedChartData}
                        color="#10b981"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "30px", width: "100%" }}>
                    <RecentApplicationsTable
                      data={overviewData?.latestSubmissions || []}
                    />
                  </div>
                </div>
              )
            }
          />
          <Route path="users" element={<UserManagement />} />
          <Route path="committees" element={<CommitteeManagement />} />
          <Route path="innovations" element={<AllInnovations />} />
          <Route path="backups" element={<BackupManagement />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
