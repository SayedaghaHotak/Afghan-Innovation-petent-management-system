import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { adminLinks } from '../../config/navigation'; // Import the properties we created

const AdminDashboard = () => {
  // We can also define a temporary user profile object here
  const adminProfile = {
    name: "Hotak",
    role: "Admin",
    avatar: "" // Leave empty to use the placeholder
  };

  return (
    <DashboardLayout links={adminLinks} userProfile={adminProfile}>
      {/* Everything inside here is the "children" prop */}
      <div className="admin-content">
        <h2>Admin Overview</h2>
        <p>Welcome to the AIMS Management System. Here you can monitor all ideas and users.</p>
        
        {/* Soon we will add your Stats Cards here */}
        <div style={{ marginTop: '20px', padding: '20px', border: '1px dashed #ccc' }}>
          Stats Cards Placeholder
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;