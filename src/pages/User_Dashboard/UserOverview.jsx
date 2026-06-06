// src/pages/UserOverview.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import StatCard from '../components/StatCard'; 
import RecentApplicationsTable from '../components/RecentApplicationsTable'; 
import { 
  FaFileAlt, FaCheckCircle, FaClock, FaExclamationTriangle,
  FaFacebook, FaWhatsapp, FaTelegram, FaLinkedin, FaBuilding,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane
} from 'react-icons/fa';
import './UserOverview.css'; 

const UserOverview = () => {
  const navigate = useNavigate(); 

  // ۱. استیت برای آمارهای عددی (دقیقاً مطابق فیلدهای بک‌اِند شما)
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // ۲. استیت برای لیست جدول (latestSubmissions)
  const [recentData, setRecentData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // استیت فرم تماس محلی برای بخش فوتر تمام‌صفحه
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    // ==========================================
    // 🛰️ بخش بک‌اِند اصلی (فعلاً کامنت شده است)
    // ==========================================
    /*
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:8081/api/v1.0/users/stats', config);
        
        if (response.data) {
          setStats({
            total: response.data.totalPatents || 0,
            approved: response.data.approvedPatents || 0,
            pending: response.data.pendingPatents || 0,
            rejected: response.data.rejectedPatents || 0
          });

          setRecentData(response.data.latestSubmissions || []);
        }
        
        setError('');
      } catch (err) {
        console.error("Backend Connection Error:", err);
        setError("Failed to fetch dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    */


    // ==========================================
    // 🧪 بخش دیتای موک (اصلاح شده برای رندر کامل Date و Innovator)
    // ==========================================
    const fetchDashboardMockData = () => {
      setLoading(true);
      try {
        const mockResponse = {
          totalPatents: 10,
          approvedPatents: 4,
          pendingPatents: 4,
          rejectedPatents: 2,
          latestSubmissions: [
            { id: 101, title: "AI-Powered Medical Diagnosis System", category: "HealthTech", status: "APPROVED", createdAt: "2026-01-15T10:00:00Z", date: "2026-01-15", innovator: "احمد مسعود" },
            { id: 102, title: "Decentralized Smart Grid Protocol", category: "Energy / IoT", status: "PENDING", createdAt: "2026-02-02T14:30:00Z", date: "2026-02-02", innovator: "محمود رحیمی" },
            { id: 103, title: "Autonomous Agricultural Drone Mesh", category: "Robotics", status: "REJECTED", createdAt: "2026-02-20T09:15:00Z", date: "2026-02-20", innovator: "سهراب کریمی" },
            { id: 104, title: "Quantum Cryptography Handshake Protocol", category: "Cybersecurity", status: "APPROVED", createdAt: "2026-03-01T11:00:00Z", date: "2026-03-01", innovator: "فرید کریمی" },
            { id: 105, title: "Water Filtration Via Nano-Carbon Mesh", category: "Chemical Tech", status: "PENDING", createdAt: "2026-03-12T16:45:00Z", date: "2026-03-12", innovator: "الیاس همدرد" },
            { id: 106, title: "E-Learning Adaptive Knowledge Graphs", category: "EdTech", status: "PENDING", createdAt: "2026-03-29T13:20:00Z", date: "2026-03-29", innovator: "امید ناصری" },
            { id: 107, title: "Next-Gen Solid State Battery Alloy", category: "Materials Science", status: "APPROVED", createdAt: "2026-04-05T08:00:00Z", date: "2026-04-05", innovator: "شریف سروری" },
            { id: 108, title: "Urban Traffic Optimization via Edge Computing", category: "Smart City", status: "REJECTED", createdAt: "2026-04-18T17:10:00Z", date: "2026-04-18", innovator: "حسیب الله صمیمی" },
            { id: 109, title: "Voice-Assisted Offline Operating System Shell", category: "Software Architecture", status: "PENDING", createdAt: "2026-05-01T12:00:00Z", date: "2026-05-01", innovator: "نصرت حقجو" },
            { id: 110, title: "Biometric Wallet with Thermal Sensors", category: "Hardware / FinTech", status: "APPROVED", createdAt: "2026-05-10T10:25:00Z", date: "2026-05-10", innovator: "سلطان احمدی" }
          ]
        };

        setStats({
          total: mockResponse.totalPatents,
          approved: mockResponse.approvedPatents,
          pending: mockResponse.pendingPatents,
          rejected: mockResponse.rejectedPatents
        });

        setRecentData(mockResponse.latestSubmissions);
        setError('');
      } catch (err) {
        setError("Failed to fetch mock analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMockData();
  }, []);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("پیام شما در سیستم دمو با موفقیت ثبت شد!");
    setFeedbackMessage('');
  };

  return (
    <div className="user-overview-container">
      
      {error && <p className="error-message">{error}</p>}
      
      {loading ? (
        <p className="loading-message">Fetching data from Spring Boot server...</p>
      ) : (
        <>
          {/* ================= SECTION 1: DYNAMIC STAT CARDS ================= */}
          <div className="cards-full-width-grid">
            <StatCard title="Total Patents" value={stats.total} icon={<FaFileAlt />} color="#3b82f6" />
            <StatCard title="Approved" value={stats.approved} icon={<FaCheckCircle />} color="#10b981" />
            <StatCard title="Pending" value={stats.pending} icon={<FaClock />} color="#f59e0b" />
            <StatCard title="Rejected" value={stats.rejected} icon={<FaExclamationTriangle />} color="#ef4444" />
          </div>

          {/* ================= SECTION 2: LATEST SUBMISSIONS TABLE ================= */}
          <div className="table-full-width-container">
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>Latest Submissions</h3>
            {recentData.length > 0 ? (
              <RecentApplicationsTable data={recentData} />
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                No recent submissions found in your profile.
              </p>
            )}
          </div>
        </>
      )}

      {/* ================= SECTION 3: FULL WIDTH INTEGRATED HUB (ABOUT & CONTACT FORM) ================= */}
      <div className="aims-fullwidth-forum-hub">
        <div className="forum-inner-grid">
          
          {/* سمت چپ: بخش تکست‌های طولانی و رسمی درباره سیستم و راه‌های ارتباطی */}
          <div className="forum-info-column">
            <div className="forum-block">
              <h3><FaBuilding className="block-icon" /> About AIMS Ecosystem</h3>
              <p>
                The Afghan Innovation Management System (AIMS) serves as the primary centralized national depository for intellectual property protection, innovative patent tracking, and academic evaluation. Built to empower young scholars, tech innovators, and researchers across the nation, AIMS bridges the gap between raw ingenuity and rigorous administrative evaluation pipelines.
              </p>
              <p>
                Our structural framework works directly in alignment with international patent logging standards, ensuring that data synchronization protocols, encrypted design uploads, and peer arbitration structures are safely maintained away from unauthorized distribution streams.
              </p>
            </div>

            <div className="forum-block">
              <h3>Institutional Communication Vectors</h3>
              <div className="contact-vector-item">
                <FaMapMarkerAlt className="vector-icon" />
                <span>Central Academic Research Block, Faculty Engineering Domain, Kabul, Afghanistan</span>
              </div>
              <div className="contact-vector-item">
                <FaPhoneAlt className="vector-icon" />
                <span>+93 (0) 789 456 123 / +93 (0) 20 250 1122</span>
              </div>
              <div className="contact-vector-item">
                <FaEnvelope className="vector-icon" />
                <span>verification-desk@aims.gov.af / support@iapms.edu</span>
              </div>
            </div>

            {/* بخش شبکه های اجتماعی درخواستی */}
            <div className="forum-social-block">
              <h4>Connect via Digital Channels</h4>
              <div className="social-links-row">
                <a href="#facebook" className="social-icon-btn fb" title="Facebook Page"><FaFacebook /></a>
                <a href="#whatsapp" className="social-icon-btn wa" title="WhatsApp Channel"><FaWhatsapp /></a>
                <a href="#telegram" className="social-icon-btn tg" title="Telegram Community"><FaTelegram /></a>
                <a href="#linkedin" className="social-icon-btn ln" title="LinkedIn Professional Network"><FaLinkedin /></a>
              </div>
            </div>
          </div>

          {/* سمت راست: فرم یکپارچه ارسال بازخورد و تماس با ما */}
          <div className="forum-form-column">
            <div className="contact-interactive-card">
              <h3>Direct Transmission Terminal</h3>
              <p>Have an arbitration query or technical submission block? Dispatch a secure notification ticket straight to the review board.</p>
              
              <form onSubmit={handleFeedbackSubmit} className="interactive-hub-form">
                <div className="form-input-group">
                  <label>Full Representative Name</label>
                  <input type="text" placeholder="e.g., Ahmad Rahimi" required />
                </div>

                <div className="form-input-group">
                  <label>Authorized Communication Email</label>
                  <input type="email" placeholder="username@domain.com" required />
                </div>

                <div className="form-input-group">
                  <label>Technical Query Classification</label>
                  <select required>
                    <option value="patent">Patent Verification Delay</option>
                    <option value="committee">Committee Arbitration Re-evaluation</option>
                    <option value="security">Security Token Handshake Errors</option>
                    <option value="other">General System Feedback</option>
                  </select>
                </div>

                <div className="form-input-group">
                  <label>Detailed Message Specification Log</label>
                  <textarea 
                    rows="4" 
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Describe your technical bottleneck or modification requirements here..." 
                    required
                  ></textarea>
                </div>

                <button type="submit" className="form-submit-dispatch-btn">
                  <FaPaperPlane /> Dispatch Secure Ticket
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserOverview;