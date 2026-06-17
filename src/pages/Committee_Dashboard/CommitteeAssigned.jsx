import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import "./CommitteeAssigned.css";

const CommitteeAssigned = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);

  // استیت‌های مربوط به سرچ و فیلتر لایو
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchAssignedIdeas = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem("token");

        // 🚀 اتصال به اندپوینت واقعی در بک‌اِند برای لیست داوری کمیته
        const response = await axios.get(
          "http://localhost:8081/api/v1.0/patents/review-list",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // 🛡️ دریافت لیست پتنت‌ها
        const assignedPatents = response.data || [];

        // 🔄 مپ کردن دیتا + ⚡ سورت نزولی (جدیدترین پتنت بر اساس آیدی در ابتدا)
        const mapped = assignedPatents
          .map((p) => {
            // 📅 حل مشکل فیلد تاریخ (چک کردن فیلدهای مختلف دیتابیس و فرمت‌دهی آن)
            let formattedDate = "Recent";
            if (p.submissionDate) {
              formattedDate = p.submissionDate.includes("T") 
                ? p.submissionDate.split("T")[0] 
                : p.submissionDate;
            } else if (p.createdAt) {
              formattedDate = p.createdAt.includes("T") 
                ? p.createdAt.split("T")[0] 
                : p.createdAt;
            }

            return {
              id: p.id,
              title: p.title || "Untitled Innovation",
              innovetor: p.innovator
                ? `${p.innovator.firstName || ""} ${p.innovator.lastName || ""}`.trim() || p.innovator.email
                : "Unknown",
              date: formattedDate, // 👈 حالا تاریخ واقعی سیستم اینجا قرار می‌گیرد
              status: p.status,
            };
          })
          .sort((a, b) => b.id - a.id); // 👈 اعمال سورت مستقیم و چابک در فرانت‌اِند

        setIdeas(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assigned innovations:", err);
        setError("Failed to load assigned plans.");
        setLoading(false);
      }
    };

    fetchAssignedIdeas();
  }, []);

  // 🔍 فرآیند فیلتر، سرچ و چیدمان همزمان در فرانت‌اِند
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      (idea.title &&
        idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.innovetor &&
        idea.innovetor.toLowerCase().includes(searchTerm.toLowerCase()));

    // 🛡️ همگام‌سازی حروف بزرگ دیتابیس با استیت فرانت‌اِند جهت جلوگیری از باگ عدم تطابق
    const matchesStatus =
      statusFilter === "ALL" ||
      (idea.status && idea.status.toUpperCase() === statusFilter.toUpperCase());

    return matchesSearch && matchesStatus;
  });

  // 🚀 تابع کلیک روی دکمه بررسی که آیدی ایده را به صفحه ارزیابی هدایت می‌کند
  const handleReviewRedirect = (id) => {
    navigate(`/committee_dashboard/review/${id}`);
  };

  if (loading)
    return (
      <div className="loading-spinner">Loading assigned innovations...</div>
    );
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* 📑 استفاده مجدد از کامپوننت جدول با بالاترین پرفورمنس */}
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