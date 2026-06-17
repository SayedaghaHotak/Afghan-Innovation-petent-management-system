// src/pages/UserNotifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBell, FaEnvelopeOpen, FaCheckCircle, FaTimesCircle, 
  FaClock, FaTimes, FaInbox, FaTrashAlt, FaCircle 
} from 'react-icons/fa';
import './UserNotifications.css';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal Popup Panel States for targeted item inspection
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ========================================================
  // 🛰️ متدهای اتصال مستقیم و زنده به بک‌اِند
  // ========================================================
  
  // ۱. دریافت تمام نوتیفیکیشن‌ها از دیتابیس لایو
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8081/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
      setError('');
    } catch (err) {
      console.error("Database connection failure:", err);
      setError('Could not fetch synchronized live notifications map.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ۲. باز کردن مودال نمایش جزئیات و تایید خودکار خوانده شدن تک اعلان
  const handleOpenModal = async (notif) => {
    setSelectedNotif(notif);
    setIsModalOpen(true);

    // بررسی هوشمند وضعیت خوانده شدن برای فیلدهای تفکیک شده دیتابیس
    const isAlreadyRead = notif.read || notif.isRead || false;

    if (!isAlreadyRead) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.put(`http://localhost:8081/api/notifications/${notif.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // به‌روزرسانی سریع وضعیت در لوکال استیت فرانت‌اِند
        setNotifications(prev => 
          prev.map(n => n.id === notif.id ? { ...n, read: true, isRead: true } : n)
        );
      } catch (err) {
        console.error("Failed to commit read status transaction:", err);
      }
    }
  };

  // ۳. خوانده شدن همه‌ٔ اعلان‌ها به صورت گروهی
  const handleMarkAllRead = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put('http://localhost:8081/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
    } catch (err) {
      console.error("Batch clear update trace error:", err);
    }
  };

  // ۴. حذف کامل اعلان از لیست دیتابیس و فرانت‌اِند
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation(); // جلوگیری از باز شدن ناگهانی پنجره مودال در زمان کلیک سطل زباله
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:8081/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selectedNotif && selectedNotif.id === id) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Purge operations execution error:", err);
    }
  };

  // تابع کمکی برای جداسازی وضعیت کلمات کلیدی پیام و ست کردن رنگ آیکون‌ها
  const parseNotificationContent = (rawMessage) => {
    if (!rawMessage) return { status: 'PENDING', text: 'No message context provided.' };
    
    let status = 'PENDING';
    if (rawMessage.toUpperCase().includes('APPROVED')) status = 'APPROVED';
    if (rawMessage.toUpperCase().includes('REJECTED')) status = 'REJECTED';

    return { status, text: rawMessage };
  };

  if (loading) {
    return (
      <div className="notif-workspace-container">
        <div className="workspace-loading">Reading global notification pipeline vectors...</div>
      </div>
    );
  }

  // بررسی وضعیت وجود اعلان خوانده نشده برای نمایش یا مخفی‌سازی دکمه Mark All Read
  const hasUnread = notifications.some(n => n.read === false || n.isRead === false);

  return (
    <div className="notif-workspace-container">
      {/* هدر بالایی کنترل پنل اعلان‌ها */}
      <div className="notif-section-header">
        <div className="headline-text-block">
          <h2><FaBell className="ambient-bell-glow" /> Notification Center</h2>
          <p>Review real-time transaction updates pushed directly by institutional security and evaluation services.</p>
        </div>
        {hasUnread && (
          <button className="batch-processing-btn" onClick={handleMarkAllRead}>
            <FaEnvelopeOpen /> Mark All Read
          </button>
        )}
      </div>

      {error && <div className="workspace-error-banner">{error}</div>}

      {/* بخش اصلی نمایش محتوا یا فالبک خالی بودن لیست */}
      {notifications.length === 0 ? (
        <div className="empty-inbox-fallback">
          <FaInbox className="fallback-vector-graphic" />
          <h3>System Ledger Clear</h3>
          <p>No profile alerts or verification activities exist for this account database token key.</p>
        </div>
      ) : (
        <div className="notifications-table-layout">
          {notifications.map((notif) => {
            const parsed = parseNotificationContent(notif.message);
            const isUnread = notif.read === false || notif.isRead === false;
            
            return (
              <div 
                key={notif.id} 
                className={`notif-horizontal-row ${isUnread ? 'unread-state' : ''}`}
                onClick={() => handleOpenModal(notif)}
              >
                {/* دایره پالس‌زن وضعیت خوانده نشده */}
                <div className="unread-dot-indicator">
                  {isUnread && <FaCircle className="pulse-dot" />}
                </div>

                {/* آیکون وضعیت تایید یا رد درخواست */}
                <div className="notif-icon-badge-box">
                  {parsed.status === 'APPROVED' ? (
                    <div className="badge-shape positive"><FaCheckCircle /></div>
                  ) : (
                    <div className="badge-shape negative"><FaTimesCircle /></div>
                  )}
                </div>

                {/* متن پیام اصلی و مهر زمان ساخت */}
                <div className="notif-message-preview-cell">
                  <p className="main-message-string-truncate">{parsed.text}</p>
                  <span className="notif-timestamp-tag">
                    <FaClock /> {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent Security Stamp'}
                  </span>
                </div>

                {/* دکمه عملیاتی حذف و پاکسازی */}
                <div className="notif-row-actions-cell">
                  <button 
                    className="notif-trash-action-btn" 
                    onClick={(e) => handleDeleteNotification(e, notif.id)}
                    title="Purge Record"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* مودال پاپ‌آپ نمایش کامل جزئیات اعلان انتخاب شده */}
      {isModalOpen && selectedNotif && (
        <div className="modal-fixed-overlay-frame" onClick={() => setIsModalOpen(false)}>
          <div className="modal-layout-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-strip">
              <h3>System Dispatch File Summary</h3>
              <button className="modal-close-icon-trigger" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-scrollable-body">
              <div className="metadata-log-card">
                <span className="meta-label">Unique Transaction Identity</span>
                <span className="meta-value-id">#IAPMS-NTF-{selectedNotif.id}</span>
              </div>

              <div className="metadata-log-card borderless">
                <span className="meta-label">Full Context Specification Description</span>
                <p className="meta-message-block-text">
                  {parseNotificationContent(selectedNotif.message).text}
                </p>
              </div>

              <div className="modal-status-pill-display">
                <span className="meta-label">Current Evaluation Assessment Code</span>
                <div className={`status-pill-indicator ${parseNotificationContent(selectedNotif.message).status.toLowerCase()}`}>
                  {parseNotificationContent(selectedNotif.message).status}
                </div>
              </div>
            </div>

            <div className="modal-footer-action-row">
              <button className="modal-dismiss-btn" onClick={() => setIsModalOpen(false)}>
                Close Workspace Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;