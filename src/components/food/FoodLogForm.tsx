import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

export const FoodLogForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "";
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('food-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('food-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;

        // Analyze the food image
        setIsAnalyzing(true);
        const { data: analysisData, error: analysisError } = await supabase.functions
          .invoke('analyze-food', {
            body: { imageUrl, mealType }
          });

        if (analysisError) throw analysisError;

        const nutritionData = JSON.parse(analysisData.analysis);

        // Log the food entry with AI analysis
        const { error: logError } = await supabase
          .from('food_logs')
          .insert({
            food_name: foodName || nutritionData.foods.join(', '),
            calories: calories || nutritionData.calories,
            protein_grams: nutritionData.protein,
            carbs_grams: nutritionData.carbs,
            fat_grams: nutritionData.fat,
            meal_type: mealType,
            image_url: imageUrl,
            ai_analysis: JSON.stringify(nutritionData)
          });

        if (logError) throw logError;

        toast({
          title: "Success",
          description: "Food logged successfully with AI analysis",
        });

        // Reset form
        setFoodName("");
        setCalories("");
        setMealType("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error logging food:', error);
      toast({
        title: "Error",
        description: "Failed to log food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="foodName">Food Name</Label>
        <Input
          id="foodName"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="e.g., Grilled Chicken Salad"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="calories">Calories (optional)</Label>
        <Input
          id="calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="e.g., 500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mealType">Meal Type</Label>
        <Select value={mealType} onValueChange={setMealType}>
          <SelectTrigger>
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="foodImage">Food Image (for AI analysis)</Label>
        <Input
          id="foodImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isUploading || isAnalyzing || (!foodName && !selectedFile) || !mealType}
      >
        {isUploading || isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isAnalyzing ? 'Analyzing...' : 'Uploading...'}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Log Food
          </>
        )}
      </Button>
    </form>
  );
};