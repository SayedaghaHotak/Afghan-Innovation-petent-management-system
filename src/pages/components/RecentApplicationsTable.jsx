import React from 'react';
import './RecentApplicationsTable.css';
import Button from './Button'; 

const RecentApplicationsTable = ({ data, title, showActions = false, onReviewClick }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>{title}</h3>
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
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id}>
                <td>#IAPMS-{app.id}</td>
                <td className="item-title">{app.title}</td>
                
                {/* 🛠️ فیکس کردن ارور اصلی: استخراج متن نام از آبجکت کاربر یا نمایش ایمیل */}
                <td>
                  {app.innovator || app.innovetor ? (
                    typeof (app.innovator || app.innovetor) === 'object' ? (
                      `${(app.innovator || app.innovetor).firstName || ''} ${(app.innovator || app.innovetor).lastName || ''}`.trim() || (app.innovator || app.innovetor).email
                    ) : (
                      app.innovator || app.innovetor
                    )
                  ) : (
                    'System User'
                  )}
                </td>

                {/* 🛠️ هماهنگ‌سازی تاریخ: استفاده از createdAt واقعی بک‌اِند در صورت نبودن فیلد date سنتی */}
                <td>
                  {app.date || (app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A')}
                </td>

                <td>
                  <span className={`status-badge ${app.status ? app.status.toLowerCase() : 'pending'}`}>
                    {app.status || 'PENDING'}
                  </span>
                </td>

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