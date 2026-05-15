import { 
  FaThLarge, FaUsers, FaUserTie, FaTags, 
  FaLightbulb, FaChartBar, FaCog 
} from 'react-icons/fa';

export const adminLinks = [
  { name: 'Overview', path: '/admin', icon: <FaThLarge /> },
  { name: 'Manage Users', path: '/admin/users', icon: <FaUsers /> },
  { name: 'Manage Committees', path: '/admin/committees', icon: <FaUserTie /> },
  { name: 'All Ideas', path: '/admin/Innovations', icon: <FaLightbulb /> },
  { name: 'Reports & Statistics', path: '/admin/reports', icon: <FaChartBar /> },
  { name: 'System Settings', path: '/admin/settings', icon: <FaCog /> },
];