import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { FaEllipsisV, FaUserEdit, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ۱. گرفتن لست تمام یوزرها از بک‌اِند
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/api/v1.0/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ۲. منطق ذخیره تغییرات (فعلاً فرانت، آماده برای وصل به API آپدیت رول)
  const handleSave = async (id) => {
    // اینجا می‌توانید API آپدیت رول را کال کنید
    setUsers(users.map(u => u.id === id ? { ...u, roles: [editForm.role] } : u));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // اینجا می‌توانید axios.delete را به اندپوینت مربوطه بزنید
      setUsers(users.filter(u => u.id !== id));
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="user-mgmt-section">
      <div className="mgmt-header">
        <h3>Manage Users</h3>
        {error && <span className="error-text" style={{color: 'red', fontSize: '12px'}}>{error}</span>}
      </div>
      
      <div className="table-scroll-container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '20px'}}>Loading Users...</p>
        ) : (
          <table className="mgmt-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Profile</th>
                <th style={{ width: '200px' }}>Full Name</th>
                <th style={{ width: '250px' }}>Email Address</th>
                <th style={{ width: '150px' }}>Role</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src={user.profilePicturePath ? `http://localhost:8081${user.profilePicturePath}` : 'https://via.placeholder.com/40'} 
                      className="table-avatar" 
                      alt="profile" 
                    />
                  </td>
                  {/* ترکیب نام و نام خانوادگی مطابق با Entity بک‌اِند شما */}
                  <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingId === user.id ? (
                      <select 
                        value={editForm.role} 
                        onChange={(e) => setEditForm({role: e.target.value})}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="REVIEWER">REVIEWER</option>
                        <option value="COMMITTEE_ADMIN">COMMITTEE_ADMIN</option>
                      </select>
                    ) : (
                      <span className="role-badge">
                        {/* چون در بک‌اِند شما roles یک Set است، اولین رول را نشان می‌دهیم */}
                        {user.roles && user.roles.length > 0 ? user.roles[0] : 'No Role'}
                      </span>
                    )}
                  </td>
                  <td style={{ position: 'relative' }}>
                    {editingId === user.id ? (
                      <div className="action-btns">
                        <button onClick={() => handleSave(user.id)} className="btn-save"><FaCheck /></button>
                        <button onClick={() => setEditingId(null)} className="btn-cancel"><FaTimes /></button>
                      </div>
                    ) : (
                      <div className="menu-container">
                        <button className="dots-btn" onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}>
                          <FaEllipsisV />
                        </button>
                        {openMenuId === user.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item"><FaEye /> Read</button>
                            <button 
                              className="dropdown-item" 
                              onClick={() => { 
                                setEditingId(user.id); 
                                setEditForm({role: user.roles[0]}); 
                                setOpenMenuId(null); 
                              }}
                            >
                              <FaUserEdit /> Edit
                            </button>
                            <button className="dropdown-item delete" onClick={() => handleDelete(user.id)}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;