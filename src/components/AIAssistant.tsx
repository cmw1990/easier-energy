import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  type: 'analyze_sleep' | 'analyze_energy' | 'analyze_focus' | 'daily_summary' | 'sleep_recommendations' | 'sleep_pattern_analysis' | 'sleep_quality_prediction';
  data: any;
}

export const AIAssistant = ({ type, data }: AIAssistantProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const { data: response, error } = await supabase.functions.invoke('ai-assistant', {
        body: { type, data }
      });

      if (error) throw error;
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      toast({
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get AI Analysis'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {analysis}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setAnalysis(null)}
              size="sm"
            >
              Get New Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};