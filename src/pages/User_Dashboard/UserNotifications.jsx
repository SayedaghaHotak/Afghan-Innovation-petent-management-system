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
  // 🛰️ بخش متدهای اتصال به بک‌اِند (فعلاً کامنت شده است)
  // ========================================================
  /*
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      // Matched precisely with GET /api/notifications inside NotificationController
      const response = await axios.get('http://localhost:8081/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error("Database connection failure:", err);
      setError('Could not fetch synchronized live notifications map.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (notif) => {
    setSelectedNotif(notif);
    setIsModalOpen(true);

    // If the notification is unread, automatically fire PUT trigger to match backend route
    if (!notif.read) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8081/api/notifications/${notif.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh local UI logs state array to clear unread counts or markers
        setNotifications(prev => 
          prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
        );
      } catch (err) {
        console.error("Failed to commit read status transaction:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      // Intersects directly with PUT /api/notifications/read-all inside Farid's controller
      await axios.put('http://localhost:8081/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Batch clear update trace error:", err);
    }
  };

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation(); // Prevents opening inspection panel popup modal instantly
    try {
      const token = localStorage.getItem('token');
      // Leverages DELETE /api/notifications/{id} mapping endpoint rule
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
  */


  // ========================================================
  // 🧪 بخش دیتای موک و متدهای شبیه‌سازی فرانت‌اِند
  // ========================================================
  const fetchNotifications = () => {
    try {
      const mockNotifications = [
        {
          id: 1,
          message: "Your invention design 'AI-Powered Medical Diagnosis System' has been APPROVED by the Biomedical Committee.",
          read: false,
          createdAt: "2026-06-05T14:22:00Z"
        },
        {
          id: 2,
          message: "The specification documentation for 'Autonomous Agricultural Drone Mesh' was REJECTED. Please check reviewer feedback.",
          read: false,
          createdAt: "2026-06-04T09:15:00Z"
        },
        {
          id: 3,
          message: "Your application 'Quantum Cryptography Handshake Protocol' has moved to APPROVED status after final evaluation.",
          read: true,
          createdAt: "2026-06-02T11:00:00Z"
        },
        {
          id: 4,
          message: "Evaluation update: 'Next-Gen Solid State Battery Alloy' has passed formal verification and is now APPROVED.",
          read: false,
          createdAt: "2026-06-01T18:30:00Z"
        },
        {
          id: 5,
          message: "The submission 'Urban Traffic Optimization via Edge Computing' was REJECTED due to delay vector thresholds overflow.",
          read: true,
          createdAt: "2026-05-28T10:45:00Z"
        },
        {
          id: 6,
          message: "Congratulations! Your centralized project ledger log is APPROVED by the Hardware Systems Panel.",
          read: true,
          createdAt: "2026-05-25T13:12:00Z"
        },
        {
          id: 7,
          message: "Security Alert: A new login transaction handshake token was registered for your profile key dashboard.",
          read: true,
          createdAt: "2026-05-22T08:05:00Z"
        },
        {
          id: 8,
          message: "Your draft record 'Decentralized Smart Grid Protocol' status remains PENDING arbitration review.",
          read: false,
          createdAt: "2026-05-20T16:00:00Z"
        },
        {
          id: 9,
          message: "Verification complete: Academic evaluation for system code #IAPMS-104 is officially APPROVED.",
          read: true,
          createdAt: "2026-05-18T11:55:00Z"
        },
        {
          id: 10,
          message: "The evaluation board has REJECTED the architecture design amendment proposed on structural grid maps.",
          read: true,
          createdAt: "2026-05-15T14:20:00Z"
        }
      ];
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to inject mock live notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // شبیه‌سازی باز کردن مودال و خوانده شدن نوتیفیکیشن در حالت فرانت‌اِند مستقل
  const handleOpenModal = (notif) => {
    setSelectedNotif(notif);
    setIsModalOpen(true);

    if (!notif.read) {
      setNotifications(prev => 
        prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
      );
    }
  };

  // شبیه‌سازی خواندن همهٔ نوتیفیکیشن‌ها در حالت فرانت‌اِند مستقل
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // شبیه‌سازی حذف نوتیفیکیشن در حالت فرانت‌اِند مستقل
  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setIsModalOpen(false);
    }
  };

  // Safe parsing extraction assistant to divide your unified message string cleanly
  const parseNotificationContent = (rawMessage) => {
    if (!rawMessage) return { status: 'UNKNOWN', body: 'No message context provided.' };
    
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

  return (
    <div className="notif-workspace-container">
      {/* Dynamic Upper Control Headline */}
      <div className="notif-section-header">
        <div className="headline-text-block">
          <h2><FaBell className="ambient-bell-glow" /> Notification Center</h2>
          <p>Review real-time transaction updates pushed directly by institutional security and evaluation services.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button className="batch-processing-btn" onClick={handleMarkAllRead}>
            <FaEnvelopeOpen /> Mark All Read
          </button>
        )}
      </div>

      {error && <div className="workspace-error-banner">{error}</div>}

      {/* Main Container Layout */}
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
            return (
              <div 
                key={notif.id} 
                className={`notif-horizontal-row ${!notif.read ? 'unread-state' : ''}`}
                onClick={() => handleOpenModal(notif)}
              >
                {/* Active Indicator Pillar Component */}
                <div className="unread-dot-indicator">
                  {!notif.read && <FaCircle className="pulse-dot" />}
                </div>

                <div className="notif-icon-badge-box">
                  {parsed.status === 'APPROVED' ? (
                    <div className="badge-shape positive"><FaCheckCircle /></div>
                  ) : (
                    <div className="badge-shape negative"><FaTimesCircle /></div>
                  )}
                </div>

                <div className="notif-message-preview-cell">
                  <p className="main-message-string-truncate">{parsed.text}</p>
                  <span className="notif-timestamp-tag">
                    <FaClock /> {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent Security Stamp'}
                  </span>
                </div>

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

      {/* 2. Detailed Verification Target Inspection Modal Popup Panel */}
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