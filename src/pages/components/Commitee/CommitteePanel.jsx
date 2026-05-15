import React, { useRef } from 'react';
import { FaUserCircle, FaEllipsisV, FaUserPlus, FaEdit, FaCrown, FaCamera } from 'react-icons/fa';

const CommitteePanel = ({ committee, onEdit, onAdd, onImageChange, onRemoveMember }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="details-panel-inner">
      <div className="panel-fixed-header">
        <div className="profile-image-container" onClick={() => fileInputRef.current.click()}>
          {committee.image ? (
            <img src={committee.image} alt="Committee" className="profile-avatar-img" />
          ) : (
            <FaUserCircle className="profile-avatar-icon" />
          )}
        
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
        </div>
        <h3 className="panel-committee-name">{committee.name}</h3>
        <p className="panel-committee-desc">{committee.type} Committee</p>
        {/* committee description */}
        <p className='panel-description-text' >{committee.description || "no committee description provided."}</p>
      </div>

      <div className="panel-scrollable-area">
        <span className="section-label">Chairperson</span>
        <div className="member-row chairperson">
           <div className="member-meta">
              <FaCrown className="role-icon-crown"/>
              <span>{committee.chair}</span>
           </div>
        </div>

        <span className="section-label">Members List</span>
        <div className="internal-members-list">
          {Array.isArray(committee.members) && committee.members.map(member => (
            <div key={member.id} className="member-row">
              <div className="member-meta">
                <div className="member-avatar-sm">{member.name?.charAt(0) || 'U'}</div>
                <span>{member.name}</span>
              </div>
              <div className="member-options">
                <button
                 className="dot-menu-btn" onClick={() => onRemoveMember(committee.id, member.id)}>
                  <FaEllipsisV />
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-footer-btns">
        <button className="btn-footer add-member-btn" onClick={onAdd}><FaUserPlus /> Add Member</button>
        <button className="btn-footer edit-committee-btn" onClick={onEdit}><FaEdit /> Edit</button>
      </div>
    </div>
  );
};

export default CommitteePanel;