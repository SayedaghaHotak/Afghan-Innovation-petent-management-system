import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts'; // اضافه کردن ابزار گراف
import './StatCard.css';

const StatCard = ({ title, value, icon, color, percentage, trend }) => {
  // دیتای فرضی برای ایجاد شکل موج (Snake/Wave form)
  const chartData = [
    { uv: 5 }, { uv: 40 }, { uv: 20 }, { uv: 60 }, { uv: 40 }, { uv: 70 }, { uv: 80 }
  ];

  return (
    <div className="stat-card" style={{ borderBottom: `4px solid ${color}` }}>
      <div className="stat-header">
        <div className="stat-title">{title}</div>
        <div className="stat-icon" style={{ backgroundColor: `${color}1A`, color: color }}>
          {icon}
        </div>
      </div>
      
      <div className="stat-body">
        <h3 className="stat-value">{value}</h3>
        
        {/* تبدیل نوار پیشرفت به گراف موجی (Sparkline) */}
        <div className="stat-chart-wrapper">
          <ResponsiveContainer width="100%" height={25}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`colorUv-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="uv" 
                stroke={color} 
                fillOpacity={1} 
                fill={`url(#colorUv-${color})`} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="stat-footer">
          <span className="stat-percentage" style={{ color: color }}>{percentage}%</span>
          {trend && <div className="stat-trend">{trend}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;