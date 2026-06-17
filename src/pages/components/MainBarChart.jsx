// src/pages/admin/components/MainBarChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MainBarChart = ({ data = [], color = "#3b82f6" }) => {
  
  // ۱. ساخت بیس ثابت ۱۲ ماه سال با مقدار پیش‌فرض صفر
  const fullYearBase = [
    { name: 'JAN', inventions: 0 },
    { name: 'FEB', inventions: 0 },
    { name: 'MAR', inventions: 0 },
    { name: 'APR', inventions: 0 },
    { name: 'MAY', inventions: 0 },
    { name: 'JUN', inventions: 0 },
    { name: 'JUL', inventions: 0 },
    { name: 'AUG', inventions: 0 },
    { name: 'SEP', inventions: 0 },
    { name: 'OCT', inventions: 0 },
    { name: 'NOV', inventions: 0 },
    { name: 'DEC', inventions: 0 },
  ];

  // لیست آرایه ماه‌ها برای تبدیل حالت‌های عددی بک‌اِند
  const monthsArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // ۲. ترکیب هوشمند و ضد باگ دیتای زنده بک‌اِند با لیست ۱۲ ماهه سال
  const chartDataCombined = fullYearBase.map(monthObj => {
    let totalInventionsForThisMonth = 0;

    data.forEach(d => {
      if (!d.day) return;

      let extractedMonthName = "";

      // 🔥 متد ضد باگ برای استخراج ماه:
      // حالت اول: اگر بک‌اِند تاریخ کامل فرستاده باشد (مثل "2026-06-11")
      const dateJson = new Date(d.day);
      if (!isNaN(dateJson.getTime())) {
        extractedMonthName = dateJson.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        // اصلاح نام جزیی برای هماهنگی (مثلا JUNE به JUN)
        if (extractedMonthName === 'JUNE') extractedMonthName = 'JUN';
        if (extractedMonthName === 'JULY') extractedMonthName = 'JUL';
      } else {
        // حالت دوم: اگر بک‌اِند متن خام یا فرمت خاص فرستاده باشد، از روی متن چک می‌کنیم
        const dayStr = String(d.day).toLowerCase();
        if (dayStr.includes('-01-') || dayStr.startsWith('01') || dayStr.includes('jan')) extractedMonthName = 'JAN';
        else if (dayStr.includes('-02-') || dayStr.startsWith('02') || dayStr.includes('feb')) extractedMonthName = 'FEB';
        else if (dayStr.includes('-03-') || dayStr.startsWith('03') || dayStr.includes('mar')) extractedMonthName = 'MAR';
        else if (dayStr.includes('-04-') || dayStr.startsWith('04') || dayStr.includes('apr')) extractedMonthName = 'APR';
        else if (dayStr.includes('-05-') || dayStr.startsWith('05') || dayStr.includes('may')) extractedMonthName = 'MAY';
        else if (dayStr.includes('-06-') || dayStr.startsWith('06') || dayStr.includes('jun')) extractedMonthName = 'JUN';
        else if (dayStr.includes('-07-') || dayStr.startsWith('07') || dayStr.includes('jul')) extractedMonthName = 'JUL';
        else if (dayStr.includes('-08-') || dayStr.startsWith('08') || dayStr.includes('aug')) extractedMonthName = 'AUG';
        else if (dayStr.includes('-09-') || dayStr.startsWith('09') || dayStr.includes('sep')) extractedMonthName = 'SEP';
        else if (dayStr.includes('-10-') || dayStr.startsWith('10') || dayStr.includes('oct')) extractedMonthName = 'OCT';
        else if (dayStr.includes('-11-') || dayStr.startsWith('11') || dayStr.includes('nov')) extractedMonthName = 'NOV';
        else if (dayStr.includes('-12-') || dayStr.startsWith('12') || dayStr.includes('dec')) extractedMonthName = 'DEC';
      }

      // اگر ماهِ این دیتای بک‌اِند با ماهِ حلقه‌ی ما برابر بود، مقدار را جمع بزند
      if (extractedMonthName === monthObj.name) {
        totalInventionsForThisMonth += Number(d.inventions || 0);
      }
    });

    return { ...monthObj, inventions: totalInventionsForThisMonth };
  });

  return (
    <div className="main-chart-wrapper">
      <h4 className="chart-heading">Inventions in One Year (Full Timeline)</h4>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartDataCombined} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />

          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
            contentStyle={{ 
              borderRadius: '10px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)'
            }}
          />

          <Bar 
            dataKey="inventions" 
            fill={color} 
            radius={[6, 6, 0, 0]} 
            barSize={25} 
            animationDuration={1500} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainBarChart;