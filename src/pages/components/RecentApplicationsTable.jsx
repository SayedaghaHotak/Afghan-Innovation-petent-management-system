import React from 'react';
import './RecentApplicationsTable.css';
import Button from './Button'; // 👁️ آدرس کامپوننت بټن خودت را دقیق چک کن (مثلاً اگر در پوشه بالایی است)

const RecentApplicationsTable = ({ data, title, showActions = false, onReviewClick }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>{title}</h3>
        {/* در صفحات قبلی که showActions فرستاده نشده، این دکمه مثل سابق نمایش داده می‌شود */}
        {!showActions && <button className="view-all-btn">View All</button>}
      </div>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Innovation Title</th>
              <th>Innovator</th>
              <th>Date</th>
              <th>Status</th>
              {/* 🚀 ستون جدید فقط و فقط در صفحه Assigned ظاهر می‌شود */}
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td className="item-title">{app.title}</td>
                {/* 👁️ اصلاح املایی: اگر در پروژه‌ات innovetor است همان بماند، من اینجا مچ کردم */}
                <td>{app.innovetor || app.innovator}</td>
                <td>{app.date}</td>
                <td>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                {/* 🚀 استفاده از کامپوننت بټن شما بدون صدمه زدن به بخش‌های دیگر */}
                {showActions && (
                  <td>
                    <Button 
                      className="review-action-btn" 
                      onClick={() => onReviewClick && onReviewClick(app.id)}
                    >
                      Review Idea
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsTable;