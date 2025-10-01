import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PageLoader, usePageLoader } from "@/components/PageLoader";
import api from "@/api/axios"; // Axios instance
import { AuthContext } from "@/context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, startLoading, stopLoading } = usePageLoader();
  const { login } = useContext(AuthContext); // Save user + accessToken in context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    startLoading();
    try {
      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { user, accessToken } = response.data;
      login(user, accessToken); // Save user in context

      toast({
        title: "Account Created",
        description: `Welcome, ${user.name}!`,
      });

      navigate("/app");
    } catch (err) {
      toast({
        title: "Signup Failed",
        description: err.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      stopLoading();
    }
  };

  /** OAuth login handler for Google/GitHub */
  const handleOAuthLogin = (provider) => {
    const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    // Redirect the user to backend OAuth route
    window.location.href = `${baseURL}/auth/${provider}`;
  };

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
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
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <p className="text-muted-foreground">
                Get started with your professional resume today
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full hover-scale">
                  Create Account
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-primary story-link hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="mt-6 flex flex-col gap-2">
                <Button onClick={() => handleOAuthLogin("google")} className="w-full">
                  Sign up with Google
                </Button>
                <Button onClick={() => handleOAuthLogin("github")} className="w-full">
                  Sign up with GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignUp;
