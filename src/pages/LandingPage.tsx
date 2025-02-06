
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Globe, Zap, Wrench, LogIn, Battery, Settings2 as Settings, Pill } from "lucide-react"
import { Link } from "react-router-dom"
import { Switch } from "@/components/ui/switch"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Battery className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">The Well-Charged</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Development Switch */}
          <div className="flex items-center gap-2 border rounded-lg p-2 bg-background/80">
            <Label htmlFor="desktop-mode" className="text-sm">Desktop Mode</Label>
            <Switch
              id="desktop-mode"
              onCheckedChange={(checked) => {
                if (checked) {
                  navigate('/desktop')
                }
              }}
            />
          </div>
          <Link to="/tools">
            <Button variant="ghost">Tools</Button>
          </Link>
          <Link to="/auth">
            <Button>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Optimize Your Energy & Performance
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Access powerful tools and insights to enhance your focus, energy, and overall well-being. 
          Join thousands of high performers who trust The Well-Charged.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/tools">
            <Button size="lg" variant="outline">
              Explore Tools
              <Wrench className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Cognitive Enhancement</CardTitle>
              <CardDescription>
                Science-backed tools and techniques to optimize your mental performance
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Global Community</CardTitle>
              <CardDescription>
                Connect with like-minded individuals focused on personal optimization
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Energy Management</CardTitle>
              <CardDescription>
                Track and optimize your energy levels throughout the day
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "White Noise Generator",
              description: "Enhance focus and productivity with customizable white noise",
              icon: Settings,
              path: "/tools/white-noise"
            },
            {
              title: "Binaural Beats",
              description: "Science-backed audio frequencies for meditation and concentration",
              icon: Settings,
              path: "/tools/binaural-beats"
            },
            {
              title: "Supplement Guide",
              description: "Comprehensive guide to nootropics and supplements",
              icon: Pill,
              path: "/tools/supplement-guide"
            }
          ].map((tool) => (
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/tools">
            <Button size="lg" variant="outline">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">The Well-Charged</span>
            </div>
            <div className="flex gap-4">
              <Link to="/tools" className="text-muted-foreground hover:text-foreground">
                Tools
              </Link>
              <Link to="/auth" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
