import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HistoricalChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  formatValue?: (value: any) => string;
  timeframe?: 'daily' | 'monthly';
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
  dataKeys,
  colors,
  formatValue = (value) => value.toLocaleString(),
  timeframe = 'monthly',
}) => {
  const formatXAxis = (tickItem: string) => {
    if (timeframe === 'daily') {
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      const date = new Date(tickItem + '-01');
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  const formatTooltipValue = (value: any, name: string) => {
    const formattedValue = formatValue(value);
    const formattedName = name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/long/gi, 'Long-Form')
      .replace(/shorts/gi, 'Shorts')
      .replace(/est revenue/gi, 'Revenue')
      .replace(/views/gi, 'Views');
    
    return [formattedValue, formattedName];
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey={timeframe === 'daily' ? 'date' : 'month'} 
            tick={{ fontSize: 12 }}
            tickFormatter={formatXAxis}
            stroke="#666"
            interval={timeframe === 'daily' ? 2 : 0}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatValue(value)}
            stroke="#666"
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={(label) => formatXAxis(label)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'hsl(var(--card-foreground))',
            }}
          />
          <Legend 
            formatter={(value: string) => 
              value
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str: string) => str.toUpperCase())
                .replace(/long/gi, 'Long-Form')
                .replace(/shorts/gi, 'Shorts')
                .replace(/est revenue/gi, 'Revenue')
                .replace(/views/gi, 'Views')
            }
          />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;