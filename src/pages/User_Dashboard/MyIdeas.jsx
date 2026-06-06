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
  // 🛰️ بخش بک‌اِند اصلی (فعلاً کامنت شده است)
  // ==========================================
  /*
  const fetchMyIdeas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Matched with your exact base endpoint @GetMapping in PatentController
      const response = await axios.get('http://localhost:8081/api/v1.0/patents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdeas(response.data);
    } catch (err) {
      console.error("Error connecting to iapms database:", err);
      setError('System could not establish handshake with server repository.');
    } finally {
      setLoading(false);
    }
  };
  */

  // ==========================================
  // 🧪 بخش دیتای موک (۱۰ ایده برای تست فرانت‌اِند)
  // ==========================================
  const fetchMyIdeas = () => {
    setLoading(true);
    try {
      const mockIdeas = [
        {
          id: 101,
          title: "AI-Powered Medical Diagnosis System",
          description: "An advanced machine learning framework capable of analyzing radiological scans to detect early-stage thoracic anomalies with high accuracy.",
          status: "APPROVED",
          category: "HealthTech",
          createdAt: "2026-01-15T10:00:00Z",
          originalFileName: "medical_diagnosis_v1.pdf",
          reviewerFeedback: "Excellent structural design. The core algorithm demonstrates great synchronization with standard clinical matrices.",
          assignedCommittee: { name: "Biomedical Engineering Council" }
        },
        {
          id: 102,
          title: "Decentralized Smart Grid Protocol",
          description: "A secure blockchain ledger implementation tailored for energy distribution architectures, allowing peer-to-peer micro-transactions between solar grids.",
          status: "PENDING",
          category: "Energy / IoT",
          createdAt: "2026-02-02T14:30:00Z",
          originalFileName: "smart_grid_draft.pdf",
          reviewerFeedback: null,
          assignedCommittee: { name: "Electrical Faculty Review Board" }
        },
        {
          id: 103,
          title: "Autonomous Agricultural Drone Mesh",
          description: "A centralized control algorithm written to govern a swarm of ultra-lightweight drones for real-time moisture logging and automated crop spraying.",
          status: "REJECTED",
          category: "Robotics",
          createdAt: "2026-02-20T09:15:00Z",
          originalFileName: "agri_drone_specs.docx",
          reviewerFeedback: "The battery consumption vectors under extreme wind simulation need immediate modification. Re-submit after fixing.",
          assignedCommittee: { name: "Mechatronics Faculty Council" }
        },
        {
          id: 104,
          title: "Quantum Cryptography Handshake Protocol",
          description: "An enterprise-grade encryption mechanism designed to safely establish web handshake tunnels immune to quantum computing brute-force tactics.",
          status: "APPROVED",
          category: "Cybersecurity",
          createdAt: "2026-03-01T11:00:00Z",
          originalFileName: "quantum_crypto_core.pdf",
          reviewerFeedback: "Approved for full registration. Meets all criteria for next-gen network defenses.",
          assignedCommittee: { name: "Computer Science Arbitration Hub" }
        },
        {
          id: 105,
          title: "Water Filtration Via Nano-Carbon Mesh",
          description: "A novel biochemical filtering process using customized carbon nanotube arrangements to extract heavy metals from industrial wastewater streams.",
          status: "PENDING",
          category: "Chemical Tech",
          createdAt: "2026-03-12T16:45:00Z",
          originalFileName: "nano_filtration_v2.pdf",
          reviewerFeedback: null,
          assignedCommittee: { name: "Environmental Faculty Assembly" }
        },
        {
          id: 106,
          title: "E-Learning Adaptive Knowledge Graphs",
          description: "An educational data platform mapping student behavioral feedback loops to generate real-time dynamic training paths automatically.",
          status: "PENDING",
          category: "EdTech",
          createdAt: "2026-03-29T13:20:00Z",
          originalFileName: null, // تستی بدون سند چسبیده
          reviewerFeedback: null,
          assignedCommittee: { name: "Academic Curricula Committee" }
        },
        {
          id: 107,
          title: "Next-Gen Solid State Battery Alloy",
          description: "A experimental lithium-sulfur chemical configuration targeting 3x energy density ratios compared to consumer-grade cells.",
          status: "APPROVED",
          category: "Materials Science",
          createdAt: "2026-04-05T08:00:00Z",
          originalFileName: "battery_alloy_matrix.pdf",
          reviewerFeedback: "The chemical stabilization charts are highly impressive. Registered successfully.",
          assignedCommittee: { name: "Metallurgy Research Department" }
        },
        {
          id: 108,
          title: "Urban Traffic Optimization via Edge Computing",
          description: "A network architecture placing machine vision models at physical intersections to dynamic-route city emergency vehicles.",
          status: "REJECTED",
          category: "Smart City",
          createdAt: "2026-04-18T17:10:00Z",
          originalFileName: "traffic_edge_network.pdf",
          reviewerFeedback: "Handover delay thresholds under peak network strain exceed safe system requirements. Please refine.",
          assignedCommittee: { name: "Information Technology Council" }
        },
        {
          id: 109,
          title: "Voice-Assisted Offline Operating System Shell",
          description: "A lightweight voice recognition engine operating totally without external cloud microservices, intended for critical accessibility hardware.",
          status: "PENDING",
          category: "Software Architecture",
          createdAt: "2026-05-01T12:00:00Z",
          originalFileName: "voice_shell_proposal.pdf",
          reviewerFeedback: null,
          assignedCommittee: null // تست لود به عنوان Academic Faculty Council پیشفرض
        },
        {
          id: 110,
          title: "Biometric Wallet with Thermal Sensors",
          description: "A cold-storage hardware crypto wallet adding dynamic body temperature verification to block bypass vectors using duplicated physical casts.",
          status: "APPROVED",
          category: "Hardware / FinTech",
          createdAt: "2026-05-10T10:25:00Z",
          originalFileName: "biometric_wallet_final.pdf",
          reviewerFeedback: "Highly creative security integration. The verification blueprint is flawless.",
          assignedCommittee: { name: "Hardware Systems Review Panel" }
        }
      ];
      setIdeas(mockIdeas);
      setError('');
    } catch (err) {
      setError('Failed to inject mock data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIdeas();
  }, []);

  // Compute stats locally via Java-safe variables
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

  const handleDownloadFile = (id) => {
    // Points directly to viewFile method mapping inside PatentController.java
    window.open(`http://localhost:8081/api/v1.0/patents/view/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="my-ideas-container">
        <div className="system-loading">Compiling innovation log vectors...</div>
      </div>
    );
  }

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
                    <button className="cta-action-btn download" onClick={() => handleDownloadFile(idea.id)}>
                      <FaDownload /> Document
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sliding Inspection Drawer Component Panel */}
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