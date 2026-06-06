import React, { useState, useEffect } from 'react';
import RecentApplicationTable from '../components/RecentApplicationsTable'; // Double check your component path
import { FaSearch, FaFilter } from 'react-icons/fa';
import './AllIdeas.css'; 
  
const AllIdeasTab = () => {
  // 1. States for search, filter, and the main data array
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Mock Data with English text for initial layout and testing
  const mockIdeas = [
    { id: '1', title: 'Smart Traffic Management System for Kabul', student: 'Ahmad Rahimi', category: 'IoT', status: 'Pending', date: '2026/05/12' },
    { id: '2', title: 'Student Health Tracking Application', student: 'Sara Karimi', category: 'Mobile', status: 'Approved', date: '2026/05/10' },
    { id: '3', title: 'Centralized Thesis Database Platform', student: 'Ali Hamdard', category: 'Web', status: 'Rejected', date: '2026/04/28' },
    { id: '4', title: 'University Grade Automation System', student: 'Maryam Amini', category: 'AI', status: 'Approved', date: '2026/04/15' },
  ];

  useEffect(() => {
    // =========================================================================
    // 🌐 BACKEND API CONNECTION (SPRING BOOT INTEGRATION)
    // =========================================================================
    /*
    const fetchAllIdeasFromBackend = async () => {
      setIsLoading(true);
      try {
        // Fetching data from the admin endpoint provided by your backend partner
        const response = await fetch('http://localhost:8080/api/admin/ideas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${yourToken}` // If authentication token is required
          }
        });
        if (response.ok) {
          const data = await response.json();
          setIdeas(data); // Populate the table with real backend data
        }
      } catch (error) {
        console.error("Error fetching ideas from Spring Boot:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllIdeasFromBackend();
    */

    // Using mock data for client-side testing for now
    setIdeas(mockIdeas);
  }, []);

  // 3. Search & Filter logic (Executes simultaneously)
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.student.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="all-ideas-tab-viewport">
      
      {/* Search and Filter Action Bar */}
      <div className="tab-action-bar">
        <div className="search-box-wrapper">
          <FaSearch className="search-icon-inside" size={16} />
          <input 
            type="text" 
            placeholder="Search by title or student name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box-wrapper">
          <FaFilter className="filter-icon-inside" size={16} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 4. Rendering the table dynamically via props */}
      <div className="ideas-table-container-card">
        {isLoading ? (
          <div className="loading-spinner-zone">Loading data, please wait...</div>
        ) : (
          <RecentApplicationTable data={filteredIdeas} />
        )}
      </div>

    </div>
  );
};

export default AllIdeasTab;