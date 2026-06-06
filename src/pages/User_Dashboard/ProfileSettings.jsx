// src/pages/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaShieldAlt, FaCloudUploadAlt, 
  FaEdit, FaSave, FaLock, FaEye, FaEyeSlash, FaClock 
} from 'react-icons/fa';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // وضعیت آشکارسازی پسوردها (آیکون چشم)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // دیتای پروفایل متصل به اینتیتی User فرید
  const [userProfile, setUserProfile] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roles: [],
    profilePicturePath: null,
    createdAt: null // برای نمایش تایم ایجاد حساب از بک‌اِند
  });

  // وضعیت فیلدهای پسورد
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const BASE_URL = 'http://localhost:8081/api/v1.0/users';

  // لود دیتای زنده از بک‌اِند فرید
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(response.data);
      } catch (err) {
        console.error("Error loading profile from backend:", err);
        setMessage({ type: 'error', text: 'Could not fetch live profile metrics from repository.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // ذخیره معلومات شخصی در بک‌اِند
  const handleSaveChanges = async () => {
    if (isEditable) {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      try {
        const token = localStorage.getItem('token');
        const updatePayload = {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phoneNumber: userProfile.phoneNumber
        };

        const response = await axios.put(`${BASE_URL}/profile`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserProfile(response.data);
        setIsEditable(false);
        setMessage({ type: 'success', text: 'Profile database records synchronized successfully!' });
      } catch (err) {
        console.error("Update payload error:", err);
        setMessage({ type: 'error', text: 'Failed to commit updates. Validate secure field properties.' });
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditable(true);
    }
  };

  // آپلود تصویر واقعی به سرور فرید
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setImageUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/profile/picture`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const finalImageUrl = response.data.profilePictureUrl;
      setUserProfile(prev => ({ ...prev, profilePicturePath: finalImageUrl }));
      setMessage({ type: 'success', text: 'Avatar binary file successfully committed to storage directory.' });
    } catch (err) {
      console.error("Image upload pipeline error:", err);
      setMessage({ type: 'error', text: 'File rejection. Ensure media standard formats match.' });
    } finally {
      setImageUploading(false);
    }
  };

  // تغییر پسورد
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Security validation mismatch: New passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/profile/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Password encrypted and updated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to verify credential chain blocks.' });
    } finally {
      setLoading(false);
    }
  };

  const formatRoles = (rolesArray) => {
    if (!rolesArray || rolesArray.length === 0) return 'Standard Account';
    return rolesArray.map(role => role.replace('ROLE_', '')).join(', ');
  };

  // فرمت ساده برای نمایش تایم عضویت کاربر از بک‌اِند
  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'Recent Timestamp';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !userProfile.id) {
    return (
      <div className="profile-settings-workspace">
        <div className="profile-loading-fallback">Fetching core user credential logs...</div>
      </div>
    );
  }

  return (
    <div className="profile-settings-workspace">
      <div className="profile-view-title">
        <h2>Profile Settings</h2>
      </div>

      {message.text && (
        <div className={`profile-status-toast ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* ۱. بنر بالایی: کاملاً داینامیک (از بک‌اِند) و رنگ آبی پروژه */}
      <div className="identity-banner-card blue-theme">
        <div className="banner-left-identity">
          <div className="profile-avatar-wrapper">
            {userProfile.profilePicturePath ? (
              <img src={`http://localhost:8081${userProfile.profilePicturePath}`} alt="User Avatar" />
            ) : (
              <div className="avatar-placeholder-icon"><FaUser /></div>
            )}
          </div>
          <div className="identity-text-meta">
            <h3>{userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : 'Loading...'}</h3>
            <p className="banner-meta-row"><FaEnvelope /> {userProfile.email || 'Email missing'}</p>
            <p className="banner-meta-row"><FaPhone /> {userProfile.phoneNumber || 'No phone configured'}</p>
            <p className="banner-meta-row"><FaClock /> Joined Date: {formatJoinedDate(userProfile.createdAt)}</p>
          </div>
        </div>
        
        <button 
          className={`banner-toggle-edit-btn ${isEditable ? 'save-active' : ''}`} 
          onClick={handleSaveChanges}
          disabled={loading}
        >
          {loading ? 'Syncing...' : isEditable ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
        </button>
      </div>

      {/* ۲. چیدمان فیلدها و پنل پسورد */}
      <div className="settings-split-layout-grid">
        
        {/* بلوک اطلاعات شخصی */}
        <div className="personal-information-panel">
          <h3>Personal Information</h3>
          
          <div className="settings-fields-grid">
            <div className="input-data-field-box">
              <label>First Name</label>
              <div className="input-with-icon-wrapper">
                <FaUser className="field-inner-icon" />
                <input 
                  type="text" 
                  name="firstName"
                  value={userProfile.firstName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditable} 
                  placeholder="First name"
                />
              </div>
            </div>

            <div className="input-data-field-box">
              <label>Last Name</label>
              <div className="input-with-icon-wrapper">
                <FaUser className="field-inner-icon" />
                <input 
                  type="text" 
                  name="lastName"
                  value={userProfile.lastName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditable} 
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="input-data-field-box full-width-cell">
              <label>Your Phone Number</label>
              <div className="input-with-icon-wrapper">
                <FaPhone className="field-inner-icon" />
                <input 
                  type="text" 
                  name="phoneNumber"
                  value={userProfile.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditable} 
                  placeholder="e.g. +93789558914"
                />
              </div>
            </div>

            <div className="input-data-field-box full-width-cell">
              <label>Email Address (Immutable ID System Key)</label>
              <div className="input-with-icon-wrapper locked-state">
                <FaEnvelope className="field-inner-icon" />
                <input 
                  type="email" 
                  value={userProfile.email || ''}
                  disabled={true} 
                />
              </div>
            </div>

            {/* بخش آپلود تصویر */}
            <div className="input-data-field-box full-width-cell">
              <label>Profile Avatar Picture</label>
              <div className={`drag-drop-upload-zone ${!isEditable ? 'disabled-zone' : ''} ${imageUploading ? 'uploading' : ''}`}>
                <FaCloudUploadAlt className="upload-vector-cloud" />
                <p>
                  <span>{imageUploading ? 'Uploading file trace...' : 'Click to update picture'}</span> or drag & drop
                </p>
                <span>PNG, JPG formats accepted.</span>
                <input 
                  type="file" 
                  disabled={!isEditable || imageUploading} 
                  accept="image/*" 
                  className="hidden-file-input" 
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        {/* بلوک امنیت و پسورد با قابلیت چشم (آبی شده) */}
        <div className="personal-information-panel security-panel">
          <h3>Security & Passwords</h3>
          <form onSubmit={handleUpdatePassword} className="settings-fields-grid single-column">
            
            {/* فیلد ۱: پسورد فعلی */}
            <div className="input-data-field-box">
              <label>Current Authentication Password</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="field-inner-icon" />
                <input 
                  type={showCurrentPassword ? "text" : "password"} 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-eye-btn"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* فیلد ۲: پسورد جدید */}
            <div className="input-data-field-box">
              <label>New Root Password Target</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="field-inner-icon" />
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-eye-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* فیلد ۳: تایید پسورد */}
            <div className="input-data-field-box">
              <label>Confirm New Password Vector</label>
              <div className="input-with-icon-wrapper">
                <FaLock className="field-inner-icon" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat new password"
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="security-commit-btn blue-theme" disabled={loading}>
              Update Password Key
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;