import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { adminLinks } from '../../config/navigation'; 
import StatCard from '../components/StatCard'; 
import { FaFileAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import MainBarChart from '../components/MainBarChart';
import { dailyInventionData, recentApplications } from '../data/mockUsers'; 
import MainAreaChart from '../components/MainAreaChart';
import RecentApplicationsTable from '../components/RecentApplicationsTable';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const adminProfile = { name: "Hotak", role: "Admin", avatar: null };

  // استایل‌های مستقیم برای حل فوری مشکل
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    width: '100%',
    marginBottom: '30px'
  };

  const chartGridStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
    gap: '25px',
    width: '100%'
  };

  return (
    <DashboardLayout links={adminLinks} userProfile={adminProfile} pageTitle="Dashboard">
      {/* استفاده از style مستقیم برای دور زدن محدودیت‌های CSS خارجی */}
      
      <div className="admin-content" style={{ width: '100%', display: 'block', padding: '20px 0px 20px 25px' }}>
        <Routes>
          <Route index element={
            <div style={{width: '100%', height: 'calc(100vh - 80px)',  overflowY: 'auto',  padding: '20px', display: 'block', boxSizing: 'border-box'}
                 }> 
              
              {/* بخش کارت‌ها */}
              <div style={gridStyle}>
                <StatCard title="Total Patents" value="10" icon={<FaFileAlt />} color="#3b82f6" />
                <StatCard title="Total Inventors" value="850" icon={<FaUsers />} color="#8b5cf6" />
                <StatCard title="Approved" value="85" icon={<FaCheckCircle />} color="#10b981" />
                <StatCard title="Pending" value="25" icon={<FaClock />} color="#f59e0b" />
                <StatCard title="Rejected" value="10" icon={<FaExclamationTriangle />} color="#ef4444" />
              </div>

              {/* بخش گراف‌ها */}
              <div style={chartGridStyle}>
                <div className="chart-box"><MainBarChart color="#3b82f6" /></div>
                <div className="chart-box"><MainAreaChart data={dailyInventionData} title="Trends" color="#10b981" /></div>
              </div>

              {/* بخش جدول */}
              <div style={{ marginTop: '30px', width: '100%' }}>
                <RecentApplicationsTable data={recentApplications} />
              </div>

            </div>
          } />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
      
    </DashboardLayout>
  );
};

export default AdminDashboard;