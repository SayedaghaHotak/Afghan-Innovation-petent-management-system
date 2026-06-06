import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaInbox, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard'; 
import RecentApplicationsTable from '../components/RecentApplicationsTable'; 
import './CommitteeHome.css';

const CommitteeHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalAssigned: 0, approvedCount: 0, rejectedCount: 0, pendingCount: 0 });
  const [recentIdeas, setRecentIdeas] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // =========================================================================
        // 🛑 DEVELOPER MOCK DATA (حالت موقتی برای نمایش چارت و کاردها)
        // چون فعلاً رول Reviewer در دیتابیس نداری، از این دیتا استفاده می‌شود
        // =========================================================================
        const mockAssignedPatents = [
          { id: 1, title: "Solar Energy System", status: "APPROVED", submissionDate: "2026-05-10", innovator: {firstName: "Ahmad", lastName: "Wali"} },
          { id: 2, title: "Smart Irrigation", status: "PENDING", submissionDate: "2026-05-12", innovator: {firstName: "Saba", lastName: "Noori"} },
          { id: 3, title: "AI Health Bot", status: "PENDING", submissionDate: "2026-05-15", innovator: {firstName: "Omid", lastName: "Karimi"} },
          { id: 4, title: "Wind Turbine Pro", status: "REJECTED", submissionDate: "2026-05-18", innovator: {firstName: "Zia", lastName: "Haq"} }
        ];

        const assignedPatents = mockAssignedPatents; // فعلاً دیتا را از موک می‌گیرد
        // =========================================================================


        /* 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑
           📢 بخش اصلی اتصال به بک‌اِند (فعلاً کامنت شده):
           وقتی فرید رول REVIEWER را در بک‌اِند ساخت، بخش MOCK بالا را پاک کن 
           و این چند خط زیر را از کامنت خارج کن:

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/v1.0/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const assignedPatents = response.data.assignedPatents || [];
        
        👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 */


        // منطق مشترک برای محاسبه آمار (چه موک باشد چه بک‌اِند)
        const total = assignedPatents.length;
        const approved = assignedPatents.filter(p => p.status === 'APPROVED').length;
        const rejected = assignedPatents.filter(p => p.status === 'REJECTED').length;
        const pending = assignedPatents.filter(p => p.status === 'PENDING').length;

        setStats({ totalAssigned: total, approvedCount: approved, rejectedCount: rejected, pendingCount: pending });

        const mappedIdeas = assignedPatents.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title || "Untitled Innovation",
          innovetor: p.innovator ? `${p.innovator.firstName} ${p.innovator.lastName}` : "Unknown",
          date: p.submissionDate || "Recent",
          status: p.status
        }));

        setRecentIdeas(mappedIdeas);
        setLoading(false);
      } catch (err) {
        console.error("Error loading committee dashboard:", err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading dashboard analytics...</div>;
  if (error) return <div className="error-message-zone">{error}</div>;

  const chartData = [
    { name: 'Total Assigned', value: stats.totalAssigned, color: '#f97316' },
    { name: 'Pending Review', value: stats.pendingCount, color: '#eab308' },
    { name: 'Approved', value: stats.approvedCount, color: '#22c55e' },
    { name: 'Rejected', value: stats.rejectedCount, color: '#ef4444' }
  ];

  return (
    <div className="committee-home-viewport">
      
      {/* 📑 بخش اول: کاردهای آماری */}
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

      {/* 📊 بخش دوم: بار چارت گرافیکی */}
      <div className="committee-chart-section">
        <h3>Evaluation Status Overview</h3>
        <div className="chart-container-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #f1f5f9)" />
              <XAxis dataKey="name" stroke="var(--text-muted, #94a3b8)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted, #94a3b8)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                contentStyle={{ background: 'var(--bg-navbar, #fff)', borderColor: 'var(--border-color, #e2e8f0)', borderRadius: '8px', color: 'var(--text-main, #1e293b)' }}
              />
              <Bar dataKey="value" barSize={40} radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📑 بخش سوم: جدول پتنت‌ها */}
      <div className="recent-ideas-table-section">
        <RecentApplicationsTable 
          title="Recent Assigned Innovations for Review" 
          data={recentIdeas} 
        />
      </div>

    </div>
  );
};

export default CommitteeHome;