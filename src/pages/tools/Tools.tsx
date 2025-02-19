import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Grid3X3, Brain, Dumbbell, Eye, TestTube } from "lucide-react";

const toolsList = [
  {
    title: "Word Scramble",
    description: "Test and improve your vocabulary skills",
    path: "/tools/word-scramble",
    icon: Grid3X3,
  },
  {
    title: "Color Match",
    description: "Challenge your visual processing speed",
    path: "/tools/color-match",
    icon: Eye,
  },
  {
    title: "Brain Match",
    description: "Exercise your pattern recognition",
    path: "/tools/brain-match",
    icon: Brain,
  },
  {
    title: "Memory Cards",
    description: "Enhance your memory capacity",
    path: "/tools/memory-cards",
    icon: Brain,
  },
  {
    title: "Mental Rotation",
    description: "Improve spatial reasoning",
    path: "/tools/mental-rotation",
    icon: Dumbbell,
  },
  {
    title: "Sequence Memory",
    description: "Boost your working memory",
    path: "/tools/sequence-memory",
    icon: Brain,
  },
  {
    title: "N-Back",
    description: "Train your working memory",
    path: "/tools/n-back",
    icon: Brain,
  },
  {
    title: "Dual N-Back",
    description: "Advanced memory training",
    path: "/tools/dual-n-back",
    icon: Brain,
  },
  {
    title: "Pattern Recognition",
    description: "Enhance cognitive pattern matching",
    path: "/tools/pattern-recognition",
    icon: Grid3X3,
  },
  {
    title: "Speed Math",
    description: "Improve mental arithmetic",
    path: "/tools/speed-math",
    icon: Brain,
  },
];

const Tools = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cognitive Training Tools</h1>
          <p className="text-muted-foreground">
            A collection of tools designed to enhance your cognitive abilities and mental performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.path} className="hover:bg-accent transition-colors">
                <Link to={tool.path}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle>{tool.title}</CardTitle>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tools;
