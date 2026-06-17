// src/pages/MyIdeas.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaLightbulb, FaHourglassHalf, FaCheckCircle, FaTimesCircle, 
  FaEye, FaDownload, FaInbox, FaCalendarAlt, FaFolderOpen, 
  FaTimes, FaExclamationCircle, FaCheck, FaSync 
} from 'react-icons/fa';
import './MyIdeas.css';

const MyIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Drawer Panel States for detailed inspection view
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ==========================================
  // 🛰️ Connected Live Backend Stream
  // ==========================================
  const fetchMyIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('token');
      
      // Points directly to the user-specific @GetMapping inside PatentController.java
      const response = await axios.get('http://localhost:8081/api/v1.0/patents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setIdeas(response.data);
      } else {
        setIdeas([]);
      }
    } catch (err) {
      console.error("Error connecting to iapms database:", err);
      setError('System could not establish handshake with server repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  // Compute stats dynamically from database response
  const totalCount = ideas.length;
  const pendingCount = ideas.filter(i => i.status === 'PENDING' || !i.status).length;
  const approvedCount = ideas.filter(i => i.status === 'APPROVED').length;
  const rejectedCount = ideas.filter(i => i.status === 'REJECTED').length;

  const openInspectionDrawer = (idea) => {
    setSelectedIdea(idea);
    setIsDrawerOpen(true);
  };

  const closeInspectionDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedIdea(null);
  };








const handleDownloadFile = async (id, originalFileName) => {
  try {
    const token = sessionStorage.getItem('token');
    
    // ۱. دریافت فایل به صورت باینری (blob) همراه با توکن امنیتی
    const response = await axios.get(`http://localhost:8081/api/v1.0/patents/view/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob' // خیلی مهم: به اکسپوس می‌گوید خروجی فایل باینری است
    });

    // ۲. ساخت یک لینک موقت در مرورگر برای دانلود فایل
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // تعیین اسم فایل (اگر اسمی نبود، یک اسم پیشفرض می‌گذارد)
    link.setAttribute('download', originalFileName || `document_${id}.pdf`);
    
    // ۳. شبیه‌سازی کلیک و دانلود فایل
    document.body.appendChild(link);
    link.click();
    
    // ۴. پاکسازی حافظه
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading file:", err);
    alert("Could not download the file. Access Denied or File Not Found.");
  }
};





  return (
    <div className="my-ideas-container">
      {/* Dashboard Headline */}
      <div className="ideas-header-section">
        <h2>My Innovation Portfolio</h2>
        <p>Monitor intellectual metadata status, tracking timelines, and academic reviews.</p>
      </div>

      {error && <div className="system-error-banner">{error}</div>}

      {/* Analytics Summary Block */}
      <div className="summary-cards-layout">
        <div className="dashboard-metric-card">
          <div className="metric-badge-icon total"><FaLightbulb /></div>
          <div className="metric-text-wrapper">
            <h3>{totalCount}</h3>
            <span>Total Logged</span>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="metric-badge-icon pending"><FaHourglassHalf /></div>
          <div className="metric-text-wrapper">
            <h3>{pendingCount}</h3>
            <span>In Committee Review</span>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="metric-badge-icon approved"><FaCheckCircle /></div>
          <div className="metric-text-wrapper">
            <h3>{approvedCount}</h3>
            <span>Approved Patents</span>
          </div>
        </div>
        <div className="dashboard-metric-card">
          <div className="metric-badge-icon rejected"><FaTimesCircle /></div>
          <div className="metric-text-wrapper">
            <h3>{rejectedCount}</h3>
            <span>Rejected / Modifications</span>
          </div>
        </div>
      </div>

      {/* Master Grid / Table List Render */}
      {ideas.length === 0 ? (
        <div className="empty-portfolio-state">
          <FaInbox className="fallback-empty-icon" />
          <h3>No Records Stored In Database</h3>
          <p>The centralized ledger returned 0 patents for this profile. Submit a design protocol to activate tracking.</p>
        </div>
      ) : (
        <div className="portfolio-list-section">
          <div className="section-title-bar">
            <h3>Registered Logs</h3>
            <button className="refresh-ledger-btn" onClick={fetchMyIdeas} title="Reload Data Stream">
              <FaSync /> Refresh
            </button>
          </div>
          
          <div className="portfolio-grid">
            {ideas.map((idea) => (
              <div key={idea.id} className="patent-portfolio-card">
                <div className="card-top-row">
                  <span className="patent-serial-tag">ID: #IAPMS-{idea.id}</span>
                  <span className={`status-badge-ui ${idea.status?.toLowerCase() || 'pending'}`}>
                    {idea.status || 'PENDING'}
                  </span>
                </div>

                <h4 className="patent-card-headline">{idea.title}</h4>
                <p className="patent-card-excerpt">{idea.description}</p>

                <div className="patent-card-footer-tags">
                  <span className="footer-tag"><FaFolderOpen /> {idea.category}</span>
                  <span className="footer-tag">
                    <FaCalendarAlt /> {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Pending Trace'}
                  </span>
                </div>

                <div className="patent-card-cta-group">
                  <button className="cta-action-btn inspect" onClick={() => openInspectionDrawer(idea)}>
                    <FaEye /> Inspect File
                  </button>
                  {idea.originalFileName && (
                    <button className="cta-action-btn download" onClick={() => handleDownloadFile(idea.id, idea.originalFileName)}>
                      <FaDownload /> Document
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sliding Inspection Drawer Component Panel */}
      <div className={`inspection-slide-drawer ${isDrawerOpen ? 'active' : ''}`}>
        <div className="drawer-overlay" onClick={closeInspectionDrawer}></div>
        <div className="drawer-content-box">
          <div className="drawer-header">
            <h3>Protocol Verification Hub</h3>
            <button className="close-drawer-icon-btn" onClick={closeInspectionDrawer}><FaTimes /></button>
          </div>

          {selectedIdea && (
            <div className="drawer-body-stream">
              <div className="drawer-data-card-info">
                <label>Invention Title</label>
                <h4>{selectedIdea.title}</h4>
              </div>

              <div className="drawer-data-card-info">
                <label>Technical System Specification</label>
                <p className="drawer-scrollable-description">{selectedIdea.description}</p>
              </div>

              {/* Advanced Timeline Verification Pipeline */}
              <div className="drawer-workflow-timeline">
                <label>Review Pipeline Tracking</label>
                <div className="timeline-pipeline-wrapper">
                  <div className="timeline-node complete">
                    <div className="node-marker"><FaCheck /></div>
                    <div className="node-label-box">
                      <h5>Protocol Registered</h5>
                      <span>Successfully mapped in backend repository</span>
                    </div>
                  </div>

                  <div className={`timeline-node ${selectedIdea.status === 'PENDING' ? 'active' : 'complete'}`}>
                    <div className="node-marker">
                      {selectedIdea.status === 'PENDING' ? <FaHourglassHalf className="spinning-ui" /> : <FaCheck />}
                    </div>
                    <div className="node-label-box">
                      <h5>Committee Review Processing</h5>
                      <span>Assigned to {selectedIdea.assignedCommittee?.name || 'Academic Faculty Council'}</span>
                    </div>
                  </div>

                  <div className={`timeline-node ${selectedIdea.status === 'APPROVED' ? 'complete' : selectedIdea.status === 'REJECTED' ? 'failed' : 'locked'}`}>
                    <div className="node-marker">
                      {selectedIdea.status === 'APPROVED' ? <FaCheck /> : selectedIdea.status === 'REJECTED' ? <FaTimes /> : <FaHourglassHalf />}
                    </div>
                    <div className="node-label-box">
                      <h5>Board Arbitration Evaluation</h5>
                      <span>Final determination status verification verdict</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Committee Scoring & Remarks Block */}
              <div className="drawer-feedback-terminal-box">
                <label>Faculty Committee Review Summary</label>
                {selectedIdea.reviewerFeedback ? (
                  <div className="feedback-statement-bubble present">
                    <FaExclamationCircle className="feedback-status-info-icon" />
                    <p>"{selectedIdea.reviewerFeedback}"</p>
                  </div>
                ) : (
                  <div className="feedback-statement-bubble empty">
                    <p>No active assessment or modifications logs appended yet by the review board.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIdeas;