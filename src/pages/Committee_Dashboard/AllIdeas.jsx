import React, { useState, useEffect } from "react";
import axiosInstance from "axios"; // استفاده از اکسسیوس استاندارد پروژه
import RecentApplicationTable from "../components/RecentApplicationsTable"; 
import { FaSearch, FaFilter } from "react-icons/fa";
import "./AllIdeas.css";

const AllIdeasTab = () => {
  const [allRawPatents, setAllRawPatents] = useState([]); // ذخیره کل دیتای خام آمده از بک‌اِند
  const [displayIdeas, setDisplayIdeas] = useState([]);   // دیتای نهایی که بعد از سرچ و فیلتر به جدول داده می‌شود
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // ۱. فقط یک‌بار در ابتدا کل دیتای سیستم را از بک‌اِند لود می‌کنیم
  useEffect(() => {
    const fetchAllIdeasFromBackend = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");

        const response = await axiosInstance.get("http://localhost:8081/api/v1.0/patents/all-system-patents", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const allPatents = response.data || [];

        // مپ کردن امن دیتای بک‌اِند
        const mapped = allPatents.map((p) => {
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

        setAllRawPatents(mapped);
        setDisplayIdeas(mapped); // در ابتدا کل دیتا نشان داده می‌شود
      } catch (error) {
        console.error("Error fetching ideas from Spring Boot:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIdeasFromBackend();
  }, []);

  // ۲. 🚀 موتور فیلتر زنده: به محض تغییر searchTerm یا statusFilter، این بخش اجرا شده و جدول را آپدیت می‌کند
  useEffect(() => {
    const filtered = allRawPatents.filter((idea) => {
      // الف) بررسی مطابقت با کادر سرچ (عنوان یا نام دانشجو)
      const matchesSearch =
        (idea.title && idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (idea.student && idea.student.toLowerCase().includes(searchTerm.toLowerCase()));

      // ب) بررسی مطابقت با دراپ‌داون فیلتر وضعیت
      const matchesStatus =
        statusFilter === "ALL" || 
        (idea.status && idea.status.toUpperCase() === statusFilter.toUpperCase());

      return matchesSearch && matchesStatus;
    });

    setDisplayIdeas(filtered);
  }, [searchTerm, statusFilter, allRawPatents]); // وابستگی‌ها کاملاً تنظیم شده‌اند

  return (
    <div className="all-ideas-tab-viewport">
      {/* Search and Filter Action Bar */}
      <div className="tab-action-bar">
        <div className="search-box-wrapper">
          <FaSearch className="search-icon-inside" size={16} />
          <input
            type="text"
            placeholder="Search by title or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box-wrapper">
          <FaFilter className="filter-icon-inside" size={16} />
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

      {/* Table Container */}
      <div className="ideas-table-container-card">
        {isLoading ? (
          <div className="loading-spinner-zone">
            Loading data, please wait...
          </div>
        ) : displayIdeas.length > 0 ? (
          <RecentApplicationTable data={displayIdeas} />
        ) : (
          <div className="no-results-zone">
            No innovations found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIdeasTab;