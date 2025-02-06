
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Link, useParams } from "react-router-dom";
import { Brain, Leaf, HeartPulse, Pill, Settings, ChartBar, Waves, Music2, Focus, Wind, Footprints, Moon, Coffee, Cigarette, Battery, Droplets } from "lucide-react";

const WebTools = () => {
  const { toolSlug } = useParams();

  const tools = [
    // Sound & Focus Tools
    {
      title: "White Noise Generator",
      description: "Customize and play different types of white, pink, and brown noise to enhance focus",
      icon: Wind,
      path: "/tools/white-noise",
      tags: ["focus", "sound", "productivity"],
      category: "sound"
    },
    {
      title: "Binaural Beats",
      description: "Experience different frequency ranges for meditation, focus, and relaxation",
      icon: Waves,
      path: "/tools/binaural-beats",
      tags: ["meditation", "focus", "sound"],
      category: "sound"
    },
    {
      title: "Nature Sounds",
      description: "Calming nature sounds for relaxation and focus",
      icon: Music2,
      path: "/tools/nature-sounds",
      tags: ["relaxation", "sound", "focus"],
      category: "sound"
    },

    // Meditation & Breathing Tools
    {
      title: "Breathing Exercises",
      description: "Interactive breathing patterns and exercises for stress relief and focus",
      icon: Wind,
      path: "/tools/breathing",
      tags: ["meditation", "health", "stress-relief"],
      category: "meditation"
    },
    {
      title: "Focus Timer",
      description: "Customizable Pomodoro timer with white noise integration",
      icon: Focus,
      path: "/tools/focus-timer",
      tags: ["productivity", "time-management"],
      category: "productivity"
    },
    {
      title: "Meditation Timer",
      description: "Guided and unguided meditation sessions with ambient sounds",
      icon: Moon,
      path: "/tools/meditation",
      tags: ["meditation", "mindfulness"],
      category: "meditation"
    },
    {
      title: "Walking Meditation",
      description: "Guided walking meditation with step counting and nature sounds",
      icon: Footprints,
      path: "/tools/walking-meditation",
      tags: ["meditation", "exercise"],
      category: "meditation"
    },

    // Health & Supplement Guides
    {
      title: "Sleep Guide",
      description: "Comprehensive guide to improving sleep quality and habits",
      icon: Moon,
      path: "/tools/sleep-guide",
      tags: ["health", "sleep", "wellness"],
      category: "guides"
    },
    {
      title: "Supplement Guide",
      description: "Comprehensive guide to nootropics and supplements for cognitive enhancement",
      icon: Pill,
      path: "/tools/supplement-guide",
      tags: ["health", "nootropics", "supplements"],
      category: "guides"
    },
    {
      title: "Caffeine Guide",
      description: "Understanding caffeine, timing, and optimal usage for energy and focus",
      icon: Coffee,
      path: "/tools/caffeine-guide",
      tags: ["health", "energy", "focus"],
      category: "guides"
    },
    {
      title: "Energy Drinks Guide",
      description: "Comprehensive analysis of energy drinks, ingredients, and healthier alternatives",
      icon: Battery,
      path: "/tools/energy-drinks-guide",
      tags: ["health", "energy", "wellness"],
      category: "guides"
    },
    {
      title: "Nicotine Guide",
      description: "Safe usage guide for non-smoking nicotine products and alternatives",
      icon: Cigarette,
      path: "/tools/nicotine-guide",
      tags: ["health", "focus", "alternatives"],
      category: "guides"
    },
    {
      title: "Hydration Guide",
      description: "Optimize your hydration for better energy and cognitive performance",
      icon: Droplets,
      path: "/tools/hydration-guide",
      tags: ["health", "energy", "wellness"],
      category: "guides"
    }
  ];

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-primary">
            Free Wellness & Focus Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our collection of free online tools and guides for focus, meditation, and wellness. 
            No installation required - use directly in your browser.
          </p>
        </div>

        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map((tool) => (
                  <Link key={tool.title} to={tool.path}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-2 border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <tool.icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{tool.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {tool.description}
                        </CardDescription>
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
          </div>
        ))}

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            All tools are free to use and optimized for desktop and mobile browsers.
            Sign in to save your preferences and track your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebTools;
