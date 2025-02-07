import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Link, useParams } from "react-router-dom";
import { Brain, Leaf, HeartPulse, Settings, ChartBar, Waves, Music2, Focus, Wind, Footprints, Moon, Coffee, Cigarette, Battery, Droplets, Bath, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";

interface WebTool {
  id?: string;
  title: string;
  description: string;
  slug?: string;
  path?: string;
  icon?: LucideIcon;
  tags: string[];
  category: string;
  isPremium?: boolean;
  view_count?: number;
  published?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  'white-noise': Wind,
  'binaural-beats': Waves,
  'nature-sounds': Music2,
  'bathing': Bath,
  'breathing': Wind,
  'sleep-guide': Moon,
  'focus-timer': Focus,
  'meditation': Moon,
  'supplement-guide': Leaf,
  'caffeine-guide': Coffee,
  'energy-drinks-guide': Battery,
  'hydration-guide': Droplets,
  'bmi-calculator': Calculator,
  'body-fat-calculator': Calculator,
  'bmr-calculator': Calculator,
  'hrv-calculator': Calculator,
};

const seedWebTools = async () => {
  const tools = [
    {
      title: "White Noise Generator",
      description: "Customize and play different types of white, pink, and brown noise to enhance focus and relaxation. Try our science-backed sound profiles.",
      slug: "white-noise",
      path: "/tools/white-noise",
      tags: ["focus", "sound", "productivity"],
      category: "meditation",
      published: true
    },
    {
      title: "Binaural Beats",
      description: "Experience different frequency ranges for meditation, focus, and relaxation. Access basic frequencies for free.",
      slug: "binaural-beats",
      path: "/tools/binaural-beats",
      tags: ["meditation", "focus", "sound"],
      category: "meditation",
      published: true
    },
    {
      title: "Nature Sounds",
      description: "Calming nature sounds for relaxation and focus. Perfect for meditation or background noise while working.",
      slug: "nature-sounds",
      path: "/tools/nature-sounds",
      tags: ["relaxation", "sound", "focus"],
      category: "meditation",
      published: true
    },
    {
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index (BMI) to assess if your weight is in a healthy range. Get instant results and interpretations.",
      slug: "bmi-calculator",
      path: "/tools/bmi-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false,
      published: true
    },
    {
      title: "Body Fat Calculator",
      description: "Calculate your body fat percentage using the U.S. Navy Method. Get accurate measurements and understand your body composition.",
      slug: "body-fat-calculator",
      path: "/tools/body-fat-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false,
      published: true
    },
    {
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily caloric needs.",
      slug: "bmr-calculator",
      path: "/tools/bmr-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false,
      published: true
    },
    {
      title: "HRV Calculator",
      description: "Calculate your Heart Rate Variability (HRV) to assess your autonomic nervous system health and stress levels.",
      slug: "hrv-calculator",
      path: "/tools/hrv-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false,
      published: true
    },
    {
      title: "Tea Database",
      description: "Comprehensive guide to teas, their compounds, health benefits, and brewing methods.",
      slug: "tea-database",
      path: "/tools/tea-database",
      tags: ["health", "tea", "wellness"],
      category: "health",
      published: true
    },
    {
      title: "Energy Enhancement Database",
      description: "Comprehensive database of energy drinks, stimulants, and natural energy boosters with detailed analysis.",
      slug: "energy-enhancement",
      path: "/tools/energy-enhancement",
      tags: ["energy", "health", "wellness"],
      category: "health",
      published: true
    },
    {
      title: "Sleep Optimization",
      description: "Evidence-based methods for improving sleep quality and recovery.",
      slug: "sleep",
      path: "/tools/sleep",
      tags: ["sleep", "health", "wellness"],
      category: "health",
      published: true
    },
    {
      title: "Light Optimization",
      description: "Strategic light exposure protocols for circadian health and cellular function.",
      slug: "light",
      path: "/tools/light",
      tags: ["light", "health", "wellness"],
      category: "health",
      published: true
    },
    {
      title: "The Well-Recharged Guide to Sleep",
      description: "Comprehensive sleep resource hub with science-backed guides, product reviews, and tools for better sleep. Access sleep tracking, environment optimization, and expert advice.",
      slug: "sleep-guide",
      path: "/tools/sleep-guide",
      tags: ["sleep", "health", "wellness", "education"],
      category: "health",
      published: true
    }
  ];

  for (const tool of tools) {
    const { data, error } = await supabase
      .from('web_tools')
      .upsert(
        { 
          ...tool,
          content: tool.description
        },
        { onConflict: 'slug' }
      );
    
    if (error) console.error('Error seeding tool:', error);
  }
};

const WebTools = () => {
  const { toolSlug } = useParams();

  // Fetch tools from database
  const { data: dbTools, isLoading } = useQuery({
    queryKey: ['webTools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web_tools')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Seed tools if none exist
      if (!data?.length) {
        await seedWebTools();
        const { data: seededData, error: seededError } = await supabase
          .from('web_tools')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
          
        if (seededError) throw seededError;
        return seededData;
      }
      
      return data;
    }
  });

  // Track view when a tool is accessed
  const trackToolView = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('web_tools')
        .update({ view_count: dbTools?.find(t => t.id === toolId)?.view_count + 1 || 1 })
        .eq('id', toolId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error tracking tool view:', err);
    }
  };

  const fallbackTools: WebTool[] = [
    {
      title: "White Noise Generator",
      description: "Customize and play different types of white, pink, and brown noise to enhance focus and relaxation. Try our science-backed sound profiles.",
      icon: Wind,
      path: "/tools/white-noise",
      tags: ["focus", "sound", "productivity"],
      category: "meditation",
      isPremium: false
    },
    {
      title: "Binaural Beats",
      description: "Experience different frequency ranges for meditation, focus, and relaxation. Access basic frequencies for free.",
      icon: Waves,
      path: "/tools/binaural-beats",
      tags: ["meditation", "focus", "sound"],
      category: "meditation",
      isPremium: true
    },
    {
      title: "Nature Sounds",
      description: "Calming nature sounds for relaxation and focus. Perfect for meditation or background noise while working.",
      icon: Music2,
      path: "/tools/nature-sounds",
      tags: ["relaxation", "sound", "focus"],
      category: "meditation",
      isPremium: true
    },
    {
      title: "BMI Calculator",
      description: "Calculate your body mass index (BMI) to assess if your weight is in a healthy range. Get instant results and interpretations.",
      icon: Calculator,
      path: "/tools/bmi-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false
    },
    {
      title: "Body Fat Calculator",
      description: "Calculate your body fat percentage using the U.S. Navy Method. Get accurate measurements and understand your body composition.",
      icon: Calculator,
      path: "/tools/body-fat-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false
    },
    {
      title: "BMR Calculator",
      description: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily caloric needs.",
      icon: Calculator,
      path: "/tools/bmr-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false
    },
    {
      title: "HRV Calculator",
      description: "Calculate your Heart Rate Variability (HRV) to assess your autonomic nervous system health and stress levels.",
      icon: Calculator,
      path: "/tools/hrv-calculator",
      tags: ["health", "fitness", "calculator"],
      category: "health",
      isPremium: false
    }
  ];

  const tools = dbTools?.length ? dbTools : fallbackTools;
  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <div className="text-center">Loading tools...</div>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button variant="default" size="lg">
                Sign Up Free
              </Button>
            </Link>
            <a href="https://apps.apple.com/your-app" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Download App
              </Button>
            </a>
          </div>
        </div>

        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map((tool: WebTool) => (
                  <Link 
                    key={tool.id || tool.title} 
                    to={tool.path || `/tools/${tool.slug}`}
                    onClick={() => tool.id && trackToolView(tool.id)}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow border-2 border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-full">
                            {tool.icon && React.createElement(tool.icon, {
                              className: "h-6 w-6 text-primary"
                            })}
                            {!tool.icon && tool.slug && iconMap[tool.slug] && React.createElement(iconMap[tool.slug], {
                              className: "h-6 w-6 text-primary"
                            })}
                          </div>
                          <CardTitle className="text-xl">{tool.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {tool.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {tool.tags?.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {tool.isPremium && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              Premium Available
                            </span>
                          )}
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
