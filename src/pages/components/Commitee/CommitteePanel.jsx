import React, { useRef } from 'react';
import { FaUserCircle, FaEllipsisV, FaUserPlus, FaEdit, FaCrown, FaTrash } from 'react-icons/fa';

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
        {/* توضیحات کمیته */}
        <p className='panel-description-text'>{committee.description || "توضیحات برای این کمیته ثبت نشده است."}</p>
      </div>

      <div className="panel-scrollable-area">
        <span className="section-label">Chairperson (Lead)</span>
        <div className="member-row chairperson">
           <div className="member-meta">
              <FaCrown className="role-icon-crown" style={{ color: '#ffb300', marginRight: '8px' }}/>
              {/* نمایش نام ادمین فعلی */}
              <span style={{ fontWeight: 'bold' }}>{committee.chair || "تعیین نشده"}</span>
           </div>
        </div>

        <span className="section-label">Members List ({committee.members?.length || 0})</span>
        <div className="internal-members-list">
          {Array.isArray(committee.members) && committee.members.map(member => {
            // 🔥 حل مشکل اصلی: اگر بک‌اِند firstName بفرستد یا name، در هر دو حالت نام را درست ترکیب میکند
            const memberDisplayName = member.name 
              ? member.name 
              : `${member.firstName || ''} ${member.lastName || ''}`.trim() || "کاربر بدون نام";

            return (
              <div key={member.id} className="member-row">
                <div className="member-meta">
                  {/* حرف اول نام برای آواتار */}
                  <div className="member-avatar-sm">
                    {memberDisplayName.charAt(0).toUpperCase()}
                  </div>
                  <span>{memberDisplayName}</span>
                </div>
                <div className="member-options">
                  {/* 🗑️ دکمه حذف ممبر که حالا با کلیک مستقیماً اندپوینت بک‌اِند را صدا می‌زند */}
                  <button
                    className="dot-menu-btn" 
                    onClick={() => onRemoveMember(committee.id, member.id)}
                    title="Remove Member"
                    style={{ color: '#ff4d4d' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}

          {(!committee.members || committee.members.length === 0) && (
            <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '10px' }}>
              هیچ عضوی در این کمیته وجود ندارد.
            </p>
          )}
        </div>
      </div>

      <div className="panel-footer-btns">
        <button className="btn-footer add-member-btn" onClick={onAdd}>
          <FaUserPlus /> Add Member
        </button>
        <button className="btn-footer edit-committee-btn" onClick={onEdit}>
          <FaEdit /> Edit Lead
        </button>
      </div>
    </div>
  );
};

export default CommitteePanel;