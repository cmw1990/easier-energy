import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Coffee, Zap } from "lucide-react";

interface CaffeineChartProps {
  data: Array<{
    date: string;
    amount: number;
    energy: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg">
      <p className="font-medium mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          <span>{payload[0].value}mg caffeine</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span>Energy level: {payload[1].value}/10</span>
        </div>
      </div>
    </div>
  );
};

export const CaffeineChart = ({ data }: CaffeineChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            yAxisId="left" 
            label={{ 
              value: 'Caffeine (mg)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ 
              value: 'Energy Level', 
              angle: 90, 
              position: 'insideRight',
              style: { textAnchor: 'middle' }
            }}
            domain={[0, 10]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="amount" 
            stroke="#ee9ca7"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Caffeine Intake" 
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="energy" 
            stroke="#6b8cce"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            name="Energy Level" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};