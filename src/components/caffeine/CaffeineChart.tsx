import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CaffeineChartProps {
  data: Array<{
    date: string;
    amount: number;
    energy: number;
  }>;
}

export const CaffeineChart = ({ data }: CaffeineChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            yAxisId="left" 
            label={{ value: 'Caffeine (mg)', angle: -90, position: 'insideLeft' }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: 'Energy Level', angle: 90, position: 'insideRight' }} 
          />
          <Tooltip />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="amount" 
            stroke="#8884d8" 
            name="Caffeine Intake" 
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="energy" 
            stroke="#82ca9d" 
            name="Energy Level" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};