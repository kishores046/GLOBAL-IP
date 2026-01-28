import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  Dot,
} from 'recharts';

export interface ChartProps {
  data: any[];
  height?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  isDark?: boolean;
}

// Enterprise Color Palettes (light + dark variants)
const ENTERPRISE_COLORS = {
  primary: '#1E40AF',      // Indigo-900 (main charts)
  secondary: '#0369A1',    // Cyan-900 (secondary)
  tertiary: '#7C3AED',     // Violet-600 (comparison)
  success: '#059669',      // Emerald-600 (positive)
  warning: '#D97706',      // Amber-600 (caution)
  danger: '#DC2626',       // Red-600 (negative)
  neutral: '#64748B',      // Slate-600 (axis labels)
  light: '#E2E8F0',        // Slate-200 (gridlines)
};

const DARK_ENTERPRISE_COLORS = {
  primary: '#60A5FA',
  secondary: '#38BDF8',
  tertiary: '#C4B5FD',
  success: '#34D399',
  warning: '#F59E0B',
  danger: '#FB7185',
  neutral: '#94A3B8',
  light: '#334155',
};

// Palette for rankings and comparisons
const RANKING_COLORS = [
  '#1E40AF', '#0369A1', '#7C3AED', '#059669', '#D97706',
  '#DC2626', '#6366F1', '#0891B2', '#7C3AED', '#EC4899'
];

// Tooltip formatter helper
const formatTooltipValue = (value: any) => {
  if (typeof value === 'number') {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    if (value < 1) return value.toFixed(2);
    return value.toLocaleString();
  }
  return value;
};

export const LineChartComponent: React.FC<ChartProps & { dataKey: string; nameKey?: string; name?: string; dual?: boolean }> = ({
  data,
  height = 380,
  dataKey,
  nameKey = 'name',
  name,
  className,
  isDark = false,
}) => {
  const COLORS = isDark ? DARK_ENTERPRISE_COLORS : ENTERPRISE_COLORS;

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="0" stroke={COLORS.light} vertical={false} opacity={0.3} />
        <XAxis 
          dataKey={nameKey} 
          stroke={COLORS.neutral} 
          style={{ fontSize: '12px', fill: COLORS.neutral }}
          tick={{ fill: COLORS.neutral }}
        />
        <YAxis 
          stroke={COLORS.neutral}
          style={{ fontSize: '12px', fill: COLORS.neutral }}
          tick={{ fill: COLORS.neutral }}
          tickFormatter={formatTooltipValue}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0b1220' : '#1F2937',
            border: `1px solid ${COLORS.light}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
          formatter={(value: any) => [formatTooltipValue(value), name || dataKey]}
          cursor={{ stroke: COLORS.light, strokeWidth: 1 }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingBottom: '16px' }}
          iconType="line"
        />
        <Line
          type="natural"
          dataKey={dataKey}
          name={name || dataKey}
          stroke={COLORS.primary}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 6, fill: COLORS.primary }}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const AreaChartComponent: React.FC<ChartProps & { dataKey: string; nameKey?: string; benchmark?: number }> = ({
  data,
  height = 380,
  dataKey,
  nameKey = 'name',
  benchmark,
  className,
  isDark = false,
}) => {
  const COLORS = isDark ? DARK_ENTERPRISE_COLORS : ENTERPRISE_COLORS;

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
        <defs>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" stroke={COLORS.light} vertical={false} opacity={0.3} />
        <XAxis 
          dataKey={nameKey}
          stroke={COLORS.neutral}
          style={{ fontSize: '12px' }}
          tick={{ fill: COLORS.neutral }}
        />
        <YAxis 
          stroke={COLORS.neutral}
          style={{ fontSize: '12px' }}
          tick={{ fill: COLORS.neutral }}
          tickFormatter={formatTooltipValue}
        />
        {benchmark && (
          <ReferenceLine 
            y={benchmark}
            stroke={COLORS.warning}
            strokeDasharray="5 5"
            label={{ value: `Benchmark: ${formatTooltipValue(benchmark)}`, position: 'insideTopLeft', offset: -10, fill: COLORS.warning, fontSize: 12 }}
          />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0b1220' : '#1F2937',
            border: `1px solid ${COLORS.light}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
          formatter={(value: any) => [formatTooltipValue(value), dataKey]}
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)' }}
        />
        <Area
          type="natural"
          dataKey={dataKey}
          fill="url(#fillGradient)"
          stroke={COLORS.primary}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BarChartComponent: React.FC<ChartProps & { dataKey: string; nameKey?: string; horizontal?: boolean; ranked?: boolean }> = ({
  data,
  height = 380,
  dataKey,
  nameKey = 'name',
  horizontal = false,
  ranked = false,
  className,
  isDark = false,
}) => {
  const COLORS = isDark ? DARK_ENTERPRISE_COLORS : ENTERPRISE_COLORS;
  // Add ranking to data if requested
  const rankedData = ranked ? data.map((item, idx) => ({ ...item, rank: idx + 1 })) : data;
  
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <BarChart
        data={rankedData}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={horizontal ? { top: 20, right: 30, left: 220, bottom: 40 } : { top: 20, right: 30, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="0" stroke={COLORS.light} vertical={!horizontal} opacity={0.3} />
        {horizontal ? (
          <>
            <XAxis 
              type="number" 
              stroke={COLORS.neutral}
              style={{ fontSize: '12px' }}
              tick={{ fill: COLORS.neutral }}
              tickFormatter={formatTooltipValue}
            />
            <YAxis 
              type="category" 
              dataKey={nameKey}
              stroke={COLORS.neutral}
              style={{ fontSize: '11px' }}
              tick={{ fill: COLORS.neutral }}
              width={200}
            />
          </>
        ) : (
          <>
            <XAxis 
              dataKey={nameKey}
              stroke={COLORS.neutral}
              style={{ fontSize: '12px' }}
              tick={{ fill: COLORS.neutral }}
            />
            <YAxis 
              stroke={COLORS.neutral}
              style={{ fontSize: '12px' }}
              tick={{ fill: COLORS.neutral }}
              tickFormatter={formatTooltipValue}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0b1220' : '#1F2937',
            border: `1px solid ${COLORS.light}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
          formatter={(value: any) => [formatTooltipValue(value), dataKey]}
          cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)' }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingBottom: '16px' }}
        />
        <Bar 
          dataKey={dataKey} 
          fill={COLORS.primary}
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DonutChartComponent: React.FC<ChartProps & { dataKey: string; nameKey?: string }> = ({
  data,
  height = 480,
  dataKey,
  nameKey = 'name',
  className,
  isDark = false,
}) => {
  const COLORS = isDark ? DARK_ENTERPRISE_COLORS : ENTERPRISE_COLORS;
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="45%"
          cy="50%"
          labelLine={true}
          label={(entry) => {
            const percentage = ((entry[dataKey] / total) * 100).toFixed(1);
            return percentage !== '0.0' ? `${percentage}%` : '';
          }}
          innerRadius={90}
          outerRadius={160}
          fill={COLORS.primary}
          dataKey={dataKey}
          nameKey={nameKey}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={RANKING_COLORS[index % RANKING_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [formatTooltipValue(value), 'Count']}
          contentStyle={{
            backgroundColor: isDark ? '#0b1220' : '#1F2937',
            border: `1px solid ${COLORS.light}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
        />
        <Legend 
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ paddingTop: '24px', maxHeight: '120px', overflow: 'auto' }}
          layout="vertical"
          align="right"
        />
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-900">{formatTooltipValue(total)}</div>
          <div className="text-sm text-slate-500 mt-2">Total</div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export const PieChartComponent: React.FC<ChartProps & { dataKey: string; nameKey?: string }> = ({
  data,
  height = 480,
  dataKey,
  nameKey = 'name',
  className,
  isDark = false,
}) => (
  <ResponsiveContainer width="100%" height={height} className={className}>
    <PieChart>
      <Pie
        data={data}
        cx="45%"
        cy="50%"
        labelLine={true}
        label={(entry) => {
          const percent = (entry[dataKey] / data.reduce((sum, item) => sum + (item[dataKey] || 0), 0)) * 100;
          return percent >= 2 ? `${(percent).toFixed(0)}%` : '';
        }}
        outerRadius={160}
        fill={isDark ? DARK_ENTERPRISE_COLORS.primary : ENTERPRISE_COLORS.primary}
        dataKey={dataKey}
        nameKey={nameKey}
        startAngle={90}
        endAngle={-270}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={RANKING_COLORS[index % RANKING_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: any) => [formatTooltipValue(value), 'Count']}
        contentStyle={{
          backgroundColor: isDark ? '#0b1220' : '#1F2937',
          border: `1px solid ${isDark ? DARK_ENTERPRISE_COLORS.light : ENTERPRISE_COLORS.light}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
        }}
        labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
      />
      <Legend
        verticalAlign="bottom"
        height={36}
        wrapperStyle={{ paddingTop: '24px', maxHeight: '120px', overflow: 'auto' }}
        layout="vertical"
        align="right"
      />
    </PieChart>
  </ResponsiveContainer>
);

export const MultiLineChartComponent: React.FC<ChartProps & { dataKeys: string[] }> = ({
  data,
  height = 380,
  dataKeys,
  className,
  isDark = false,
}) => {
  const COLORS = isDark ? DARK_ENTERPRISE_COLORS : ENTERPRISE_COLORS;
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="0" stroke={COLORS.light} vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="name" 
          stroke={COLORS.neutral}
          style={{ fontSize: '12px' }}
          tick={{ fill: COLORS.neutral }}
        />
        <YAxis 
          stroke={COLORS.neutral}
          style={{ fontSize: '12px' }}
          tick={{ fill: COLORS.neutral }}
          tickFormatter={formatTooltipValue}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#0b1220' : '#1F2937',
            border: `1px solid ${COLORS.light}`,
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}
          formatter={(value: any) => formatTooltipValue(value)}
          cursor={{ stroke: COLORS.light, strokeWidth: 1 }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
          wrapperStyle={{ paddingBottom: '16px' }}
          iconType="line"
        />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="natural"
            dataKey={key}
            name={key.replace(/([A-Z])/g, ' $1').trim()}
            stroke={RANKING_COLORS[index % RANKING_COLORS.length]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export { ENTERPRISE_COLORS, RANKING_COLORS };
