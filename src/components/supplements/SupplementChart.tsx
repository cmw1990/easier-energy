import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function SupplementChart({ data = [] }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No data available for visualization
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="effectiveness_rating" stroke="#8884d8" name="Effectiveness" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}