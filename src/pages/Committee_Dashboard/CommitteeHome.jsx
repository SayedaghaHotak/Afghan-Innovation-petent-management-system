import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaInbox,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import StatCard from "../components/StatCard";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import "./CommitteeHome.css";

const CommitteeHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });
  const [recentIdeas, setRecentIdeas] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        let backendStatsLoaded = false;

        // 🚀 ۱. تلاش برای دریافت آمار از پروفایل بک‌اِند
        try {
          const profileResponse = await axios.get("http://localhost:8081/api/v1.0/committees/profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
          });

          if (profileResponse.data && profileResponse.data.stats) {
            const backendStats = profileResponse.data.stats;
            setStats({
              totalAssigned: backendStats.totalAssigned || 0,
              pendingCount: backendStats.pendingReview || 0,
              approvedCount: backendStats.approvedInnovations || 0,
              rejectedCount: backendStats.rejectedPlans || 0,
            });
            backendStatsLoaded = true;
          }
        } catch (profileErr) {
          console.log("⚠️ Profile endpoint 403. Switching to client-side stats calculation.");
        }

        // 🚀 ۲. دریافت لیست پتنت‌ها (که با موفقیت 200 کار می‌کند)
        try {
          const patentsResponse = await axios.get("http://localhost:8081/api/v1.0/patents/review-list", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
          });

          const assignedPatents = patentsResponse.data || [];

          // 🔥 اگر پروفایل خطای 403 داد، خودمان کاردها و چارت را از روی دیتای جدول پر می‌کنیم:
          if (!backendStatsLoaded && assignedPatents.length > 0) {
            const total = assignedPatents.length;
            const pending = assignedPatents.filter(p => p && p.status === "PENDING").length;
            const approved = assignedPatents.filter(p => p && (p.status === "APPROVED" || p.status === "ACCEPTED")).length;
            const rejected = assignedPatents.filter(p => p && p.status === "REJECTED").length;

            setStats({
              totalAssigned: total,
              pendingCount: pending,
              approvedCount: approved,
              rejectedCount: rejected,
            });
          }

          // مپ کردن دیتای جدول نهایی
          const mappedIdeas = assignedPatents.slice(0, 5).map((p) => {
            let formattedDate = "Recent";
            if (p && p.submissionDate) {
              formattedDate = p.submissionDate.includes("T") ? p.submissionDate.split("T")[0] : p.submissionDate;
            } else if (p && p.createdAt) {
              formattedDate = p.createdAt.includes("T") ? p.createdAt.split("T")[0] : p.createdAt;
            }

            let studentName = "System User";
            if (p) {
              if (p.innovatorName) {
                studentName = p.innovatorName;
              } else if (p.innovator) {
                const fullNameProperty = p.innovator.fullName;
                const combinedName = `${p.innovator.firstName || ""} ${p.innovator.lastName || ""}`.trim();
                studentName = fullNameProperty || combinedName || p.innovator.email || "System User";
              }
            }

            return {
              id: p?.id || Math.random(),
              title: p?.title || "Untitled Innovation",
              student: studentName,
              date: formattedDate,
              status: p?.status || "PENDING",
            };
          }).sort((a, b) => b.id - a.id);

          setRecentIdeas(mappedIdeas);
        } catch (patentsErr) {
          console.error("❌ Error fetching review list patents:", patentsErr);
        }

        setLoading(false);
      } catch (err) {
        console.error("General Error:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <div className="loading-spinner">Loading dashboard analytics...</div>;
  if (error) return <div className="error-message-zone">{error}</div>;

  const chartData = [
    { name: "Total Assigned", value: stats.totalAssigned, color: "#f97316" },
    { name: "Pending Review", value: stats.pendingCount, color: "#eab308" },
    { name: "Approved", value: stats.approvedCount, color: "#22c55e" },
    { name: "Rejected", value: stats.rejectedCount, color: "#ef4444" },
  ];

  return (
    <div className="committee-home-viewport">
      {/* 📑 کاردهای آماری */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Assigned"
          value={stats.totalAssigned}
          icon={<FaInbox />}
          color="#f97316"
          percentage={100}
          trend="Total ideas submitted by innovators"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingCount}
          icon={<FaHourglassHalf />}
          color="#eab308"
          percentage={stats.totalAssigned > 0 ? Math.round((stats.pendingCount / stats.totalAssigned) * 100) : 0}
          trend="Awaiting your evaluation"
        />
        <StatCard
          title="Approved Innovations"
          value={stats.approvedCount}
          icon={<FaCheckCircle />}
          color="#22c55e"
          percentage={stats.totalAssigned > 0 ? Math.round((stats.approvedCount / stats.totalAssigned) * 100) : 0}
          trend="Successfully evaluated"
        />
        <StatCard
          title="Rejected Plans"
          value={stats.rejectedCount}
          icon={<FaTimesCircle />}
          color="#ef4444"
          percentage={stats.totalAssigned > 0 ? Math.round((stats.rejectedCount / stats.totalAssigned) * 100) : 0}
          trend="Not meeting criteria"
        />
      </div>

      {/* 📊 بار چارت گرافیکی */}
      <div className="committee-chart-section">
        <h3>Evaluation Status Overview</h3>
        <div className="chart-container-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #f1f5f9)" />
              <XAxis dataKey="name" stroke="var(--text-muted, #94a3b8)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted, #94a3b8)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} contentStyle={{ background: "var(--bg-navbar, #fff)", borderColor: "var(--border-color, #e2e8f0)", borderRadius: "8px" }} />
              <Bar dataKey="value" barSize={40} radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📑 جدول پتنت‌ها */}
      <div className="recent-ideas-table-section">
        <RecentApplicationsTable title="Recent Assigned Innovations for Review" data={recentIdeas} />
      </div>
    </div>
  );
};

export default CommitteeHome;