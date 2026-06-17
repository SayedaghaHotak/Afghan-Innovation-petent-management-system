// src/pages/SubmitIdea.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaHeading, 
  FaTags, 
  FaFileInvoice, 
  FaCloudUploadAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaInfoCircle,
  FaImage,
  FaVideo
} from 'react-icons/fa';
import './SubmitIdea.css'; 

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    committeeId: '', 
    description: ''
  });

  const [committees, setCommittees] = useState([]); 
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [plagiarismDetails, setPlagiarismDetails] = useState(null);

  // Fetch committees from API Gateway pipeline (port 8080)
  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const cleanToken = token ? token.replace(/^["']|["']$/g, '').trim() : '';
        
        const response = await axios.get('http://localhost:8081/api/v1.0/committees', {
          headers: { Authorization: `Bearer ${cleanToken}` }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setCommittees(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, committeeId: response.data[0].id }));
          }
        }
      } catch (err) {
        console.error("Error fetching committees:", err);
        setMessage({ type: 'error', text: 'خطا در بارگذاری لیست کمیته‌ها از سرور.' });
      }
    };

    fetchCommittees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleVideosChange = (e) => {
    if (e.target.files) {
      setVideos(Array.from(e.target.files));
    }
  };

  const parsePlagiarismMessage = (errorText) => {
    try {
      const percentageMatch = errorText.match(/matches\s+(\d+)%/);
      const idMatch = errorText.match(/Patent ID:\s+(\d+)/);
      const fieldMatch = errorText.match(/isolated\s+([\w\s()]+?)\s+matches/);

      return {
        field: fieldMatch ? fieldMatch[1] : 'Document Attribute',
        percentage: percentageMatch ? percentageMatch[1] : '95+',
        matchedId: idMatch ? idMatch[1] : 'Unknown'
      };
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.committeeId) {
      alert("Please select a valid destination scientific committee.");
      return;
    }
    if (!file) {
      alert("Please attach your comprehensive proposal document blueprint.");
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setPlagiarismDetails(null);

    try {
      const token = sessionStorage.getItem('token');
      const cleanToken = token ? token.replace(/^["']|["']$/g, '').trim() : '';
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('file', file); 

      // Append multi-part image lists mapping
      images.forEach((imgFile) => {
        data.append('images', imgFile);
      });

      // Append multi-part video lists mapping
      videos.forEach((vidFile) => {
        data.append('videos', vidFile);
      });

      // Transmit securely straight to backend route configuration (port 8081)
      await axios.post(`http://localhost:8081/api/v1.0/patents/submit/${formData.committeeId}`, data, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        type: 'success', 
        text: 'Innovation protocol registered successfully! Sent to secure PENDING review queue.' 
      });
      
      // Clear form inputs cleanly
      setFormData({ 
        title: '', 
        committeeId: committees.length > 0 ? committees[0].id : '', 
        description: '' 
      });
      setFile(null);
      setImages([]);
      setVideos([]);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error("Submission Error Status:", err.response);
      const errorData = err.response?.data || '';
      
      if (err.response?.status === 409 || (typeof errorData === 'string' && errorData.includes("Plagiarism Detected"))) {
        const details = parsePlagiarismMessage(errorData);
        setPlagiarismDetails(details);
        setMessage({
          type: 'error',
          text: 'Security Violation: Plagiarism verification system rejected this registration protocol.'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: typeof errorData === 'string' ? errorData : 'Submission rejected. Please verify server state contexts.' 
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-idea-container">
      <div className="form-header-card">
        <h2>Submit New Patent / Innovation Protocols</h2>
        <p>AIPMS runs automated multi-modal anti-plagiarism verification across current databases prior to cataloging records.</p>
      </div>

      {message.text && !plagiarismDetails && (
        <div className={`alert-banner ${message.type === 'success' ? 'banner-success' : 'banner-error'}`}>
          {message.type === 'success' ? <FaCheckCircle className="banner-icon" /> : <FaExclamationTriangle className="banner-icon" />}
          <span className="banner-text">{message.text}</span>
        </div>
      )}

      {plagiarismDetails && (
        <div className="plagiarism-report-card">
          <div className="report-header">
            <div className="report-title-wrapper">
              <FaShieldAlt className="shield-critical-icon" />
              <h3>Cross-Modal Verification Failure</h3>
            </div>
            <span className="violation-badge">Overlap Alert</span>
          </div>
          
          <div className="report-body">
            <p className="report-description">
              Our semantic vector analysis engines mapped overlapping matches with high structural similarities against an existing catalog item.
            </p>

            <div className="metrics-dashboard-strip">
              <div className="metric-box">
                <span className="metric-label">Violating Boundary</span>
                <span className="metric-value">{plagiarismDetails.field}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Matching Identity</span>
                <span className="metric-value-id">Patent ID: #{plagiarismDetails.matchedId}</span>
              </div>
            </div>

            <div className="similarity-progress-wrapper">
              <div className="progress-labels">
                <span className="progress-title">Calculated Similarity Score</span>
                <span className="progress-pct-value text-danger">{plagiarismDetails.percentage}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill-danger" 
                  style={{ width: `${plagiarismDetails.percentage}%` }}
                ></div>
              </div>
              <p className="progress-threshold-caption">
                <FaInfoCircle /> System cut-off allowance parameters are capped strictly below 95.0% compliance margins.
              </p>
            </div>
          </div>

          <div className="report-footer">
            <h5>Corrective Action Required:</h5>
            <ul>
              <li>Please restructure or rephrase the wording across the specified <strong>{plagiarismDetails.field}</strong>.</li>
              <li>Ensure your conceptual designs, equations, and references contain proper documentation attribution metrics.</li>
            </ul>
          </div>
        </div>
      )}

      <form className="modern-idea-form" onSubmit={handleSubmit}>
        
        {/* SECTION 1: Identity & Target Routings */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">01</span>
            <h3>Primary Parameters</h3>
          </div>
          
          <div className="form-grid-two-cols">
            <div className="modern-form-group">
              <label>Patent Official Title</label>
              <div className="input-with-icon">
                <FaHeading className="input-icon" />
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Cross-Modal Vector Registration Interface"
                />
              </div>
            </div>

            <div className="modern-form-group">
              <label>Target Evaluating Scientific Committee</label>
              <div className="input-with-icon">
                <FaTags className="input-icon" />
                <select 
                  name="committeeId" 
                  value={formData.committeeId} 
                  onChange={handleInputChange}
                  required
                >
                  {committees.length === 0 ? (
                    <option value="">Loading Active Pipelines...</option>
                  ) : (
                    committees.map(comm => (
                      <option key={comm.id} value={comm.id}>
                        {comm.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Conceptual Breakdown */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">02</span>
            <h3>Conceptual Specification</h3>
          </div>

          <div className="modern-form-group">
            <label>Comprehensive Technical Methodology</label>
            <div className="textarea-with-icon">
              <FaFileInvoice className="input-icon textarea-icon" />
              <textarea 
                name="description" 
                rows="6" 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
                placeholder="Elaborate on architectural parameters, algorithm flowcards, structural designs, and real-world industrial utility..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Binary Blueprints Attachments */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">03</span>
            <h3>Supporting Documentation Blueprints</h3>
          </div>

          <div className="form-grid-two-cols">
            {/* Main Proposal File */}
            <div className="modern-form-group">
              <label>Primary Document Blueprint (Required .pdf / .docx)</label>
              <div className="modern-upload-dropzone">
                <input 
                  type="file" 
                  id="file-upload-input"
                  onChange={handleFileChange} 
                  accept=".pdf,.docx"
                  required
                />
                <label htmlFor="file-upload-input" className="dropzone-label">
                  <FaCloudUploadAlt className="upload-cloud-icon" />
                  <span className="upload-main-text">
                    {file ? file.name : 'Select research proposal file'}
                  </span>
                  <span className="upload-sub-text">Max size: 5MB</span>
                </label>
              </div>
            </div>

            {/* Optional Image Uploads */}
            <div className="modern-form-group">
              <label>Supporting Graphics (.jpg / .jpeg / .png)</label>
              <div className="modern-upload-dropzone">
                <input 
                  type="file" 
                  id="image-upload-input"
                  onChange={handleImagesChange} 
                  accept="image/jpeg, image/png"
                  multiple
                />
                <label htmlFor="image-upload-input" className="dropzone-label">
                  <FaImage className="upload-cloud-icon" />
                  <span className="upload-main-text">
                    {images.length > 0 ? `${images.length} images staged` : 'Select innovative diagrams'}
                  </span>
                  <span className="upload-sub-text">Max size per file: 5MB</span>
                </label>
              </div>
              {images.length > 0 && (
                <div className="media-badge-container">
                  {images.map((img, i) => (
                    <span key={i} className="media-badge">{img.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Optional Video Uploads */}
          <div className="modern-form-group" style={{ marginTop: '10px' }}>
            <label>Demonstration Videos (.mp4 / .avi / .mkv)</label>
            <div className="modern-upload-dropzone">
              <input 
                type="file" 
                id="video-upload-input"
                onChange={handleVideosChange} 
                accept="video/mp4, video/x-msvideo, video/x-matroska"
                multiple
              />
              <label htmlFor="video-upload-input" className="dropzone-label">
                <FaVideo className="upload-cloud-icon" />
                <span className="upload-main-text">
                  {videos.length > 0 ? `${videos.length} videos staged` : 'Select dynamic operational videos'}
                </span>
                <span className="upload-sub-text">Max size per file: 8MB</span>
              </label>
            </div>
            {videos.length > 0 && (
              <div className="media-badge-container">
                {videos.map((vid, i) => (
                  <span key={i} className="media-badge">{vid.name}</span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Submission Execution */}
        <div className="form-actions">
          <button type="submit" className="modern-submit-btn" disabled={loading}>
            {loading ? 'Evaluating Security Clearances...' : 'Register and Submit Protocol'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SubmitIdea;