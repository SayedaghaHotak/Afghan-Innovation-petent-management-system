import React, { useState } from 'react';
import { 
  FaSearch, FaEye, FaTrashAlt, FaCalendarAlt, FaUser, 
  FaLightbulb, FaFilePdf, FaLink, FaArrowLeft, FaIdBadge, FaCheckDouble, FaFilter 
} from 'react-icons/fa';
import { mockInnovations } from '../../data/mockUsers'; 
import './AllInnovation.css';

const AllInnovations = () => {
  // تغییر وضعیت اولیه دیتا به Pending برای تست اگر در موک دیتا وجود ندارد
  const InitialData = mockInnovations.map(item => ({
    ...item,
    status: item.status === 'Assigned' ? 'Approved' : (item.status === 'Unassigned' ? 'Pending' : item.status)
  }));

  const [innovations, setInnovations] = useState(InitialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [selectedIdea, setSelectedIdea] = useState(null);

  const updateStatus = (id, newStatus) => {
    setInnovations(innovations.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    setSelectedIdea(null); 
  };

  const deleteInnovation = (id) => {
    if(window.confirm("Are you sure?")) {
      setInnovations(innovations.filter(item => item.id !== id));
    }
  };

  const filteredData = innovations.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="full-page-container">
      <div className="sticky-header">
        <div className="header-content">
          <div className="brand-section">
            <h2>Innovations Management</h2>
          </div>
          <div className="header-controls">
            <div className="filter-wrapper">
              <FaFilter className="filter-icon" />
              <select 
                className="status-select-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search ideas..." 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-fixed-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Innovation Name</th>
              <th>Innovator</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="table-row">
                <td>#{item.id}</td>
                <td className="text-bold">{item.title}</td>
                <td><FaUser className="small-icon" /> {item.author}</td>
                <td><FaCalendarAlt className="small-icon" /> {item.date}</td>
                <td>
                  <span className={`status-tag ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="view-btn" onClick={() => setSelectedIdea(item)}><FaEye /> View</button>
                  <button className="delete-btn" onClick={() => deleteInnovation(item.id)}><FaTrashAlt /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIdea && (
        <div className="full-detail-overlay">
          <div className="detail-panel">
            <div className="detail-header">
              <button className="back-btn" onClick={() => setSelectedIdea(null)}>
                <FaArrowLeft /> Back to List
              </button>
              <div className="header-actions">
                <button className="action-approve" onClick={() => updateStatus(selectedIdea.id, 'Approved')}>Approve Idea</button>
                <button className="action-reject" onClick={() => updateStatus(selectedIdea.id, 'Rejected')}>Reject Idea</button>
              </div>
            </div>
            <div className="detail-content">
              <div className="detail-sidebar">
                <div className="info-card">
                  <FaIdBadge className="card-icon" />
                  <h4>Submitter Info</h4>
                  <div className="info-item"><span>Name:</span> {selectedIdea.author}</div>
                  <div className="info-item"><span>Date:</span> {selectedIdea.date}</div>
                  <div className="info-item">
                    <span>Status:</span> 
                    <span className={`status-tag ${selectedIdea.status.toLowerCase()}`}>{selectedIdea.status}</span>
                  </div>
                </div>
                <div className="info-card">
                  <FaCheckDouble className="card-icon" />
                  <h4>Committee</h4>
                  <p>{selectedIdea.committeeName || 'Under Review'}</p>
                </div>
              </div>
              <div className="detail-main-info">
                <h1 className="detail-title">{selectedIdea.title}</h1>
                <div className="abstract-box">
                  <h3><FaLightbulb /> Project Abstract</h3>
                  <p>{selectedIdea.description || "No description provided for this innovation."}</p>
                </div>
                <div className="resource-section">
                  <h3>Resources & Documents</h3>
                  <div className="resource-grid">
                    <div className="resource-item">
                      <FaFilePdf className="pdf-icon" />
                      <div className="res-info"><span>Proposal_V1.pdf</span><small>2.4 MB</small></div>
                      <button className="download-btn">View</button>
                    </div>
                    <div className="resource-item">
                      <FaLink className="link-icon" />
                      <div className="res-info"><span>External Repo</span><small>Link</small></div>
                      <button className="download-btn">Open</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllInnovations;