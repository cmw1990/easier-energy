import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Recovery() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recovery Progress</h1>
        <Button variant="outline" onClick={() => navigate('/sobriety')}>
          Back to Dashboard
        </Button>
      </div>
      <p>Recovery tracking feature coming soon...</p>
    </div>
  );
}