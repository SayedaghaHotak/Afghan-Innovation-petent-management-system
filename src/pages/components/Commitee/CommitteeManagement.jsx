// src/pages/CommitteeManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../StatCard'; 
import { FaSitemap, FaUserCheck, FaClipboardCheck, FaRegLightbulb, FaTimes } from 'react-icons/fa';
import CommitteeTable from './CommiteeTable';
import CommitteePanel from './CommitteePanel';
import './Commitee.css';
import CreateCommitteeModal from '../NewCommittee/CreateCommitteeModal';

const CommitteeManagement = () => {
  const [committees, setCommittees] = useState([]);
  const [realUsers, setRealUsers] = useState([]); // لیست کل کاربران سیستم برای مودال افزودن عضو
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ⚡ متد کمکی برای نرمال‌سازی دیتای دریافتی از سرور جهت رندر بی‌نقص کامپوننت‌ها
  const processCommitteeData = (data, allCommitteesList) => {
    return data.map(c => {
      const leadName = c.committeeAdmin 
        ? `${c.committeeAdmin.firstName || ''} ${c.committeeAdmin.lastName || ''}`.trim()
        : "تعیین نشده";

      return {
        ...c,
        chair: leadName || "تعیین نشده", 
        type: "Technical", 
        subCategory: c.description || "توضیحات ندارد",
        members: c.members || []
      };
    });
  };

  // ⚡ ۱. متد لود دیتای پیش‌فرض سیستم (لود اولیه تمام کمیته‌ها)
  const fetchAllCommittees = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/v1.0/committees', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && Array.isArray(response.data)) {
        const processedData = processCommitteeData(response.data);
        setCommittees(processedData);
        syncSelectedCommittee(processedData);
      }
    } catch (err) {
      console.error("Error fetching all committees:", err);
    }
  };

  // ⚡ متد فرعی جدید: متصل به اندپوینت سرچ بک‌اِند برای فیلترینگ لایو دیتابیس
  const searchCommitteesFromBackend = async (keyword) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:8081/api/v1.0/committees/search?keyword=${encodeURIComponent(keyword)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && Array.isArray(response.data)) {
        const processedData = processCommitteeData(response.data);
        setCommittees(processedData);
        syncSelectedCommittee(processedData);
      }
    } catch (err) {
      console.error("Error searching committees from backend:", err);
    }
  };

  // همگام‌سازی استیت پنل جزئیات سمت راست با دیتای آپدیت شده
  const syncSelectedCommittee = (latestData) => {
    if (selectedCommittee) {
      const currentUpdated = latestData.find(item => item.id === selectedCommittee.id);
      if (currentUpdated) {
        setSelectedCommittee(currentUpdated);
      }
    }
  };

  // ⚡ ۲. متد گرفتن کاربران سیستم برای مودال اضافه کردن عضو
  const fetchRealUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/v1.0/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data)) {
        setRealUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // لود اولیه دیتای کامپوننت
  useEffect(() => {
    fetchAllCommittees();
    fetchRealUsers();
  }, []);

  // ⚡ مکانیزم Debounce حرفه‌ای برای متصل کردن سرچ باکس به ای‌پیا‌ی سرچ بک‌اِند
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchAllCommittees(); // اگر سرچ باکس خالی بود تمام لیست برگردد
    } else {
      const delayDebounceFn = setTimeout(() => {
        searchCommitteesFromBackend(searchTerm);
      }, 300); // تاخیر ۳۰۰ میلی‌ثانیه برای بهینه‌سازی ترافیک سرور

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  // ⚡ ۳. متد ایجاد کمیته جدید
  const handleSaveNewCommittee = async (data) => {
    try {
      const token = sessionStorage.getItem('token');
      const committeePayload = {
        name: data.name ? data.name.trim() : "",
        description: data.description || ""
      };

      const response = await axios.post(
        'http://localhost:8081/api/v1.0/admin/committees/create', 
        committeePayload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Committee created successfully!");
        setIsCreateModalOpen(false); 
        searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
      }
    } catch (err) {
      console.error("Error creating committee:", err);
      alert(err.response?.data || "Failed to create committee.");
    }
  };

  // ⚡ ۴. متد حذف کمیته
  const handleDeleteCommittee = async (committeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this committee?");
    if (confirmDelete) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`http://localhost:8081/api/v1.0/admin/committees/delete/${committeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          if (selectedCommittee && selectedCommittee.id === committeeId) {
            setSelectedCommittee(null);
          }
          alert("Committee deleted successfully.");
          searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
        }
      } catch (err) {
        alert(err.response?.data || "Failed to delete committee.");
      }
    }
  };

  // ⚡ ۵. متد آپدیت تصویر کمیته در دیتابیس
  const handleUpdateImage = async (base64Image) => {
    if (!selectedCommittee) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        name: selectedCommittee.name,
        description: selectedCommittee.description,
        selectedAdminId: selectedCommittee.committeeAdmin?.id || null,
        image: base64Image 
      };

      const response = await axios.put(
        `http://localhost:8081/api/v1.0/admin/committees/update/${selectedCommittee.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSelectedCommittee({ ...selectedCommittee, image: base64Image });
        alert("Committee profile image updated successfully!");
        searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
      }
    } catch (err) {
      console.error("Error updating committee image:", err);
      alert(err.response?.data || "Failed to update profile image.");
    }
  };

  // ⚡ ۶. متد حذف عضو از کمیته (بک‌اِند)
  const handleRemoveMember = async (committeeId, memberId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this member?");
    if (confirmDelete) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:8081/api/v1.0/admin/remove-member/${committeeId}/${memberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          alert("Member removed successfully.");
          searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data || "Failed to remove member.");
      }
    }
  };

  // ⚡ ۷. متد افزودن عضو به کمیته
  const handleAddMemberAction = async (user) => {
    if (!selectedCommittee) return;

    try {
      const token = sessionStorage.getItem('token');
      const isAlreadyMember = selectedCommittee.members?.some(m => Number(m.id) === Number(user.id));
      if (isAlreadyMember) {
        alert(`${user.firstName} ${user.lastName} is already a member.`);
        return;
      }

      await axios.post(
        `http://localhost:8081/api/v1.0/admin/committees/${selectedCommittee.id}/add-reviewer/${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
      alert("Member added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to add member.");
    } finally {
      setShowUserSelector(false); 
    }
  };

  // ⚡ ۸. متد ادیت مشخصات و ادمین کمیته
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        name: editFormData.name ? editFormData.name.trim() : "",
        description: editFormData.description || "",
        selectedAdminId: editFormData.selectedAdminId || null 
      };

      const response = await axios.put(
        `http://localhost:8081/api/v1.0/admin/committees/update/${editFormData.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        alert("Committee changes applied successfully!");
        setShowEditModal(false);
        searchTerm === "" ? await fetchAllCommittees() : await searchCommitteesFromBackend(searchTerm);
      }
    } catch (err) {
      console.error("Error during save edit:", err);
      alert(err.response?.data || "Failed to update committee layout.");
    }
  };

  return (
    <div className="cm-container dark-theme">
      <div className='cm-scrollable-content'>
        <div className="cm-stats-grid">
          <StatCard title="Total Committees" value={committees.length} icon={<FaSitemap />} color="#3b82f6" />
          <StatCard title="Active Members" value="48" icon={<FaUserCheck />} color="#8b5cf6" />
          <StatCard title="Assigned Ideas" value="19" icon={<FaClipboardCheck />} color="#10b981" />
          <StatCard title="Needs Attention" value="03" icon={<FaRegLightbulb />} color="#f59e0b" />
        </div>

        <header className="cm-header-compact">
          <div className="header-info">
            <h1>Committees Inventory</h1>
            <p>{committees.length} committees loaded in view</p>
          </div>
          <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>+ New Committee</button>
        </header>

        <div className="cm-main-layout">
          <div className="cm-table-wrapper">
            <CommitteeTable 
              data={committees} 
              onSelectCommittee={setSelectedCommittee}
              setSearchTerm={setSearchTerm}
              onDeleteCommittee={handleDeleteCommittee}
            />
          </div>
          
          <div className="cm-panel-wrapper">
            {selectedCommittee ? (
              <CommitteePanel 
                committee={selectedCommittee} 
                onEdit={() => { 
                  setEditFormData({
                    ...selectedCommittee,
                    selectedAdminId: selectedCommittee.committeeAdmin?.id || "" 
                  }); 
                  setShowEditModal(true); 
                }}
                onAdd={() => setShowUserSelector(true)}
                onImageChange={handleUpdateImage}
                onRemoveMember={handleRemoveMember} 
              />
            ) : (
              <div className="empty-panel-state">
                <FaSitemap size={40} style={{opacity: 0.2, marginBottom: '10px'}}/>
                <p>Select a committee to manage details</p>
              </div>
            )}
          </div>

          <CreateCommitteeModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
            onSave={handleSaveNewCommittee} 
          />
        </div>
      </div>

      {/* مودال انتخاب کاربر واقعی دیتابیس */}
      {showUserSelector && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <div className="modal-header">
              <h3>Select User to Add as Member</h3>
              <button className="close-icon" onClick={() => setShowUserSelector(false)}><FaTimes /></button>
            </div>
            <div className="user-selection-list">
              {realUsers.map(user => (
                <div key={user.id} className="user-select-item" onClick={() => handleAddMemberAction(user)}>
                  <div className="user-info-mini">
                    <div className="avatar-mini">{(user.firstName || "U").charAt(0)}</div>
                    <span>{`${user.firstName || ''} ${user.lastName || ''}`}</span>
                    <small style={{color: '#666', marginLeft: '8px'}}>({user.email || user.username})</small>
                  </div>
                  <button className="add-action-btn">Add to Committee</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* مودال ادیت ادمین و اطلاعات */}
      {showEditModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <div className="modal-header">
              <h3>Edit Committee Info & Lead</h3>
              <button className="close-icon" onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="edit-form">
              <div className="form-group">
                <label>Committee Name</label>
                <input 
                  type="text" 
                  value={editFormData?.name || ""} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                />
              </div>

              <div className='form-group'>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editFormData?.description || ""}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className='form-textarea'
                />
              </div>

              <div className="form-group">
                <label style={{fontWeight: 'bold', color: '#4da6ff'}}>Select Admin from Committee Members</label>
                <select 
                  value={editFormData?.selectedAdminId || ""} 
                  onChange={(e) => setEditFormData({...editFormData, selectedAdminId: e.target.value})}
                >
                    <option value="">-- Choose a Member to be Lead --</option>
                    {editFormData?.members && editFormData.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name ? member.name : `${member.firstName || ''} ${member.lastName || ''}`}
                    </option>
                  ))}
                </select>
                {(!editFormData?.members || editFormData.members.length === 0) && (
                  <span style={{ color: '#ffbb33', fontSize: '11px', display: 'block', marginTop: '5px' }}>
                    * این کمیته هیچ عضوی ندارد! ابتدا باید از پنل اصلی عضو اضافه کنید تا بتوانید او را ادمین بسازید.
                  </span>
                )}
              </div>
              <button type="submit" className="save-btn-final">Apply Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeManagement;