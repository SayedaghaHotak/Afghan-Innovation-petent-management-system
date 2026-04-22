import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ links = [] }) => {
  return (
    <aside className="sidebar">
      {/* ۱. بخش هدر یا لوگو (اگر خواستی لوگو را دوباره فعال کنی) */}
      <div className="sidebar-header">
        <h1 className="aims-logo" style={{color: 'var(--accent-color)', fontSize: '1.5rem', margin: '0'}}>AIMS</h1>
      </div>

      {/* ۲. ناویگیشن (لیست منوها) */}
      <nav className="sidebar-nav">
        {links?.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;