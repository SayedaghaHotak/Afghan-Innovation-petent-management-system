import React from 'react';
import './RecentApplicationsTable.css';

const RecentApplicationsTable = ({ data, title }) => {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>{title}</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Innovetion Title</th>
              <th>Innovetor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td className="item-title">{app.title}</td>
                <td>{app.innovetor}</td>
                <td>{app.date}</td>
                <td>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsTable;