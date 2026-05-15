import React from 'react';
import { FaSearch, FaFilter, FaEllipsisV } from 'react-icons/fa';

const CommitteeTable = ({ data, onSelectCommittee, setSearchTerm, setFilterType, onDeleteCommittee }) => {
  return (
    <div className="table-inner">
      <div className="table-controls">
        <div className="search-wrapper">
          <FaSearch className='input-icon'/>
          <input 
            type="text" 
            placeholder="Search name or chair..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-wrapper">
          <FaFilter className='input-icon' />
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Health">Health</option>
            <option value="Environment">Environment</option>
          </select>
        </div>
      </div>

      <table className="modern-table">
        <thead>
          <tr>
            <th>COMMITTEE</th>
            <th>CHAIRPERSON</th>
            <th>MEMBERS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} onClick={() => onSelectCommittee(item)} className="row-hover">
              <td>
                <div className="info-cell">
                  <div className={`dot ${item.type}`}></div>
                  <div>
                    <div className="primary-txt">{item.name}</div>
                    <div className="secondary-txt">{item.subCategory}</div>
                  </div>
                </div>
              </td>
              <td className="chair-txt">{item.chair}</td>
              {/* اینجا اصلاح شد: نمایش تعداد اعضا برای جلوگیری از ارور */}
              <td>
                <span className="badge-qty">
                  {Array.isArray(item.members) ? item.members.length : 0} Members
                </span>
              </td>
              <td>
                <button className="more-btn" onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCommittee(item.id);
                }}>
                  <FaEllipsisV />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommitteeTable;