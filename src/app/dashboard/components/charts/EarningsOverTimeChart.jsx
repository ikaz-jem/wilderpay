'use client';
import { BarChart, Bar, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import BorderEffect from '../BorderEffect/BorderEffect';
import Loading from '@/app/components/Loading';

// Custom Colors (same as your previous chart)
const COLORS = ['#10b981']; // Green for percentage bars

const EarningsOverTimeChart = ({ earningsData }) => {
  if (!earningsData) return <Loading />;

  // Format the earnings data
  const formattedData = formatEarningsData(earningsData);

  if (formattedData.length === 0) {
    return (
      <div className='flex flex-col gap-3 w-full'>
        <div className="w-full h-96 rounded-lg border border-primary/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
          <BorderEffect />
          <div className='flex items-center justify-center w-full h-full'>
            <p className='text-xs'>No earnings data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 w-full'>
      <div className="w-full h-96 rounded-lg border border-primary/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
        <BorderEffect />

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
            <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: '0.75rem' }} />
            <YAxis tick={{ fill: '#fff', fontSize: '0.75rem' }} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Percentage Change']}
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #ffffff44',
                color: '#fff',
                backdropFilter: 'blur(6px)',
                fontSize: '0.75rem',
              }}
              labelStyle={{ color: '#fff', fontSize: '0.75rem' }}
              itemStyle={{ color: '#fff', fontSize: '0.75rem' }}
            />
            <Legend wrapperStyle={{ color: '#fff', fontSize: '0.75rem' }} />
            <Bar
              dataKey="percentage"
              fill={COLORS[0]} // Default fill color for bars
              barSize={20}
              // Disable hover effect completely by setting the activeDot to false
        
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper function to format the earnings data
function formatEarningsData(earningsData) {
  return earningsData.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    percentage: item.percentage, // Directly using the percentage from the data
  }));
}

export default EarningsOverTimeChart;
