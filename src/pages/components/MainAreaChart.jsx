import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Notice: We removed the const data = [...] from here!
// We pass 'data' and 'title' as props now.
const MainAreaChart = ({ data, color = "#10b981", title = "Daily Inventions (30 Days)" }) => {
  return (
    <div className="chart-container-box">
      <h4 className="chart-title-text">{title}</h4>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWaveGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval={4} 
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />

          <Tooltip 
            contentStyle={{ 
                borderRadius: '10px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: 'var(--card-bg)', // This helps with Dark Mode!
                color: 'var(--text-primary)'
            }}
          />

          <Area 
            type="monotone" 
            dataKey="inventions"  /* Changed from 'active' to 'inventions' */
            stroke={color} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorWaveGreen)" 
            animationDuration={2000} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainAreaChart;