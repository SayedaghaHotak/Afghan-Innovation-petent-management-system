// src/pages/SubmitIdea.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaHeading, FaTags, FaAlignLeft, FaFileInvoice, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import './SubmitIdea.css'; 

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    description: '',
    summary: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('summary', formData.summary);
      if (file) {
        data.append('document', file);
      }

      await axios.post('http://localhost:8081/api/v1.0/patents/submit/${id}', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ 
        type: 'success', 
        text: 'Innovation registered successfully! Sent to PENDING queue.' 
      });
      setFormData({ title: '', category: 'Technology', description: '', summary: '' });
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: 'Submission failed. Server connection error.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-idea-container">
      <div className="form-header-card">
        <h2>Submit New Patent / Innovation</h2>
        <p>Follow the structured sections below to register your scientific design or research data into AIMS.</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.type === 'success' && <FaCheckCircle style={{ marginRight: '8px' }} />}
          {message.text}
        </div>
      )}

      <form className="modern-idea-form" onSubmit={handleSubmit}>
        
        {/* SECTION 1: General Info */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">01</span>
            <h3>Primary Information</h3>
          </div>
          
          <div className="form-grid-two-cols">
            <div className="modern-form-group">
              <label>Patent Title</label>
              <div className="input-with-icon">
                <FaHeading className="input-icon" />
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Autonomous Drone Navigation System"
                />
              </div>
            </div>

            <div className="modern-form-group">
              <label>Scientific Category</label>
              <div className="input-with-icon">
                <FaTags className="input-icon" />
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="Technology">Technology & Engineering</option>
                  <option value="Medical">Medical & Health</option>
                  <option value="Agriculture">Agriculture & Environment</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="AI & Software">AI & Software Systems</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Conceptual Details */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">02</span>
            <h3>Conceptual Specification</h3>
          </div>

          <div className="modern-form-group">
            <label>Brief Summary (Core Purpose)</label>
            <div className="input-with-icon">
              <FaAlignLeft className="input-icon" />
              <input 
                type="text" 
                name="summary" 
                value={formData.summary} 
                onChange={handleInputChange} 
                required 
                placeholder="Summarize the primary breakthrough or solution in one or two clear sentences..."
              />
            </div>
          </div>

          <div className="modern-form-group">
            <label>Full Methodology & Technical Description</label>
            <div className="textarea-with-icon">
              <FaFileInvoice className="input-icon textarea-icon" />
              <textarea 
                name="description" 
                rows="5" 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
                placeholder="Elaborate on architectural designs, experimental parameters, algorithms used, and industrial utility..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Documentation Upload */}
        <div className="form-section-card">
          <div className="section-title">
            <span className="section-number">03</span>
            <h3>Supporting Documentation</h3>
          </div>

          <div className="modern-form-group">
            <label>Proposal Document / Blueprint (Optional)</label>
            <div className="modern-upload-dropzone">
              <input 
                type="file" 
                id="file-upload-input"
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.png,.jpg"
              />
              <label htmlFor="file-upload-input" className="dropzone-label">
                <FaCloudUploadAlt className="upload-cloud-icon" />
                <span className="upload-main-text">
                  {file ? `Selected: ${file.name}` : 'Click to browse or drop your research file here'}
                </span>
                <span className="upload-sub-text">Supported extensions: PDF, DOCX, PNG, JPG</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="form-actions">
          <button type="submit" className="modern-submit-btn" disabled={loading}>
            {loading ? 'Processing Protocol...' : 'Register and Submit Protocol'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SubmitIdea;