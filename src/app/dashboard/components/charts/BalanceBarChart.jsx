import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BalanceBarChart = ({ data }) => (
  <div className="w-full h-96 rounded-lg border border-primary/10 py-5">
    <h2 className="text-xl font-semibold mb-4 !text-neutral">Balance Breakdown</h2>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="var(--primary)" stopOpacity={0.8} />
            <stop offset="90%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="date" stroke="#ffffffaa" className="text-xs" />
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid #ffffff44',
            color: '#fff',
            backdropFilter: 'blur(6px)',
          }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
          formatter={(value, name) => [`$${value}`, name === "returns" ? "Daily Return" : name === "totalReturns" ? "Cumulative Return" : "Balance"]}
        />

        <Legend wrapperStyle={{ color: '#fff' }} />
        
        <Bar dataKey="balance" fill="url(#balanceGradient)" stroke="#4f46e5" strokeWidth={1} radius={[4, 4, 0, 0]} />
        <Bar dataKey="returns" fill="#16a34a" />
        <Bar dataKey="totalReturns" fill="#facc15" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BalanceBarChart;
