import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; 
import './DashboardLayout.css';

const DashboardLayout = ({ children, links, userProfile, pageTitle, userName }) => {
  return (
    <div className="dashboard-wrapper" style={{ display: 'flex' }}>
     
      <Sidebar links={links} userProfile={userProfile} />

      <div className="main-area" style={{ flex: 1, marginLeft: '188px' }}>
  
      
        <Navbar pageTitle={pageTitle} userProfile={userProfile} userName={userName} />

        <main className="content-area" style={{ padding: '25px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;