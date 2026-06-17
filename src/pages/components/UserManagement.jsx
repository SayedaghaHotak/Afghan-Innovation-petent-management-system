// src/pages/admin/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { FaEllipsisV, FaTrash, FaEye, FaSearch, FaSortAmountDown, FaSortAmountUp, FaTimes } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [direction, setDirection] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null); // برای ذخیره کاربر انتخاب شده جهت نمایش در مدال

  // ۱. گرفتن لیست کاربران فیلتر شده از بک‌اِند
  const fetchFilteredUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/v1.0/users/search', {
        params: { keyword, direction },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to sync and load database records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchFilteredUsers(); }, 400);
    return () => clearTimeout(delayDebounce);
  }, [keyword, direction]);

  // ۲. مشاهده پروفایل کاربر (View)
  const handleViewUser = async (id) => {
    try {
      setOpenMenuId(null);
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:8081/api/v1.0/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(response.data);
    } catch (err) {
      alert("Could not load complete profile details.");
    }
  };

  // ۳. حذف کاربر (Delete)
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user profile?")) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`http://localhost:8081/api/v1.0/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u.id !== id));
        setOpenMenuId(null);
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) setOpenMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="user-mgmt-section">
      <div className="mgmt-header">
        <div className="header-top-line">
          <h3>Manage Users</h3>
          <div className="filter-tools-box">
            <div className="search-input-wrapper">
          
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="sort-dropdown-wrapper">
              {direction === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              <select value={direction} onChange={(e) => setDirection(e.target.value)}>
                <option value="asc">Name (A to Z)</option>
                <option value="desc">Name (Z to A)</option>
              </select>
            </div>
          </div>
        </div>
        {error && <span className="error-text">{error}</span>}
      </div>
      
      <div className="table-scroll-container">
        {loading ? (
          <p className="status-message">Loading Sync Data...</p>
        ) : users.length === 0 ? (
          <p className="status-message">No matches found in database.</p>
        ) : (
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <img src={user.profilePicturePath ? `http://localhost:8081${user.profilePicturePath}` : 'https://via.placeholder.com/40'} className="table-avatar" alt="profile" />


                 
                  </td>
                  <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.roles?.[0] || 'No Role'}</span>
                  </td>
                  <td>
                    <div className="menu-container">
                      <button className="dots-btn" onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}>
                        <FaEllipsisV />
                      </button>
                      {openMenuId === user.id && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => handleViewUser(user.id)}><FaEye /> View Profile</button>
                          <button className="dropdown-item delete" onClick={() => handleDeleteUser(user.id)}><FaTrash /> Delete User</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🖼️ پاپ‌آپ (Modal) نمایش جزئیات پروفایل کاربر */}
      {selectedUser && (
        <div className="view-modal-backdrop">
          <div className="view-modal-card">
            <button className="close-modal-btn" onClick={() => setSelectedUser(null)}><FaTimes /></button>
            <div className="modal-header-info">
              <img src={selectedUser.profilePicturePath ? `http://localhost:8081${selectedUser.profilePicturePath}` : 'https://via.placeholder.com/80'} className="modal-avatar" alt="avatar"/>
              <h4>{selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`}</h4>
              <span className="role-badge">{selectedUser.roles?.[0] || 'USER'}</span>
            </div>
            <div className="modal-body-details">
              <div className="detail-item"><strong>User ID:</strong> <span>{selectedUser.id}</span></div>
              <div className="detail-item"><strong>Email Address:</strong> <span>{selectedUser.email}</span></div>
              <div className="detail-item"><strong>Phone Number:</strong> <span>{selectedUser.phoneNumber || 'N/A'}</span></div>
              <div className="detail-item"><strong>Failed Logins:</strong> <span>{selectedUser.failedLoginAttempts}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;