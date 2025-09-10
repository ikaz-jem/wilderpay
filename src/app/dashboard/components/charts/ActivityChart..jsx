import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jan', deposits: 1000, withdrawals: 500 },
  { month: 'Feb', deposits: 1200, withdrawals: 700 },
  { month: 'Mar', deposits: 800, withdrawals: 300 },
  { month: 'Apr', deposits: 1400, withdrawals: 1200 },
  { month: 'May', deposits: 1600, withdrawals: 900 },
  { month: 'june', deposits: 500, withdrawals: 200 },
];

const ActivityChart = () => (
  <div className="w-full h-96  rounded-lg border border-primary/10 py-5">
    <h2 className="text-xl font-semibold mb-4 text-white" >Activity</h2>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#ffffffaa" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid #ffffff44',
            color: '#fff',
            backdropFilter: 'blur(6px)',
          }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Bar dataKey="deposits" stackId="a" fill="var(--primary)" className='opacity-80' radius={[4, 4, 0, 0]} />
        <Bar dataKey="withdrawals" stackId="a" fill="var(--accent)" className='opacity-80' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ActivityChart;
