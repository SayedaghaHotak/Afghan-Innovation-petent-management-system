import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import  './MainBarChart.css';


const data = [
{month:'JAN' , count:5},
{month:'FEB' , count:10},
{month:'MAR' , count:15},
{month:'APR' , count:20},
{month:'MAY' , count:25},
{month:'JUNE' , count:30},
{month:'JULY' , count:35},
{month:'AUG' , count:40},
{month:'SEP' , count:45},
{month:'OCT' , count:50},
{month:'NAV' , count:50},
{month:'DES' , count:50},
];

const MainBarChart = ({color ="#3b82f6" })=>{
    return(
        <div className="main-chart-wrapper">
            <h4 className="chart-heading ">Innovation in one Year </h4>

            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                
               
             

                {/* ۵. خطوط راهنما (فقط افقی برای خلوت شدن صفحه) */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                {/* ۶. تنظیمات محورهای X و Y */}
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />

                {/* ۷. تولتیپ (نمایش معلومات وقتی ماوس روی گراف می‌رود) */}
                <Tooltip 
                    cursor={{fill: 'rgba(0, 0, 0, 0.05)'}} // وقتی روی ستون می‌روی پشتش سایه می‌افتد
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />

                {/* ۸. خودِ گراف ماری اصلی */}
                <Bar 
                  
                    dataKey="count" 
                    fill={color} 
                    radius={[6, 6, 0, 0] }
                    barSize={40} 
                    
                    animationDuration={1500} // انیمیشن نرم هنگام لود شدن
                />
                </BarChart>
            </ResponsiveContainer>
        </div>

    );
};
export default MainBarChart;
   