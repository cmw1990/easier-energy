import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { HeartHandshake, Lightbulb, PiggyBank, Brain, Share2, Activity, ArrowLeft, ChevronDown, ChevronUp, Sparkles, BookOpen, Blocks, Target, LineChart, Focus, ListChecks, ClipboardCheck, Waves, Music2, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react"

const WhyUs = () => {
  const [showFullArticle, setShowFullArticle] = useState(false)

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Discover Our Comprehensive Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-lg">
                The Well-Charged is more than just another wellness app – it's a comprehensive ecosystem designed to help you achieve optimal energy levels and maintain peak performance throughout your day.
              </p>
              
              {!showFullArticle ? (
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFullArticle(true)}
                >
                  Explore Our Vision <Sparkles className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <div className="space-y-8">
                    <section>
                      <h3 className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        The Science Behind Our Approach
                      </h3>
                      <p>
                        Our platform is built on cutting-edge research in chronobiology, sleep science, and energy management. We understand that optimal performance isn't just about getting enough sleep or exercising regularly – it's about synchronizing all aspects of your life with your natural rhythms and creating sustainable, healthy habits that work together harmoniously.
                      </p>
                      <p>
                        Through years of research and collaboration with health professionals, we've developed a unique approach that combines traditional wellness practices with modern technology and scientific understanding. Our methods are continuously updated based on the latest peer-reviewed research in:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                          Chronobiology and circadian rhythm optimization
                        </li>
                        <li className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                          Sleep science and recovery protocols
                        </li>
                        <li className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                          Cognitive performance enhancement
                        </li>
                        <li className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                          Stress management and resilience building
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2">
                        <Blocks className="h-5 w-5 text-primary" />
                        Integrated Tools for Complete Wellness
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-primary">Sound Therapy Suite</h4>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/tools/white-noise" className="text-primary hover:underline flex items-center gap-2">
                                <Focus className="h-4 w-4" />
                                White Noise Generator
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Customizable ambient sounds for enhanced focus and productivity
                              </p>
                            </li>
                            <li>
                              <Link to="/tools/binaural-beats" className="text-primary hover:underline flex items-center gap-2">
                                <Waves className="h-4 w-4" />
                                Binaural Beats
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Scientifically-tuned frequencies for deep meditation and concentration
                              </p>
                            </li>
                            <li>
                              <Link to="/tools/nature-sounds" className="text-primary hover:underline flex items-center gap-2">
                                <Music2 className="h-4 w-4" />
                                Nature Sounds
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Immersive natural soundscapes for relaxation and stress relief
                              </p>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold text-primary">Health Analytics</h4>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/tools/bmi-calculator" className="text-primary hover:underline flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                BMI Calculator
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Quick health assessment with personalized recommendations
                              </p>
                            </li>
                            <li>
                              <Link to="/tools/body-fat-calculator" className="text-primary hover:underline flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                Body Fat Calculator
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Accurate body composition analysis using proven methods
                              </p>
                            </li>
                            <li>
                              <Link to="/tools/bmr-calculator" className="text-primary hover:underline flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                Metabolic Rate Calculator
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Calculate your daily energy needs for optimal performance
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        AI-Powered Personalization
                      </h3>
                      <p>
                        Our artificial intelligence engine takes personalization to the next level by analyzing your:
                      </p>
                      <ul className="space-y-2">
                        <li>Daily activity patterns and energy fluctuations</li>
                        <li>Sleep quality and duration metrics</li>
                        <li>Focus and productivity data</li>
                        <li>Environmental factors affecting your performance</li>
                        <li>Personal preferences and goals</li>
                      </ul>
                      <p className="mt-4">
                        This comprehensive analysis enables us to create highly personalized recommendations that evolve with you. Whether you're looking to optimize your work performance, enhance your athletic recovery, or simply maintain better energy levels throughout the day, our AI adapts to your unique needs and circumstances.
                      </p>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        Progress Tracking & Insights
                      </h3>
                      <p>
                        Track your journey with our comprehensive analytics dashboard. Monitor your:
                      </p>
                      <ul className="space-y-2">
                        <li>Energy levels and patterns</li>
                        <li>Sleep quality improvements</li>
                        <li>Productivity metrics</li>
                        <li>Wellness goals progress</li>
                        <li>Long-term health trends</li>
                      </ul>
                      <p className="mt-4">
                        Our platform doesn't just collect data – it transforms it into actionable insights that help you make informed decisions about your health and wellness journey.
                      </p>
                    </section>

                    <section>
                      <h3 className="flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        Getting Started
                      </h3>
                      <p>
                        Begin your journey to optimal energy and wellness in three simple steps:
                      </p>
                      <ol className="space-y-2 mt-4">
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-primary">1</div>
                          Create your free account and complete our comprehensive wellness assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-primary">2</div>
                          Explore our suite of tools and select the ones that align with your goals
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-primary">3</div>
                          Let our AI create your personalized wellness plan and start your journey
                        </li>
                      </ol>
                    </section>

                  </div>

                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 mt-8"
                    onClick={() => setShowFullArticle(false)}
                  >
                    Show Less <ChevronUp className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-2xl">Ready to Transform Your Energy?</CardTitle>
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
                  Try Demo
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
