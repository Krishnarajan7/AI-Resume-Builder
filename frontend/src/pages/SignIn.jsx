import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PageLoader, usePageLoader } from "@/components/PageLoader";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, startLoading, stopLoading } = usePageLoader();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    
    startLoading();
    
    // For now, just show success message and navigate to app
    setTimeout(() => {
      toast({
        title: "Sign In Successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      
      setTimeout(() => {
        navigate("/app");
        stopLoading();
      }, 1000);
    }, 800);
  };

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">AI Resume Builder</h1>
            </div>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your account to continue building your resume
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary story-link hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full hover-scale">
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary story-link hover:text-primary/80">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignIn;