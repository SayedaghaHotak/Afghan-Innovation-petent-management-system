import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecentApplicationsTable from '../components/RecentApplicationsTable'; // 👁️ ایمپورت کامپوننت جدول شما
import './CommitteeAssigned.css'; 

const CommitteeAssigned = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  
  // استیت‌های مربوط به سرچ و فیلتر لایو
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchAssignedIdeas = async () => {
      try {
        setLoading(true);

        // =========================================================================
        // 🛑 DEVELOPER MOCK DATA (حالت موقتی برای نمایش دیتای فرضی)
        // این دیتا دقیقاً مطابق با نام فیلدهای جدول خودت (id, title, innovetor, date, status) عیار شده است.
        // =========================================================================
        const mockIdeas = [
          { id: "101", title: "Automated Greenhouse System", innovetor: "Ahmad Wali", date: "2026-05-12", status: "PENDING" },
          { id: "102", title: "Blockchain Voting App", innovetor: "Saba Noori", date: "2026-05-14", status: "APPROVED" },
          { id: "103", title: "E-Learning Dari Platform", innovetor: "Omid Karimi", date: "2026-05-15", status: "PENDING" },
          { id: "104", title: "Smart Traffic Controller", innovetor: "Zia Haq", date: "2026-05-18", status: "REJECTED" },
          { id: "105", title: "Eco-Friendly Battery Tech", innovetor: "Mariam Sadat", date: "2026-05-20", status: "PENDING" }
        ];

        setIdeas(mockIdeas); // لود دیتای فرضی
        setLoading(false);
        // =========================================================================


        /* 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑
           📢 یادآوری بزرگ برای روز دفاع و اتصال به بک‌اِند واقعی فرید:
           هروقت دیتای واقعی آماده شد، بخش MOCK بالا را پاک کن و این بخش را باز کن:

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/v1.0/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const assignedPatents = response.data.assignedPatents || [];
        const mapped = assignedPatents.map(p => ({
          id: p.id,
          title: p.title || "Untitled Innovation",
          innovetor: p.innovator ? `${p.innovator.firstName} ${p.innovator.lastName}` : "Unknown",
          date: p.submissionDate || "Recent",
          status: p.status
        }));
        
        setIdeas(mapped);
        setLoading(false);
        
        👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 */

      } catch (err) {
        console.error("Error fetching assigned innovations:", err);
        setError("Failed to load assigned plans.");
        setLoading(false);
      }
    };

    fetchAssignedIdeas();
  }, []);

  // 🔍 فرآیند فلتر و سرچ همزمان در فرانت‌اِند
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idea.innovetor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || idea.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 🚀 تابع کلیک روی دکمه بررسی که آیدی ایده را به صفحه ارزیابی شوت می‌کند
  const handleReviewRedirect = (id) => {
    navigate(`/committee_dashboard/review/${id}`);
  };

  if (loading) return <div className="loading-spinner">Loading assigned innovations...</div>;
  if (error) return <div className="error-message-zone">{error}</div>;

  return (
    <div className="committee-assigned-viewport">
      
      {/* 👑 بخش عنوان صفحه */}
      <div className="page-title-zone">
        <h2>Assigned Innovations</h2>
        <p>Review and evaluate ideas allocated to your committee panel.</p>
      </div>

      {/* 🔍 بخش فیلترها و سرچ باکس لایو */}
      <div className="filter-action-bar">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            placeholder="Search by title or innovator name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-dropdown-wrapper">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* 📑 استفاده مجدد از کامپوننت جدول خودت با بالاترین پرفورمنس */}
      <div className="assigned-table-view">
        {filteredIdeas.length > 0 ? (
          <RecentApplicationsTable 
            title="List of Allocated Ideas"
            data={filteredIdeas}
            showActions={true} // فعال کردن ستون دکمه‌ها مخصوص این صفحه
            onReviewClick={handleReviewRedirect} // پاس دادن تابع هدایت مسیر
          />
        ) : (
          <div className="no-results-zone">
            No innovations found matching your criteria.
          </div>
        )}
      </div>

    </div>
  );
};

export default CommitteeAssigned;