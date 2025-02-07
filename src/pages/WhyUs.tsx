
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Globe, Zap, Wrench, Battery, Settings2 as Settings, Pill, Wind, Coffee, Smartphone, Laptop, Monitor, Chrome, ArrowLeft, Moon, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { TopNav } from "@/components/layout/TopNav"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const WhyUs = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [selectedPersona, setSelectedPersona] = useState<string>("")

  const { data: personas } = useQuery({
    queryKey: ['target-personas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('target_personas')
        .select('*')
      
      if (error) throw error
      return data
    }
  })

  const generateAffiliateLink = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate your affiliate link",
        variant: "destructive"
      })
      return
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    const { error } = await supabase
      .from('affiliate_links')
      .insert([
        {
          user_id: session.user.id,
          affiliate_code: code,
          persona_type: selectedPersona
        }
      ])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate affiliate link. Please try again.",
        variant: "destructive"
      })
      return
    }

    const affiliateUrl = `${window.location.origin}?ref=${code}`
    
    await navigator.clipboard.writeText(affiliateUrl)
    toast({
      title: "Success!",
      description: "Affiliate link copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto px-4 py-20 space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Why Choose The Well-Charged?</h1>
            <p className="text-xl text-muted-foreground">
              Your all-in-one platform for holistic energy management and personal wellness optimization
            </p>
            <div className="bg-primary/5 p-6 rounded-lg mt-6">
              <p className="text-lg font-medium text-primary">
                One integrated solution for your complete well-being journey
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>The Problem with Multiple Apps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Traditional wellness management often requires:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-primary" />
                        Exercise Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Meditation Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        Sleep Apps
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        Supplement Trackers
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Eye Exercise Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Focus Apps
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-primary" />
                        Diet Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-primary" />
                        Stress Release Apps
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Motivation Apps
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Well-Charged Solution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Holistic Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>All your wellness tools in one place, working together seamlessly to provide comprehensive insights and recommendations.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost-Effective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Save money by replacing multiple subscription fees with our comprehensive platform. Get access to all features at a fraction of the cost.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scientific Backing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Every tool and recommendation is grounded in research and evidence-based practices for optimal effectiveness.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personalized Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>AI-powered recommendations adapt to your unique needs, goals, and progress for truly personalized wellness optimization.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Everywhere You Need It</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Link to="/download/ios" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span>iOS App</span>
                      </Link>
                      <Link to="/download/android" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span>Android App</span>
                      </Link>
                      <Link to="/download/mac" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Laptop className="h-5 w-5 text-primary" />
                        <span>Mac App</span>
                      </Link>
                      <Link to="/download/windows" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Monitor className="h-5 w-5 text-primary" />
                        <span>Windows App</span>
                      </Link>
                      <Link to="/chrome-extension" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Chrome className="h-5 w-5 text-primary" />
                        <span>Chrome Extension</span>
                      </Link>
                      <Link to="/tools" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                        <Globe className="h-5 w-5 text-primary" />
                        <span>Web Tools</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Transform Your Energy?</h2>
            <p className="text-muted-foreground">
              Join thousands of users who have discovered the power of integrated wellness management.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/tools">
                <Button variant="outline" size="lg">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;

