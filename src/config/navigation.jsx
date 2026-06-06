import { FaThLarge, FaUsers, FaUserTie, FaTags, FaLightbulb, FaChartBar, FaCog } from 'react-icons/fa';
import { FaChartPie, FaPlusCircle,  FaBell, FaUserCog } from 'react-icons/fa';

export const adminLinks = [
  { name: 'Overview', path: '/admin', icon: <FaThLarge /> },
  { name: 'Manage Users', path: '/admin/users', icon: <FaUsers /> },
  { name: 'Manage Committees', path: '/admin/committees', icon: <FaUserTie /> },
  { name: 'All Ideas', path: '/admin/Innovations', icon: <FaLightbulb /> },
  { name: 'Reports & Statistics', path: '/admin/reports', icon: <FaChartBar /> },
  { name: 'System Settings', path: '/admin/settings', icon: <FaCog /> },
];



export const userLinks = [
  { name: 'Dashboard Home', path: '/user-dashboard', icon: <FaChartPie /> },
  { name: 'Submit New Idea', path: '/user-dashboard/submit', icon: <FaPlusCircle /> },
  { name: 'My Ideas', path: '/user-dashboard/my-ideas', icon: <FaLightbulb /> },
  { name: 'Notifications', path: '/user-dashboard/notifications', icon: <FaBell /> },
  { name: 'Profile Settings', path: '/user-dashboard/profile', icon: <FaUserCog /> },
];