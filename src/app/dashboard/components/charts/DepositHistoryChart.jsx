'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#14b8a6'];

const DepositHistoryChart = ({ user }) => {
  const data = formatDepositsByDate(user.deposits);

  // get list of unique currencies for rendering lines
  const currencies = Array.from(
    new Set(user.deposits.map((d) => d.currency.toUpperCase()))
  );

  return (
    <div className="w-full h-96 rounded-lg border border-primary/10 py-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
          <XAxis dataKey="date" stroke="#fff" />
          {/* <YAxis stroke="#fff" tickFormatter={(v) => `${v}`} /> */}
          <Tooltip
            formatter={(value, name) => [`${value}`, name]}
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #ffffff44',
              color: '#fff',
              fontSize: '0.75rem',
            }}
            labelStyle={{ color: '#fff', fontSize: '0.75rem' }}
            itemStyle={{ color: '#fff', fontSize: '0.75rem' }}
          />
          <Legend wrapperStyle={{ color: '#fff', fontSize: '0.75rem' }} />

          {currencies.map((currency, index) => (
            <Line
              key={currency}
              type="monotone"
              dataKey={currency}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function formatDepositsByDate(deposits) {
  const grouped = {};

  deposits.forEach((d) => {
    const date = new Date(d.createdAt).toLocaleDateString();
    const currency = d.currency.toUpperCase();

    if (!grouped[date]) grouped[date] = {};
    if (!grouped[date][currency]) grouped[date][currency] = 0;

    grouped[date][currency] += d.amount;
  });

  return Object.entries(grouped)
    .map(([date, currencies]) => ({ date, ...currencies }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default DepositHistoryChart;
