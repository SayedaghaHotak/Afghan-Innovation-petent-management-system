import React, { useState } from 'react';
import { FaTimes, FaPlusCircle } from 'react-icons/fa';
import './CreateCommitteeModal.css';

const CreateCommitteeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Committee Name is required");
    
    // Send data to parent
    onSave(formData); 
    
    // Reset form for next time
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="cm-modal-overlay">
      <div className="cm-modal-content create-committee-card">
        <div className="modal-header">
          <div className="header-title">
            <FaPlusCircle className="header-icon" />
            <h3>Create New Committee</h3>
          </div>
          <button className="close-icon" onClick={onClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group-admin">
            <label>Committee Name</label>
            <input 
              type="text" 
              placeholder="enter Committee Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group-admin">
            <label>Description</label>
            <textarea 
              placeholder="Describe the purpose and goals..."
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-btn">Create Committee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommitteeModal;