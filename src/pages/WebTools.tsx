
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Leaf, HeartPulse, Pill, Settings, ChartBar, Info } from "lucide-react";

const WebTools = () => {
  const tools = [
    {
      title: "White Noise Generator",
      description: "Enhance focus and productivity with customizable white noise",
      icon: Settings,
      path: "/tools/white-noise",
      tags: ["focus", "productivity", "sound"]
    },
    {
      title: "Binaural Beats Player",
      description: "Science-backed audio frequencies for meditation and concentration",
      icon: Settings,
      path: "/tools/binaural-beats",
      tags: ["meditation", "brain", "frequency"]
    },
    {
      title: "Supplement Guide",
      description: "Comprehensive guide to nootropics and supplements",
      icon: Pill,
      path: "/tools/supplement-guide",
      tags: ["nootropics", "health", "optimization"]
    },
    {
      title: "Supplement Interaction Checker",
      description: "Check potential interactions between supplements",
      icon: Info,
      path: "/tools/supplement-checker",
      tags: ["safety", "health", "supplements"]
    },
    {
      title: "Focus Games",
      description: "Brain training games to improve cognitive function",
      icon: Brain,
      path: "/focus",
      tags: ["cognitive", "brain", "training"]
    },
    {
      title: "Biometrics Guide",
      description: "Learn how to track and interpret your biometric data",
      icon: HeartPulse,
      path: "/tools/biometrics",
      tags: ["tracking", "data", "health"]
    },
    {
      title: "Performance Analytics",
      description: "Tools to analyze and optimize your performance metrics",
      icon: ChartBar,
      path: "/tools/analytics",
      tags: ["data", "optimization", "tracking"]
    },
    {
      title: "Smart Supplement Stack Builder",
      description: "Build your personalized supplement stack based on goals",
      icon: Leaf,
      path: "/tools/stack-builder",
      tags: ["supplements", "optimization", "personalization"]
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Biohacking Web Tools
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Free online tools for biohackers, optimizers, and health enthusiasts. 
          Enhance your performance, track your progress, and optimize your supplements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.title} to={tool.path}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{tool.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Note: These tools are provided for informational purposes only. 
          Always consult with healthcare professionals before making changes to your supplement or fitness routine.
        </p>
      </div>
    </div>
  );
};

export default WebTools;
