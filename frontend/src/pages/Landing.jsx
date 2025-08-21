import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Wand2, FileText, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageLoader, usePageLoader } from "@/components/PageLoader";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = usePageLoader();

  const handleNavigation = (path) => {
    startLoading();
    setTimeout(() => {
      navigate(path);
      stopLoading();
    }, 800);
  };

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border/40">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">AI Resume Builder</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleNavigation("/signin")}
                className="hover-scale"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleNavigation("/signup")}
                className="hover-scale"
              >
                Get Started
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Build Professional Resumes with AI
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create ATS-friendly resumes that stand out. Choose from modern templates, 
              get AI-powered suggestions, and export to PDF instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="gap-2 hover-scale"
                onClick={() => handleNavigation("/app")}
              >
                <Plus className="w-5 h-5" />
                Start New Resume
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-scale"
                onClick={() => handleNavigation("/signin")}
              >
                Sign In to Continue
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-card/50 border-border/50 hover-scale animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Templates</h3>
              <p className="text-muted-foreground">
                Choose from a variety of modern, ATS-optimized resume templates designed by professionals.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 border-border/50 hover-scale animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Content</h3>
              <p className="text-muted-foreground">
                Get intelligent suggestions for your resume content, skills, and formatting to make your application shine.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 border-border/50 hover-scale animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ATS Friendly</h3>
              <p className="text-muted-foreground">
                Ensure your resume passes through Applicant Tracking Systems with our optimized formatting.
              </p>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Wand2 className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  © 2024 AI Resume Builder. Craft your career story.
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="story-link hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="story-link hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="story-link hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;