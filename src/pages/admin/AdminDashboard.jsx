import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { adminLinks } from '../../config/navigation'; 
import StatCard from '../components/StatCard'; 
import { FaFileAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import MainBarChart from '../components/MainBarChart';
import MainAreaChart from '../components/MainAreaChart';
import RecentApplicationsTable from '../components/RecentApplicationsTable';
import UserManagement from '../components/UserManagement';
import CommitteeManagement from '../components/Commitee/CommitteeManagement';
import AllInnovations from '../components/All-innovation/AllInnovation';

const AdminDashboard = () => {
  const adminProfile = { name: "Hotak", role: "Admin", avatar: null };
  
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');











  useEffect(() => {
    const fetchOverview = async () => {
      try {
        let token = sessionStorage.getItem('token');
        
        // ⚡ اصلاح بیخی مهم: پاک‌سازی توکن از هرگونه کتیشن یا فرمت آرایه‌ای ناخواسته قبل از ارسال
        if (token) {
          token = token.replace(/^["']|["']$/g, '').trim(); 
        }
        
        // ارسال ریکوئست به پورت و آدرس دقیق جاوای فرید
        const response = await axios.get('http://localhost:8081/api/v1.0/admin-dashboard/overview', {
          headers: { 
            // ارسال توکن با فرمت استاندارد Bearer بیخی صاف و تمیز
            'Authorization': `Bearer ${token}` 
          }
        });
        
        setOverviewData(response.data);
      } catch (error) {
        console.error("Error fetching overview data:", error);
        if (error.response?.status === 401) {
          setApiError("ارور ۴۰1: شما به عنوان ADMIN احراز هویت نشده‌اید یا توکن ندارید.");
        } else {
          setApiError("خطا در اتصال به بک‌اِند.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

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
    <DashboardLayout links={adminLinks} userProfile={adminProfile} pageTitle="Admin Dashboard">
      <div className="admin-content" style={{ width: '100%', display: 'block', padding: '20px 0px 20px 25px' }}>
        <Routes>
          <Route index element={
            loading ? <div>در حال بارگذاری داشبورد...</div> : 
            apiError ? <div style={{ color: 'red', padding: '20px' }}>{apiError}</div> : (
              <div style={{width: '100%', height: 'calc(100vh - 80px)', overflowY: 'auto', padding: '20px', display: 'block', boxSizing: 'border-box'}}> 
                
                {/* بخش کارت‌ها مپ شده با ستون‌های دیتابیس فرید */}
                <div style={gridStyle}>
                  <StatCard title="Total Patents" value={overviewData?.totalPatents || "0"} icon={<FaFileAlt />} color="#3b82f6" />
                  
                  {/* این مقدار در این API نبود، موقتاً تعداد ماه قبل را جایش نمایش می‌دهیم */}
                  <StatCard title="Recent (30 Days)" value={overviewData?.lastMonthCount || "0"} icon={<FaUsers />} color="#8b5cf6" />
                  
                  <StatCard title="Approved" value={overviewData?.approved || "0"} icon={<FaCheckCircle />} color="#10b981" />
                  <StatCard title="Pending" value={overviewData?.pending || "0"} icon={<FaClock />} color="#f59e0b" />
                  
                  {/* فرید ریجکت را نفرستاده، دست‌نویس گذاشتیم تا کامپوننت خراب نشود */}
                  <StatCard title="Rejected" value="0" icon={<FaExclamationTriangle />} color="#ef4444" />
                </div>

                {/* بخش گراف‌ها متصل به dailyActivity جاوا */}
                <div style={chartGridStyle}>
                  <div className="chart-box"><MainBarChart data={overviewData?.dailyActivity || []} color="#3b82f6" /></div>
                  <div className="chart-box"><MainAreaChart data={overviewData?.dailyActivity || []} title="Trends" color="#10b981" /></div>
                </div>

                {/* بخش جدول متصل به فیلد latestSubmissions جاوا */}
                <div style={{ marginTop: '30px', width: '100%' }}>
                  <RecentApplicationsTable data={overviewData?.latestSubmissions || []} />
                </div>

              </div>
            )
          } />
          
          <Route path="users" element={<UserManagement />} />
          <Route path="committees" element={<CommitteeManagement />} />
          <Route path="innovations" element={<AllInnovations />} />
         
        </Routes>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;