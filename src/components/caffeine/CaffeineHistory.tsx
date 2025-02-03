import { Coffee } from "lucide-react";

interface CaffeineHistoryProps {
  history: Array<{
    id: string;
    activity_name: string;
    energy_rating: number;
    created_at: string;
  }>;
}

export const CaffeineHistory = ({ history }: CaffeineHistoryProps) => {
  return (
    <div className="space-y-4">
      {history?.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between border-b pb-2"
        >
          <div className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{log.activity_name}</p>
              <p className="text-sm text-muted-foreground">
                Energy Level: {log.energy_rating}/10
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(log.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      {(!history || history.length === 0) && (
        <p className="text-center text-muted-foreground">
          No caffeine intake logged yet
        </p>
      )}
    </div>
  );
};