import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import { FaEllipsisV, FaUserEdit, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { usersData } from '../data/mockUsers'; 

const UserManagement = () => {
  const [users, setUsers] = useState(usersData);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ role: '' });

  const handleSave = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: editForm.role } : u));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("آیا حذف شود؟")) {
      setUsers(users.filter(u => u.id !== id));
      setOpenMenuId(null);
    }
  };


  // اضافه کردن این useEffect برای بستن منو با کلیک روی صفحه
    useEffect(() => {
      const handleClickOutside = (event) => {
        // اگر کلیک خارج از دکمه منو بود، منو را ببند
        if (!event.target.closest('.menu-container')) {
          setOpenMenuId(null);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);


 



  return (
    <div className="user-mgmt-section">
      <div className="mgmt-header">
        <h3>Manage Users</h3>
      </div>
      
      <div className="table-scroll-container">
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
                <td><img src={user.avatar || 'https://via.placeholder.com/40'} className="table-avatar" alt="p" /></td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  {editingId === user.id ? (
                    <select value={editForm.role} onChange={(e) => setEditForm({role: e.target.value})}>
                      <option value="Admin">Admin</option>
                      <option value="Inventor">Inventor</option>
                      <option value="Reviewer">Reviewer</option>
                    </select>
                  ) : <span className="role-badge">{user.role}</span>}
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
                          <button className="dropdown-item" onClick={() => { setEditingId(user.id); setEditForm({role: user.role}); setOpenMenuId(null); }}><FaUserEdit /> Edit</button>
                          <button className="dropdown-item delete" onClick={() => handleDelete(user.id)}><FaTrash /> Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;