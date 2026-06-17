// src/components/BackupManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaClock, FaDatabase, FaPlay, FaHistory, FaSave, FaSync, FaCalendarAlt, FaUndoAlt, FaTrashAlt } from 'react-icons/fa';
import './BackupManagement.css';

const BackupManagement = () => {
  // Main scheduling selection parameters
  const [frequency, setFrequency] = useState('daily'); // Options: hourly, daily, weekly, monthly, specific, cron
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('SUN'); 
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState('1'); 
  const [customCron, setCustomCron] = useState(''); 

  // Standard Time State for recurrent frequencies (Daily, Weekly, Monthly)
  const [executionTime, setExecutionTime] = useState('02:30'); 

  // 📅 States for the Integrated Calendar/Time Picker Dictionary
  const [showPicker, setShowPicker] = useState(false);
  const [chosenYear, setChosenYear] = useState('2026');
  const [chosenMonth, setChosenMonth] = useState('06');
  const [chosenDay, setChosenDay] = useState('15');
  const [chosenHour, setChosenHour] = useState('02');
  const [chosenMinute, setChosenMinute] = useState('30');

  const [currentCron, setCurrentCron] = useState('0 0 0 * * ?');
  const [backupHistory, setBackupHistory] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Track restoration or deletion process exclusively per filename
  const [restoringFile, setRestoringFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const [message, setMessage] = useState({ text: '', isError: false });

  const pickerRef = useRef(null);

  // Dictionary range generations
  const yearsList = ['2026', '2027', '2028', '2029', '2030'];
  const monthsList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const daysList = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Close the popup dictionary if clicking anywhere outside the picker container
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getAuthConfig = () => {
    let token = sessionStorage.getItem('token');
    if (token) {
      token = token.replace(/^["']|["']$/g, '').trim();
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchBackupMetadata = async () => {
    setLoadingSchedule(true);
    setLoadingHistory(true);
    try {
      const scheduleRes = await axios.get('http://localhost:8081/api/v1.0/admin/backups/current-schedule', getAuthConfig());
      if (scheduleRes.data && scheduleRes.data.currentCron) {
        setCurrentCron(scheduleRes.data.currentCron);
      }

      const historyRes = await axios.get('http://localhost:8081/api/v1.0/admin/backups/history-list', getAuthConfig());
      if (Array.isArray(historyRes.data)) {
        // Sort history list to put newest file modification at top
        const sortedFiles = historyRes.data.sort((a, b) => b.lastModified - a.lastModified);
        setBackupHistory(sortedFiles);
      }
    } catch (err) {
      console.error("Error communicating with Backup API endpoints:", err);
      showNotification("Unable to connect to server or insufficient permissions.", true);
    } finally {
      setLoadingSchedule(false);
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchBackupMetadata();
  }, []);

  // Custom persistent delay timing helper
  const showNotification = (text, isError = false, duration = 6000) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: '', isError: false }), duration);
  };

  // ⚡ HANDLER: Package state entries cleanly into structured backend formats
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    let finalExecutionTime = null;
    let finalCustomCron = '';

    if (frequency === 'specific') {
      finalExecutionTime = `${chosenYear}-${chosenMonth}-${chosenDay}T${chosenHour}:${chosenMinute}:00`;
      const parsedDay = parseInt(chosenDay, 10);
      const parsedMonth = parseInt(chosenMonth, 10);
      const parsedHour = parseInt(chosenHour, 10);
      const parsedMinute = parseInt(chosenMinute, 10);
      
      // 🌟 FIXED: Removed trailing "${chosenYear}" field. Now correctly forms exactly 6 fields.
      finalCustomCron = `0 ${parsedMinute} ${parsedHour} ${parsedDay} ${parsedMonth} ?`;
    } else {
      const [timeHour, timeMinute] = executionTime.split(':');

      switch (frequency) {
        case 'hourly':
          finalCustomCron = "0 0 * * * ?"; 
          break;
        case 'daily':
          finalCustomCron = `0 ${parseInt(timeMinute, 10)} ${parseInt(timeHour, 10)} * * ?`;
          break;
        case 'weekly':
          finalCustomCron = `0 ${parseInt(timeMinute, 10)} ${parseInt(timeHour, 10)} * * ${selectedDayOfWeek}`;
          break;
        case 'monthly':
          finalCustomCron = `0 ${parseInt(timeMinute, 10)} ${parseInt(timeHour, 10)} ${parseInt(selectedDayOfMonth, 10)} * ?`;
          break;
        case 'cron':
          finalCustomCron = customCron;
          break;
        default:
          finalCustomCron = "0 0 0 * * ?";
      }
      finalExecutionTime = executionTime; 
    }

    const payload = {
      executionTime: finalExecutionTime,
      customCron: finalCustomCron
    };

    try {
      const response = await axios.post(
        'http://localhost:8081/api/v1.0/admin/backups/configure-schedule',
        payload,
        getAuthConfig()
      );
      
      if (response.data && response.data.status === "SUCCESS") {
        setCurrentCron(response.data.currentCron);
        showNotification("Backup schedule settings successfully updated.");
      }
    } catch (err) {
      showNotification(err.response?.data || "Error processing scheduling parameters.", true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRunBackupNow = async () => {
    if (!window.confirm("Are you sure you want to trigger an immediate database backup?")) return;
    
    setActionLoading(true);
    showNotification("System backup process initiated... Processing disk blocks.");
    
    try {
      const response = await axios.post('http://localhost:8081/api/v1.0/admin/backups/run-now', {}, getAuthConfig());
      showNotification(response.data?.message || "Manual snapshot completed successfully.");
      fetchBackupMetadata();
    } catch (err) {
      showNotification("Error executing native database dump process.", true);
    } finally {
      setActionLoading(false);
    }
  };

  // 🔄 HANDLER: Execute database restoration rollback safely
  const handleRestoreBackupNow = async (fileName) => {
    const doubleCheck = window.confirm(`CRITICAL WARNING:\n\nAre you absolutely sure you want to restore the system database to the archive snapshot:\n"${fileName}"?\n\nThis completely overwrites your active runtime state data.`);
    if (!doubleCheck) return;

    setRestoringFile(fileName);
    showNotification(`Restoring system snapshot: ${fileName}... Please do not refresh or close your browser.`, false, 20000);

    try {
      const response = await axios.post(
        'http://localhost:8081/api/v1.0/admin/backups/restore-now',
        { fileName: fileName },
        getAuthConfig()
      );

      if (response.data && response.data.status === "SUCCESS") {
        showNotification(
          `DATABASE RESTORED COMPLETELY! The system has successfully rolled back data layout configurations to file snapshot: ${fileName}`, 
          false, 
          10000
        );
      }
    } catch (err) {
      console.error("Restoration routine failure log:", err);
      showNotification(err.response?.data || "Failed to execute database snapshot restoration.", true, 8000);
    } finally {
      setRestoringFile(null);
    }
  };

  // 🗑️ HANDLER: Securely erase backup archive file from server disk
  const handleDeleteBackupNow = async (fileName) => {
    const finalConfirm = window.confirm(`Are you completely sure you want to permanently delete this snapshot file from server storage?\n\nFile Name: "${fileName}"\n\nThis action cannot be undone.`);
    if (!finalConfirm) return;

    setDeletingFile(fileName);
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/v1.0/admin/backups/delete-file?fileName=${fileName}`,
        getAuthConfig()
      );

      if (response.data && response.data.status === "SUCCESS") {
        showNotification(response.data.message || "DATABASE SNAPSHOT DELETED COMPLETELY!", false, 8000);
        setBackupHistory(prevHistory => prevHistory.filter(file => file.fileName !== fileName));
      }
    } catch (err) {
      console.error("Deletion loop execution exception trace:", err);
      const errorMessage = err.response?.data?.message || "Could not dispatch delete command to system disk.";
      showNotification(errorMessage, true, 8000);
    } finally {
      setDeletingFile(null);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="backup-panel-container">
      
      {/* Header Bar */}
      <div className="backup-header-bar">
        <h2 className="backup-title">
          <FaDatabase className="icon-db-blue" /> Database Backup & Schedule Management
        </h2>
        <button 
          className="refresh-btn" 
          onClick={fetchBackupMetadata} 
          disabled={loadingSchedule || loadingHistory || restoringFile !== null || deletingFile !== null}
          type="button"
        >
          <FaSync className={loadingSchedule || loadingHistory ? "spin" : ""} /> Refresh Status
        </button>
      </div>

      {/* Global Status Notifications */}
      {message.text && (
        <div className={`notification-alert ${message.isError ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Control Configuration Wrapper */}
      <div className="backup-grid-system">
        
        {/* Card Block 1: The Dynamic Schedule Form */}
        <div className="backup-card">
          <h3 className="card-subtitle">
            <FaClock className="icon-clock-amber" /> Automated Backup Scheduler
          </h3>
          
          <div className="cron-status-badge">
            <strong>Active Server Cron Expression:</strong> 
            <code className="cron-code-view">{loadingSchedule ? "Fetching..." : currentCron}</code>
          </div>

          <form onSubmit={handleSaveSchedule}>
            
            {/* 1. Main Dropdown Selection */}
            <div className="form-input-group">
              <label className="input-label">Select Backup Interval Frequency:</label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                className="backup-form-input dropdown-select"
                disabled={actionLoading || restoringFile !== null || deletingFile !== null}
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Every Day</option>
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
                <option value="specific">At a Specific Execution Time Only</option>
                <option value="cron">Expert Mode (Manual Cron String)</option>
              </select>
            </div>

            {/* 2. Recurrent Day of Week Picker */}
            {frequency === 'weekly' && (
              <div className="form-input-group">
                <label className="input-label">Select Day of the Week:</label>
                <select 
                  value={selectedDayOfWeek} 
                  onChange={(e) => setSelectedDayOfWeek(e.target.value)}
                  className="backup-form-input dropdown-select"
                  disabled={actionLoading}
                >
                  <option value="SUN">Sunday</option>
                  <option value="MON">Monday</option>
                  <option value="TUE">Tuesday</option>
                  <option value="WED">Wednesday</option>
                  <option value="THU">Thursday</option>
                  <option value="FRI">Friday</option>
                  <option value="SAT">Saturday</option>
                </select>
              </div>
            )}

            {/* 3. Recurrent Day of Month Picker */}
            {frequency === 'monthly' && (
              <div className="form-input-group">
                <label className="input-label">Select Calendar Day of the Month:</label>
                <select 
                  value={selectedDayOfMonth} 
                  onChange={(e) => setSelectedDayOfMonth(e.target.value)}
                  className="backup-form-input dropdown-select"
                  disabled={actionLoading}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>Day {day}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Standard Clock Time Input */}
            {(frequency === 'daily' || frequency === 'weekly' || frequency === 'monthly') && (
              <div className="form-input-group">
                <label className="input-label">Set Clock Execution Time:</label>
                <input 
                  type="time" 
                  value={executionTime} 
                  onChange={(e) => setExecutionTime(e.target.value)} 
                  onClick={(e) => e.target.showPicker ? e.target.showPicker() : null} 
                  className="backup-form-input clock-time-picker"
                  required
                  disabled={actionLoading}
                />
              </div>
            )}

            {/* 5. 📅 FULL CUSTOM CALENDAR & TIME DICTIONARY FOR SPECIFIC SELECTION */}
            {frequency === 'specific' && (
              <div className="form-input-group picker-position-relative" ref={pickerRef}>
                <label className="input-label">Select Target Date & Time Dictionary:</label>
                
                <div 
                  className="custom-dictionary-trigger-box" 
                  onClick={() => !actionLoading && setShowPicker(!showPicker)}
                >
                  <FaCalendarAlt className="calendar-box-icon" />
                  <span>{`${chosenYear}-${chosenMonth}-${chosenDay} @ ${chosenHour}:${chosenMinute}`}</span>
                </div>

                {showPicker && (
                  <div className="custom-dictionary-dropdown-panel animate-panel-fade">
                    <div className="panel-dictionary-header">Configure Snapshot Point</div>
                    
                    <div className="picker-dictionary-columns-wrapper">
                      <div className="dict-column">
                        <span className="dict-column-title">Year</span>
                        <select value={chosenYear} onChange={(e) => setChosenYear(e.target.value)} className="dict-inner-select">
                          {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>

                      <div className="dict-column">
                        <span className="dict-column-title">Month</span>
                        <select value={chosenMonth} onChange={(e) => setChosenMonth(e.target.value)} className="dict-inner-select">
                          {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <div className="dict-column">
                        <span className="dict-column-title">Day</span>
                        <select value={chosenDay} onChange={(e) => setChosenDay(e.target.value)} className="dict-inner-select">
                          {daysList.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div className="panel-separator-bar">|</div>

                      <div className="dict-column">
                        <span className="dict-column-title">Hour</span>
                        <select value={chosenHour} onChange={(e) => setChosenHour(e.target.value)} className="dict-inner-select highlight-time">
                          {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>

                      <div className="dict-column">
                        <span className="dict-column-title">Min</span>
                        <select value={chosenMinute} onChange={(e) => setChosenMinute(e.target.value)} className="dict-inner-select highlight-time">
                          {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-close-dictionary" 
                      onClick={() => setShowPicker(false)}
                    >
                      Set Selection
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6. Raw input string fallback */}
            {frequency === 'cron' && (
              <div className="form-input-group">
                <label className="input-label">Custom Spring Cron Expression:</label>
                <input 
                  type="text" 
                  placeholder="e.g. 0 0 */12 * * ?" 
                  value={customCron} 
                  onChange={(e) => setCustomCron(e.target.value)} 
                  className="backup-form-input ltr-input"
                  required
                  disabled={actionLoading}
                />
                <small className="input-help-text">Format: sec min hour day month weekday</small>
              </div>
            )}

            <button type="submit" disabled={actionLoading || restoringFile !== null || deletingFile !== null} className="btn-submit-primary">
              <FaSave /> {actionLoading ? "Saving Settings..." : "Apply New Schedule"}
            </button>
          </form>
        </div>

        {/* Card Block 2: Manual Control Execution */}
        <div className="backup-card centralize-card">
          <h3 className="card-subtitle">
            <FaPlay className="icon-play-green" /> Immediate On-Demand Backup
          </h3>
          <p className="card-description-text">
            Before executing major system modifications, you can bypass automated scheduler routines. Clicking below extracts an instantaneous, complete image snapshot of your target database directly to server disk infrastructure.
          </p>
          <button 
            onClick={handleRunBackupNow} 
            disabled={actionLoading || restoringFile !== null || deletingFile !== null} 
            className="btn-trigger-success" 
            type="button"
          >
            <FaDatabase /> {actionLoading ? "Writing disk blocks..." : "Backup Now"}
          </button>
        </div>
      </div>

      {/* History Archival Data Table Component */}
      <div className="backup-card">
        <h3 className="card-subtitle">
          <FaHistory className="icon-history-indigo" /> Server-Side Archival Backups History
        </h3>
        
        {loadingHistory ? (
          <div className="table-loading-state">Loading history logs...</div>
        ) : backupHistory.length === 0 ? (
          <div className="table-empty-state">No database backup copies (.bak) discovered on system storage clusters.</div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="backup-table">
              <thead>
                <tr>
                  <th>Archive File Name</th>
                  <th>Allocated Size</th>
                  <th>Generation Timestamp</th>
                  <th style={{ textAlign: 'center' }}>Actions Engine Control Route</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((file, idx) => (
                  <tr key={idx}>
                    <td className="file-name-td">📂 {file.fileName}</td>
                    <td>{formatBytes(file.sizeInBytes)}</td>
                    <td>{new Date(file.lastModified).toLocaleString('en-US')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-flex-gap" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        
                        {/* Rollback Restoration Button */}
                        <button
                          type="button"
                          className="btn-inline-restore"
                          disabled={actionLoading || restoringFile !== null || deletingFile !== null}
                          onClick={() => handleRestoreBackupNow(file.fileName)}
                        >
                          {restoringFile === file.fileName ? (
                            <>
                              <FaSync className="spin" /> Restoring...
                            </>
                          ) : (
                            <>
                              <FaUndoAlt /> Rollback
                            </>
                          )}
                        </button>

                        {/* File Erasure Button */}
                        <button
                          type="button"
                          className="btn-inline-delete"
                          disabled={actionLoading || restoringFile !== null || deletingFile !== null}
                          onClick={() => handleDeleteBackupNow(file.fileName)}
                        >
                          {deletingFile === file.fileName ? (
                            <>
                              <FaSync className="spin" /> Clearing...
                            </>
                          ) : (
                            <>
                              <FaTrashAlt /> Delete
                            </>
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManagement;