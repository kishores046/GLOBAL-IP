import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", filings: 45 },
  { name: "Tue", filings: 62 },
  { name: "Wed", filings: 58 },
  { name: "Thu", filings: 78 },
  { name: "Fri", filings: 85 },
  { name: "Sat", filings: 42 },
  { name: "Sun", filings: 38 },
];

export function TrendChart() {
  return (
    <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl text-slate-900 mb-2">Weekly Filing Trends</h3>
        <p className="text-slate-600">Patent and trademark filing activity</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFilings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.2)" />
            <XAxis dataKey="name" stroke="rgba(30,30,30,0.7)" />
            <YAxis stroke="rgba(30,30,30,0.7)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                color: "#1e293b",
              }}
            />
            <Area
              type="monotone"
              dataKey="filings"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#colorFilings)"
              animationDuration={2000}
              animationBegin={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}