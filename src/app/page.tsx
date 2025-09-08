import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { BookOpen, Users, Award, Search, Upload, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background text-foreground transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full text-muted-foreground text-sm mb-8 border border-border">
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering student collaboration
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 leading-tight">
            Future Engineers<br />Knowledge Hub
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of engineering students in the ultimate collaborative platform for sharing engineering notes, 
            study materials, and academic resources. Build your future with our engineering community-driven approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg transition-all duration-300 hover:scale-105">
                Explore Resources
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-border text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105">
                Share Knowledge
                <Upload className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Why Choose Future Engineers?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make engineering education collaborative and effective
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Organized Content</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground">
                Notes organized by university, course, and semester for easy navigation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Community Driven</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground">
                Collaborative platform where students contribute and learn together
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Quality Assured</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground">
                Moderated content ensures high-quality, reliable academic resources
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-card-foreground">Smart Search</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-muted-foreground">
                Powerful search and filtering to find exactly what you need
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/20 backdrop-blur-sm py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">1000+</div>
              <div className="text-muted-foreground text-lg">Documents Shared</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-muted-foreground text-lg">Active Students</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-muted-foreground text-lg">Universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of students already using Student Notes Hub to accelerate their academic journey
          </p>
          <Link href="/browse">
            <Button size="lg" className="text-lg px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg transition-all duration-300 hover:scale-105">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
