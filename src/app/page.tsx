'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  BookOpen, 
  Users, 
  Award, 
  Search, 
  Upload, 
  Sparkles, 
  Star,
  CheckCircle,
  ArrowRight,
  Rocket,
  Zap,
  TrendingUp,
  GraduationCap,
  Trophy,
  Target,
  ChevronRight,
  Download,
  Heart,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    { name: "Priya Sharma", role: "CSE Student", text: "This platform helped me ace my exams! The quality of notes is outstanding." },
    { name: "Rahul Kumar", role: "ECE Student", text: "Best resource for engineering students. Saved me countless hours!" },
    { name: "Anjali Patel", role: "ME Student", text: "Amazing community and resources. Highly recommended for all students!" }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Ultra-Modern Hero Section - Storytelling Approach */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden">
        {/* Minimalist animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 opacity-10 animate-float">
          <BookOpen className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-10 animate-float-delayed">
          <GraduationCap className="w-32 h-32 text-purple-500" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl sm:max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Badge - Dynamic */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 backdrop-blur-md rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-ping"></div>
              </div>
              <span className="font-semibold text-sm bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Live: 523 Students Learning Right Now
              </span>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Main Headline - Bold & Clean */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight break-words">
                <span className="block text-foreground">Learn.</span>
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Share.
                </span>
                <span className="block text-foreground">Excel.</span>
              </h1>
            </div>
            
            {/* Subheadline - Professional */}
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
              The ultimate platform for engineering students to access 
              <span className="font-bold text-foreground"> premium study materials</span>, 
              collaborate with peers, and 
              <span className="font-bold text-foreground"> achieve academic excellence</span>.
            </p>
            
            {/* Trust Bar - Minimalist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">100% Free</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Verified Content</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium">500+ Students</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>
            
            {/* CTA Buttons - Bold & Interactive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-800 w-full">
              <Link href="/browse" className="group">
                <Button size="lg" className="relative px-12 py-7 text-lg font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-110 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center gap-3">
                    <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    Start Exploring
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              <Link href="/contribute" className="group">
                <Button variant="outline" size="lg" className="px-12 py-7 text-lg font-bold border-2 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105">
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
                  Contribute Content
                </Button>
              </Link>
            </div>
            
            {/* Live Stats - Interactive Counter Effect */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-3xl mx-auto pt-8 sm:pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
              <div className="group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  1000+
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-2">Documents</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-2">Universities</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl font-black bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground font-medium mt-2">Access</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works - Storytelling Flow */}
  <section className="relative py-16 sm:py-32 px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">How It Works</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Your Journey to Success
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>
          
          <div className="max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30 z-10 group-hover:scale-125 transition-transform duration-300">
                1
              </div>
              <Card className="pt-12 pb-8 px-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-4 min-h-[320px]">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-black mb-4">Discover</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse through our vast collection of study materials organized by branch, semester, and subject.
                </p>
              </Card>
            </div>
            
            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-500/30 z-10 group-hover:scale-125 transition-transform duration-300">
                2
              </div>
              <Card className="pt-12 pb-8 px-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-4 min-h-[320px]">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-2xl font-black mb-4">Learn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access high-quality notes, question papers, and study guides curated by top students and verified by our community.
                </p>
              </Card>
            </div>
            
            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg shadow-pink-500/30 z-10 group-hover:scale-125 transition-transform duration-300">
                3
              </div>
              <Card className="pt-12 pb-8 px-6 text-center bg-card/50 backdrop-blur-sm border-2 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-4 min-h-[320px]">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-10 h-10 text-pink-500" />
                </div>
                <h3 className="text-2xl font-black mb-4">Excel</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Contribute your own materials, earn reputation points, and climb the leaderboard to unlock exclusive perks.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Modern Grid with Hover Effects */}
  <section className="relative py-16 sm:py-32 px-2 sm:px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for engineering students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-xs sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/30">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black">Smart Organization</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Materials organized by university, branch, semester, and subject for instant access.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-green-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black">Peer Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Connect with top students, share knowledge, and grow together as a community.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/30">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black">Quality Verified</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Every document is reviewed and verified to ensure accuracy and reliability.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-500/30">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-black">Powerful Search</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Advanced filtering and search to find exactly what you need in seconds.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials - Dynamic Carousel */}
  <section className="relative py-16 sm:py-32 px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Loved by Students
              </span>
            </h2>
          </div>

          <div className="max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 border-primary/20 p-4 sm:p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-6 left-6 text-8xl text-primary/10 font-serif">&ldquo;</div>
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
                  {testimonials[currentTestimonial].text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
              
              {/* Indicator dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index 
                        ? 'bg-primary w-8' 
                        : 'bg-primary/20 hover:bg-primary/40'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats - Bold Visual Impact */}
  <section className="relative py-16 sm:py-32 px-2 sm:px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Growing Fast</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                The Numbers Speak
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-2xl md:max-w-5xl mx-auto">
            <div className="group relative">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-2 border-primary/20 hover:border-primary/40 p-10 text-center transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="relative z-10">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-500">
                    1K+
                  </div>
                  <div className="text-xl font-bold text-foreground mb-2">Study Materials</div>
                  <p className="text-sm text-muted-foreground">Covering all major engineering branches</p>
                </div>
              </Card>
            </div>

            <div className="group relative">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-2 border-primary/20 hover:border-primary/40 p-10 text-center transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="relative z-10">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-500">
                    500+
                  </div>
                  <div className="text-xl font-bold text-foreground mb-2">Active Students</div>
                  <p className="text-sm text-muted-foreground">Learning and growing together</p>
                </div>
              </Card>
            </div>

            <div className="group relative">
              <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-md border-2 border-primary/20 hover:border-primary/40 p-10 text-center transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <div className="relative z-10">
                  <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-500">
                    50+
                  </div>
                  <div className="text-xl font-bold text-foreground mb-2">Universities</div>
                  <p className="text-sm text-muted-foreground">Pan-India coverage</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold & Energetic */}
  <section className="relative py-16 sm:py-32 px-2 sm:px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 opacity-[0.03]"></div>
        
        <div className="container mx-auto relative z-10">
          <Card className="max-w-xs sm:max-w-2xl md:max-w-5xl mx-auto bg-gradient-to-br from-card to-card/80 backdrop-blur-xl border-2 border-primary/30 p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full mb-8">
                <Rocket className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-bold text-primary uppercase tracking-wider">Join Now</span>
              </div>
              
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ready to Excel?
                </span>
              </h2>
              
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-12 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
                Join <span className="font-bold text-foreground">500+ engineering students</span> who are already using Future Engineers to 
                <span className="font-bold text-foreground"> achieve academic excellence</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center w-full">
                <Link href="/browse" className="group">
                  <Button size="lg" className="relative px-16 py-8 text-xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-110 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative flex items-center gap-3">
                      <Rocket className="w-7 h-7 group-hover:rotate-12 group-hover:-translate-y-1 transition-transform duration-300" />
                      Start Your Journey
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                
                <Link href="/leaderboard" className="group">
                  <Button variant="outline" size="lg" className="px-12 py-8 text-xl font-black border-2 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:scale-105">
                    <Trophy className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
