// src/pages/admin/components/MainAreaChart.jsx
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MainAreaChart = ({ data = [], color = "#10b981", title = "Daily Inventions (30 Days Timeline)" }) => {
  
  // ۱. ساخت یک بیس ثابت برای ۳۰ روز اخیر (از روز ۱ تا ۳۰) با مقدار پیش‌فرض صفر
  const last30DaysBase = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    return {
      displayDay: `Day ${dayNumber}`, // کلمه‌ای که روی محور X نشان داده می‌شود
      dayNum: dayNumber,
      inventions: 0
    };
  });

  // ۲. تزریق و مپ کردن دیتای واقعی بک‌اِند روی روزهای متناظر
  const chartDataCombined = last30DaysBase.map(dayObj => {
    // پیدا کردن دیتای بک‌اِند که روز آن با روز این حلقه برابر باشد
    const foundData = data.find(d => {
      if (!d.day) return false;
      
      // استخراج شماره روز از تاریخ بک‌اِند (مثلاً از "2026-06-11" عدد 11 را می‌کشد بیرون)
      const dateJson = new Date(d.day);
      return dateJson.getDate() === dayObj.dayNum;
    });

    if (foundData) {
      // اگر در این روز اختراعی بود، مقدار واقعی را قرار بده
      return { ...dayObj, inventions: foundData.inventions };
    }
    return dayObj; // در غیر این صورت مقدار همان صفر باقی می‌ماند و روز گم نمی‌شود
  });

  return (
    <div className="chart-container-box">
      <h4 className="chart-title-text">{title}</h4>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartDataCombined} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWaveGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

          {/* محور افقی اکنون تمام ۳۰ روز را کامل رندر می‌کند */}
          <XAxis 
            dataKey="displayDay" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={4} // برای اینکه شماره روزها شلوغ نشوند، ۵ روز یک‌بار عنوان را چاپ می‌کند
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />

          {/* تولتیپ زنده: روی روزهای بدون دیتا هم مقدار 0 را نشان می‌دهد */}
          <Tooltip 
            contentStyle={{ 
                borderRadius: '10px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-primary)'
            }}
          />

          <Area 
            type="monotone" 
            dataKey="inventions"  
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