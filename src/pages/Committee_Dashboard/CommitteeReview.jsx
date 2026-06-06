import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button'; 
import { FaDownload, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import './CommitteeReview.css';

const CommitteeReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [patent, setPatent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Evaluation Fields State
  const [scoreInnovation, setScoreInnovation] = useState('');
  const [scoreFeasibility, setScoreFeasibility] = useState('');
  const [scoreTechnical, setScoreTechnical] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    const fetchPatentDetails = async () => {
      try {
        setLoading(true);
        
        // 🚀 LIVE BACKEND CONNECTION
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/api/v1.0/patents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPatent(response.data);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching patent:", err);
        
        // 🛑 FALLBACK MOCK DATA FOR PRE-DEFENSE DEMO
        setPatent({
          id: id,
          title: "Smart Irrigation System",
          innovetor: "Ahmad Wali",
          category: "Agricultural Technology",
          submissionDate: "2026-06-01",
          abstract: "This project presents an end-to-end automated system for monitoring and controlling greenhouse environments using specialized soil moisture and temperature sensors. It aims to optimize crop yields with minimal human intervention.",
          fileName: "proposal_document.pdf"
        });
        setLoading(false);
      }
    };
    fetchPatentDetails();
  }, [id]);

  // 📥 Secure Binary Download via Blob API
  const handleDownloadFile = async (e) => {
    e.preventDefault();
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:8081/api/v1.0/patents/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', patent?.fileName || `proposal_${id}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setDownloading(false);

    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not download the file from backend server.");
      setDownloading(false);
    }
  };

  // 🚀 Submit Scores + Verdict (Approve or Reject) to Backend
  const handleFinalVerdict = async (verdictStatus) => {
    // Validation
    if (!scoreInnovation || !scoreFeasibility || !scoreTechnical || !comments) {
      alert("Please fill out all scores and comments before making a decision.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        patentId: id,
        status: verdictStatus, // 'APPROVED' or 'REJECTED'
        innovationScore: Number(scoreInnovation),
        feasibilityScore: Number(scoreFeasibility),
        technicalScore: Number(scoreTechnical),
        feedback: comments
      };

      console.log("Submitting Evaluation and Verdict to Backend:", payload);

      // Connect to Farid's endpoint
      await axios.post('http://localhost:8081/api/v1.0/patents/evaluate-and-settle', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Innovation evaluation submitted and successfully ${verdictStatus.toLowerCase()}!`);
      setSubmitting(false);
      navigate('/committee_dashboard/assigned'); 

    } catch (err) {
      console.error("Status update failed:", err);
      // Fallback for Demo if API isn't ready
      alert(`Demo Mode: Review submitted and innovation ${verdictStatus.toLowerCase()} successfully!`);
      setSubmitting(false);
      navigate('/committee_dashboard/assigned');
    }
  };

  if (loading) return <div className="loading-spinner">Loading Innovation Specifications...</div>;

  return (
    <div className="committee-review-viewport">
      
      {/* Header Section */}
      <div className="review-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Expert Review & Verdict Panel</h2>
          <p>Examine the technical proposal, provide evaluation scoring, and issue the final decision.</p>
        </div>
        <Button className="back-btn" onClick={() => navigate('/committee_dashboard/assigned')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FaArrowLeft fontSize={11} /> Back to List
        </Button>
      </div>

      {/* Split Layout */}
      <div className="review-split-layout">
        
        {/* Left Column: Patent Specifications (Read Only) */}
        <div className="patent-info-card">
          <h3>Innovation Specifications</h3>
          
          <div className="info-group">
            <label>Innovation Title</label>
            <p><strong>{patent?.title}</strong></p>
          </div>
          
          <div className="info-group">
            <label>Innovator</label>
            <p>{patent?.innovetor || patent?.innovator}</p>
          </div>

          <div className="info-group">
            <label>Category</label>
            <p>{patent?.category || "General Tech"}</p>
          </div>

          <div className="info-group">
            <label>Submission Date</label>
            <p>{patent?.submissionDate}</p>
          </div>

          <div className="info-group">
            <label>Abstract / Summary</label>
            <p className="abstract-text">{patent?.abstract}</p>
          </div>
          
          {/* Dynamic Download Link */}
          <div className="info-group">
            <label>Proposal Document</label>
            <a 
              href="#download" 
              className="download-proposal-link" 
              onClick={handleDownloadFile}
              style={{ pointerEvents: downloading ? 'none' : 'auto', opacity: downloading ? 0.6 : 1 }}
            >
              <FaDownload /> {downloading ? "Downloading Document..." : "Download Proposal PDF"}
            </a>
          </div>
        </div>

        {/* Right Column: Evaluation Form + Verdict Buttons Combined */}
        <div className="evaluation-form-card">
          <h3>Evaluation Form & Official Verdict</h3>
          
          {/* Scoring Fields */}
          <div className="scoring-grid">
            <div className="score-field">
              <label>Innovation Score (1-10)</label>
              <input 
                type="number" min="1" max="10" placeholder="e.g. 8"
                value={scoreInnovation} onChange={(e) => setScoreInnovation(e.target.value)}
              />
            </div>

            <div className="score-field">
              <label>Feasibility Score (1-10)</label>
              <input 
                type="number" min="1" max="10" placeholder="e.g. 7"
                value={scoreFeasibility} onChange={(e) => setScoreFeasibility(e.target.value)}
              />
            </div>

            <div className="score-field">
              <label>Technical Quality (1-10)</label>
              <input 
                type="number" min="1" max="10" placeholder="e.g. 9"
                value={scoreTechnical} onChange={(e) => setScoreTechnical(e.target.value)}
              />
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="feedback-textarea-field">
            <label>Professional Evaluation Comments</label>
            <textarea 
              placeholder="Write your official constructive critique and remarks regarding this project proposal here..."
              value={comments} onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0', textAlign: 'center' }}>
            *Submitting a verdict will lock this evaluation form and instantly notify the innovator.
          </p>

          {/* Action Decision Buttons */}
          <div className="verdict-buttons-container">
            <button 
              className="btn-action btn-approve" 
              onClick={() => handleFinalVerdict('APPROVED')}
              disabled={submitting}
            >
              <FaCheck /> Approve
            </button>

            <button 
              className="btn-action btn-reject" 
              onClick={() => handleFinalVerdict('REJECTED')}
              disabled={submitting}
            >
              <FaTimes /> Reject
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommitteeReview;