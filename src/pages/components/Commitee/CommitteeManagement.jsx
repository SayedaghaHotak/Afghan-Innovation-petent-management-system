import React, { useState } from 'react';
import { mockCommittees, mockUsers } from '../../data/mockUsers'; 
import StatCard from '../StatCard'; 
import { FaSitemap, FaUserCheck, FaClipboardCheck, FaRegLightbulb, FaTimes } from 'react-icons/fa';
import CommitteeTable from './CommiteeTable';
import CommitteePanel from './CommitteePanel';
import './Commitee.css';
import CreateCommitteeModal from '../NewCommittee/CreateCommitteeModal';

const CommitteeManagement = () => {
  const [committees, setCommittees] = useState(mockCommittees);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const filteredData = committees.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.chair.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

// delete committee
  const handleDeleteCommittee = (committeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this committee?");
    if (confirmDelete){
      const updated= committees.filter(c => c.id !== committeeId);
      setCommittees(updated);
      if (selectedCommittee && selectedCommittee.id === committeeId){
        setSelectedCommittee(null);
      }
    };
  };

  // create new committee
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSaveNewCommittee = (data) => {
      // Logic for your Mock Data (And later your API)
      const newCommittee = {
        ...data,
        id: Date.now(), // Unique ID
        chair: "Unassigned", 
        members: [], // Starts with 0 members
        type: "General" 
      };

      setCommittees([newCommittee, ...committees]);
      setIsCreateModalOpen(false); // Close modal
   };
  




// to update committee image 
  const handleUpdateImage = (base64Image) => {
    const updated = committees.map(c => 
      c.id === selectedCommittee.id ? { ...c, image: base64Image } : c
    );
    setCommittees(updated);
    setSelectedCommittee({ ...selectedCommittee, image: base64Image });
  };

  // to delete member from committee
  const handleRemoveMember = (committeeId, memberId) => {
  // 1. Ask for confirmation
  const confirmDelete = window.confirm("Are you sure you want to remove this member?");
  
  if (confirmDelete) {
    // 2. Update the main committees list
    const updatedCommittees = committees.map(c => {
      if (c.id === committeeId) {
        return {
          ...c,
          members: c.members.filter(m => m.id !== memberId)
        };
      }
      return c;
    });

    setCommittees(updatedCommittees);

    // 3. Update the side panel (selectedCommittee) so the name disappears immediately
    if (selectedCommittee && selectedCommittee.id === committeeId) {
      setSelectedCommittee({
        ...selectedCommittee,
        members: selectedCommittee.members.filter(m => m.id !== memberId)
      });
    }
  }
};


// to add member to committee
  const handleAddMemberAction = (user) => {
if (!selectedCommittee) {
    console.error("No committee selected to add members to.");
    setShowUserSelector(false);
    return;
  }
  const updatedCommittees = committees.map(c => {
    if (c.id === selectedCommittee.id) {
      const isAlreadyMember = c.members.some(m => m.id === user.id);
      
      if (isAlreadyMember) {
        alert(`${user.name} is already in this committee.`);
        return c; 
      }

      return { 
        ...c, 
        members: [...c.members, { id: user.id, name: user.name }] 
      };
    }
    return c;
  });

  setCommittees(updatedCommittees);
  const updatedCurrent = updatedCommittees.find(c => c.id === selectedCommittee.id);
  if (updatedCurrent) {
    setSelectedCommittee(updatedCurrent);
  }
  setShowUserSelector(false);
  };

  // to save edited committee information
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedCommittees = committees.map(c => 
      c.id === editFormData.id ? editFormData : c
    );
    setCommittees(updatedCommittees);
    setSelectedCommittee(editFormData);
    setShowEditModal(false);
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
            <p>{filteredData.length} committees matching your criteria</p>
          </div>


          
          <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>+ New Committee</button>
        </header>

        <div className="cm-main-layout">
          <div className="cm-table-wrapper">
            <CommitteeTable 
              data={filteredData} 
              onSelectCommittee={setSelectedCommittee}
              setSearchTerm={setSearchTerm}
              setFilterType={setFilterType}
              onDeleteCommittee={handleDeleteCommittee}
            />
          </div>
          
          <div className="cm-panel-wrapper">
            {selectedCommittee ? (
              <CommitteePanel 
                committee={selectedCommittee} 
                onEdit={() => { setEditFormData(selectedCommittee); setShowEditModal(true); }}
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

      {showUserSelector && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <div className="modal-header">
              <h3>Select User</h3>
              <button className="close-icon" onClick={() => setShowUserSelector(false)}><FaTimes /></button>
            </div>
            <div className="user-selection-list">
              {mockUsers.map(user => (
                <div key={user.id} className="user-select-item" onClick={() => handleAddMemberAction(user)}>
                  <div className="user-info-mini">
                    <div className="avatar-mini">{user.name.charAt(0)}</div>
                    <span>{user.name}</span>
                  </div>
                  <button className="add-action-btn">Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal-content">
            <div className="modal-header">
              <h3>Edit Committee Info</h3>
              <button className="close-icon" onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder=' enter Committee name  '  value={editFormData?.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
              </div>

              <div className='form-group'>
                <label >Description</label>
                <textarea
                row="3"
                value={editFormData?.description || ""}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder='enter Committee description '
                className='form-textarea'
                />

              </div>
              <div className="form-group">
                <label> Select member as a Lead</label>
                
                <select value={editFormData.chair} onChange={(e) => setEditFormData({...editFormData, chair: e.target.value})}>
                  
                    {editFormData.members && editFormData.members.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
                  {(!editFormData.members || editFormData.members.length === 0) && (
                  <span style={{ color: '#ffbb33', fontSize: '11px' }}>
                  * No members found. Add members first to select a lead.
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