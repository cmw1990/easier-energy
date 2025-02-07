
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { HeartHandshake, Lightbulb, PiggyBank, Brain, Share2, Activity, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const WhyUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/tools">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Button>
          </Link>
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Why Choose The Well-Charged?</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your all-in-one platform for holistic energy management and personal wellness optimization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <HeartHandshake className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Holistic Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No more juggling between multiple apps. We combine exercise, diet, mood, sleep, meditation, focus, and more in one seamless platform. Experience truly integrated wellness tracking and optimization.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <PiggyBank className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Cost-Effective</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Save money by replacing multiple subscription fees with our comprehensive platform. Get access to all features at a fraction of the cost of using separate apps for each function.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Our intelligent system analyzes your data across all wellness dimensions to provide personalized recommendations and insights that single-function apps simply cannot match.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Science-Backed Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access a complete collection of evidence-based tools and exercises. From eye exercises to reproductive health, every feature is grounded in scientific research.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Personalized Energy Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create custom energy optimization plans or let our AI generate personalized recommendations based on your unique needs, goals, and health conditions.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Community & Expert Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Connect with other users, share successful energy plans, and consult with experts to optimize your wellness journey. Our platform facilitates knowledge sharing and professional guidance.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Optimize Your Energy?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Join thousands of users who have discovered the power of integrated wellness management. Start your journey to better energy and health today.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/app">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground mt-12">
          <p>
            © {new Date().getFullYear()} The Well-Charged - Your Partner in Holistic Energy Management
          </p>
        </footer>
      </div>
    </div>
  )
}

export default WhyUs
