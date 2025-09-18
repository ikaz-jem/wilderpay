'use client';
import { LineChart, Line, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import BorderEffect from '../BorderEffect/BorderEffect';
import Loading from '@/app/components/Loading';

const COLORS = ['#10b981']; // Green for the line

const EarningsOverTimeLineChart = ({ earningsData }) => {
  if (!earningsData) return <Loading />;

  const formattedData = formatEarningsData(earningsData);

  if (formattedData.length === 0) {
    return (
      <div className='flex flex-col gap-3 w-full'>
        <div className="w-full h-40 rounded-lg border border-accent/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
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
      <div className="w-full h-60 rounded-xl border border-accent/10 py-5 bg-card relative overflow-hidden backdrop-blur-xl">
    <p className='text-xs text-center'>Last 7 Days</p>
        {/* <BorderEffect /> */}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fill: 'var(--primary)', fontSize: '0.7rem' }} />

            <YAxis tick={{ fill: 'var(--primary)', fontSize: '0.7rem' }} />
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
            <Line
              type="monotone"
              dataKey="percentage"
              stroke={'var(--highlight)'}
              strokeWidth={2}
              dot={{ r: 3, fill: 'var(--highlight)' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function formatEarningsData(earningsData) {
  return earningsData.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    percentage: item.percentage,
  }));
}

export default EarningsOverTimeLineChart;
