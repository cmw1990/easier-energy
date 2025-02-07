import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Brain, Heart, Zap, Sun, Moon, Leaf, Activity, Shield } from "lucide-react"

export default function Directory() {
  const categories = [
    {
      title: "Cognitive Enhancement",
      description: "Tools and protocols for optimizing mental performance and neuroplasticity.",
      icon: Brain,
      link: "/tools/cognitive",
      subcategories: ["Nootropics", "Brain Training", "Focus Enhancement"]
    },
    {
      title: "Sleep Optimization",
      description: "Evidence-based methods for improving sleep quality and recovery.",
      icon: Moon,
      link: "/tools/sleep",
      subcategories: ["Sleep Tracking", "Circadian Optimization", "Sleep Environment"]
    },
    {
      title: "Energy Systems",
      description: "Protocols for mitochondrial health and cellular energy production.",
      icon: Zap,
      link: "/tools/energy",
      subcategories: ["Mitochondrial Function", "ATP Production", "Metabolic Health"]
    },
    {
      title: "Light Optimization",
      description: "Strategic light exposure for circadian entrainment and cellular health.",
      icon: Sun,
      link: "/tools/light",
      subcategories: ["Red Light Therapy", "Blue Light Management", "Circadian Biology"]
    },
    {
      title: "Cardiovascular Optimization",
      description: "Advanced protocols for heart rate variability and vascular health.",
      icon: Heart,
      link: "/tools/cardiovascular",
      subcategories: ["HRV Training", "Blood Flow Optimization", "Vascular Health"]
    },
    {
      title: "Environmental Optimization",
      description: "Methods for creating optimal living and working environments.",
      icon: Leaf,
      link: "/tools/environment",
      subcategories: ["EMF Mitigation", "Air Quality", "Environmental Toxins"]
    },
    {
      title: "Physical Performance",
      description: "Evidence-based protocols for strength, endurance, and recovery.",
      icon: Activity,
      link: "/tools/performance",
      subcategories: ["Recovery Optimization", "Movement Patterns", "Training Protocols"]
    },
    {
      title: "Immune Function",
      description: "Strategies for optimizing immune system function and resilience.",
      icon: Shield,
      link: "/tools/immune",
      subcategories: ["Immune Modulation", "Stress Response", "Cellular Defense"]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-4">Biohacking Directory</h1>
          <p className="text-muted-foreground">
            A comprehensive guide to evidence-based biological optimization protocols and technologies.
            Each category represents a core domain of human performance and longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(category.icon, {
                    className: "h-6 w-6 text-primary"
                  })}
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Key Areas:</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>{sub}</li>
                    ))}
                  </ul>
                  <Link to={category.link}>
                    <Button className="w-full mt-4">
                      View Protocols
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-6">
          <CardHeader>
            <CardTitle>Implementation Guidelines</CardTitle>
            <CardDescription>
              Systematic approach to biological optimization protocols
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Protocol Implementation</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Begin with baseline measurements and documentation</li>
                  <li>Implement interventions systematically and individually</li>
                  <li>Maintain detailed logs of responses and adaptations</li>
                  <li>Adjust protocols based on quantitative feedback</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Safety Considerations</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Consult healthcare professionals before implementing protocols</li>
                  <li>Monitor biomarkers and subjective responses</li>
                  <li>Document any adverse reactions or unexpected effects</li>
                  <li>Maintain proper documentation for longitudinal analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
