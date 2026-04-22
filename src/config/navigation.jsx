import { 
  FaThLarge, FaUsers, FaUserTie, FaTags, 
  FaLightbulb, FaChartBar, FaCog 
} from 'react-icons/fa';

export const adminLinks = [
  { name: 'Overview', path: '/admin/dashboard', icon: <FaThLarge /> },
  { name: 'Manage Users', path: '/admin/users', icon: <FaUsers /> },
  { name: 'Manage Committees', path: '/admin/committees', icon: <FaUserTie /> },
  { name: 'Manage Categories', path: '/admin/categories', icon: <FaTags /> },
  { name: 'All Ideas', path: '/admin/ideas', icon: <FaLightbulb /> },
  { name: 'Reports & Statistics', path: '/admin/reports', icon: <FaChartBar /> },
  { name: 'System Settings', path: '/admin/settings', icon: <FaCog /> },
];