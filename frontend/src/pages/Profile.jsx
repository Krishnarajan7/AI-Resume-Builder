import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  User as UserIcon,
  Mail,
  Calendar,
  FileText,
  LogOut,
  Download,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";


const Profile = () => {
  const { user, accessToken, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    job_title: "",
    company: "",
    industry: "",
    phone_number: "",
    location: "",
    website_url: "",
    linkedin_url: "",
    github_url: "",
    professional_summary: "",
    years_experience: "",
    career_level: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Axios instance with auth header
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    withCredentials: true,
  });

  // Load user + profile + projects
  useEffect(() => {
    const loadData = async () => {
      if (!user && !loading) {
        navigate("/signin");
        return;
      }

      try {
        // Always refresh user from backend
        const { data: me } = await api.get("/auth/me");
        if (!me?.user) {
          throw new Error("No user data from /auth/me");
        }

        // Load profile details
        const { data: profileData } = await api.get("/api/v1/profile");
        setProfile(profileData);
        setFormData({
          username: profileData?.username || "",
          full_name: profileData?.full_name || me.user.name || "",
          job_title: profileData?.job_title || "",
          company: profileData?.company || "",
          industry: profileData?.industry || "",
          phone_number: profileData?.phone_number || "",
          location: profileData?.location || "",
          website_url: profileData?.website_url || "",
          linkedin_url: profileData?.linkedin_url || "",
          github_url: profileData?.github_url || "",
          professional_summary: profileData?.professional_summary || "",
          years_experience: profileData?.years_experience?.toString() || "",
          career_level: profileData?.career_level || "",
          newPassword: "",
          confirmPassword: "",
        });

        // Load projects
        const { data: projectsData } = await api.get(
          `/api/v1/users/${me.user.id}/projects`
        );
        setProjects(projectsData || []);
      } catch (err) {
        console.error("Profile load error:", err);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };

    if (accessToken) {
      loadData();
    }
  }, [accessToken, user, loading, navigate]);

  // --- Handlers ---

  const handleUpdateProfile = async () => {
    try {
      await api.put("/api/v1/profile", {
        full_name: formData.full_name,
        job_title: formData.job_title,
        company: formData.company,
        industry: formData.industry,
        phone_number: formData.phone_number,
        location: formData.location,
        website_url: formData.website_url,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        professional_summary: formData.professional_summary,
        years_experience: formData.years_experience
          ? parseInt(formData.years_experience)
          : null,
        career_level: formData.career_level,
      });

      toast({ title: "Success", description: "Profile updated successfully" });
      setProfile({ ...profile, ...formData });
      setEditingProfile(false);
    } catch (err) {
      console.error("Update profile error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.put("/api/v1/profile/password", {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setEditingPassword(false);
    } catch (err) {
      console.error("Update password error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/api/v1/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast({ title: "Deleted", description: "Project removed successfully" });
    } catch (err) {
      console.error("Delete project error:", err);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleDownloadProject = (project) => {
    const blob = new Blob([JSON.stringify(project.project_data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.project_name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // --- UI ---

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/app")}
              className="flex items-center gap-2"
            >
              ← Back to App
            </Button>
            <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {profile?.full_name?.split(" ").map((n) => n[0]).join("") ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                  {profile?.full_name || "User"}
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(profile?.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {projects.length} Projects
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.username || "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Current Position</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.job_title || "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Experience Level</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {profile?.career_level || "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile Settings
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Projects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your profile details and personal information
                      </CardDescription>
                    </div>
                    {!editingProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProfile(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          {editingProfile ? (
                            <Input
                              value={formData.full_name}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  full_name: e.target.value,
                                }))
                              }
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.full_name || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Username</label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile?.username || "Not set"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Job Title</label>
                          {editingProfile ? (
                            <Input
                              value={formData.job_title}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  job_title: e.target.value,
                                }))
                              }
                              placeholder="e.g. Software Engineer"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.job_title || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Company</label>
                          {editingProfile ? (
                            <Input
                              value={formData.company}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  company: e.target.value,
                                }))
                              }
                              placeholder="Enter your company"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.company || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Industry</label>
                          {editingProfile ? (
                            <Input
                              value={formData.industry}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  industry: e.target.value,
                                }))
                              }
                              placeholder="e.g. Technology"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.industry || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Career Level</label>
                          {editingProfile ? (
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={formData.career_level}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  career_level: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select level</option>
                              <option value="student">Student</option>
                              <option value="entry">Entry Level</option>
                              <option value="mid">Mid Level</option>
                              <option value="senior">Senior Level</option>
                              <option value="executive">Executive</option>
                              <option value="freelancer">Freelancer</option>
                            </select>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1 capitalize">
                              {profile?.career_level || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Phone Number</label>
                          {editingProfile ? (
                            <Input
                              value={formData.phone_number}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  phone_number: e.target.value,
                                }))
                              }
                              placeholder="Your phone number"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.phone_number || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Location</label>
                          {editingProfile ? (
                            <Input
                              value={formData.location}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  location: e.target.value,
                                }))
                              }
                              placeholder="City, Country"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.location || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Years of Experience</label>
                          {editingProfile ? (
                            <Input
                              type="number"
                              value={formData.years_experience}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  years_experience: e.target.value,
                                }))
                              }
                              placeholder="Years of experience"
                              min="0"
                              max="50"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.years_experience
                                ? `${profile.years_experience} years`
                                : "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Website/Portfolio</label>
                          {editingProfile ? (
                            <Input
                              value={formData.website_url}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  website_url: e.target.value,
                                }))
                              }
                              placeholder="https://yourwebsite.com"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.website_url || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">LinkedIn URL</label>
                          {editingProfile ? (
                            <Input
                              value={formData.linkedin_url}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  linkedin_url: e.target.value,
                                }))
                              }
                              placeholder="https://linkedin.com/in/username"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.linkedin_url || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium">GitHub URL</label>
                          {editingProfile ? (
                            <Input
                              value={formData.github_url}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  github_url: e.target.value,
                                }))
                              }
                              placeholder="https://github.com/username"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">
                              {profile?.github_url || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Professional Summary</label>
                        {editingProfile ? (
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.professional_summary}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                professional_summary: e.target.value,
                              }))
                            }
                            placeholder="Brief summary of your professional background and goals..."
                            rows={4}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile?.professional_summary || "Not set"}
                          </p>
                        )}
                      </div>
                    </div>

                    {editingProfile && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleUpdateProfile}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingProfile(false);
                            setFormData((prev) => ({
                              ...prev,
                              username: profile?.username || "",
                              full_name: profile?.full_name || "",
                              job_title: profile?.job_title || "",
                              company: profile?.company || "",
                              industry: profile?.industry || "",
                              phone_number: profile?.phone_number || "",
                              location: profile?.location || "",
                              website_url: profile?.website_url || "",
                              linkedin_url: profile?.linkedin_url || "",
                              github_url: profile?.github_url || "",
                              professional_summary:
                                profile?.professional_summary || "",
                              years_experience:
                                profile?.years_experience?.toString() || "",
                              career_level: profile?.career_level || "",
                            }));
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Password Settings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Password Settings</CardTitle>
                      <CardDescription>
                        Change your password to keep your account secure
                      </CardDescription>
                    </div>
                    {!editingPassword && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPassword(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Change Password
                      </Button>
                    )}
                  </CardHeader>
                  {editingPassword && (
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">New Password</label>
                        <Input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleUpdatePassword}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Update Password
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPassword(false);
                            setFormData((prev) => ({
                              ...prev,
                              newPassword: "",
                              confirmPassword: "",
                            }));
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>
                      Manage your saved resume projects and downloads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No projects found</p>
                        <p className="text-sm text-muted-foreground">
                          Start creating resumes to see them here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <h3 className="font-medium">{project.project_name}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                {project.template_type && (
                                  <Badge variant="secondary">
                                    {project.template_type}
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  Created{" "}
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadProject(project)}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;