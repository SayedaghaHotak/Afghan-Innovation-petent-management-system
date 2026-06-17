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

  // Stats mapped precisely to your Spring Boot's statisticsCollector response keys
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Recent data array linked directly to response.data.latestSubmissions
  const [recentData, setRecentData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Connecting directly to your UserController @GetMapping("/stats") endpoint
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
        setError("Failed to fetch dashboard analytics from the server.");
      } finally {
        setLoading(false);
      }
    };

    // FIX: Executing the stream handshake immediately on component mount
    fetchDashboardData();
  }, []);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert("Your technical support ticket has been submitted to the preview dashboard!");
    setFeedbackMessage('');
  };

  return (
    <div className="user-overview-container">
      
      {error && <p className="error-message">{error}</p>}
      
      {loading ? (
        <div className="loading-state-wrapper">
          <p className="loading-message">Fetching operational statistics from Spring Boot server...</p>
        </div>
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
            <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Latest Submissions
            </h3>
            {recentData.length > 0 ? (
              <RecentApplicationsTable data={recentData} />
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                No recent submissions found in your profile repository.
              </p>
            )}
          </div>
        </>
      )}

      {/* ================= SECTION 3: FULL WIDTH INTEGRATED HUB (ABOUT & CONTACT FORM) ================= */}
      <div className="aims-fullwidth-forum-hub">
        <div className="forum-inner-grid">
          
          {/* Left Column: System Metadata & Communications Vectors */}
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

            {/* Social Media Channels */}
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

          {/* Right Column: Transmission Support Ticket Form */}
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