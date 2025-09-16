import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ChevronDown, 
  ChevronRight, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen, 
  Award,
  Sparkles,
  Trash2,
  Plus,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddEditModal } from "./AddEditModal";

const AIButton = ({ onClick, children }) => (
  <Button 
    size="sm" 
    variant="outline" 
    className="ai-button-subtle h-7 text-xs gap-1 whitespace-nowrap"
    onClick={onClick}
  >
    <Sparkles className="w-3 h-3" />
    {children}
  </Button>
);


export const ResumeEditor = ({ onDataChange }) => {
  const { toast } = useToast();
  
  const [modalType, setModalType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
  });

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  });

  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);

  // Update parent component when data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange({
        personalInfo,
        summary,
        experiences,
        education,
        projects,
        certifications,
        skills
      });
    }
  }, [personalInfo, summary, experiences, education, projects, certifications, skills, onDataChange]);

  // Modal handlers
  const openAddModal = () => {
    setModalType(type);
    setEditData(null);
    setModalOpen(true);
  };

  const openEditModal = () => {
    setModalType(type);
    setEditData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setEditData(null);
  };

  const handleModalSave = (data) => {
    switch (modalType) {
      case 'experience':
        if (editData) {
          setExperiences(prev => prev.map(item => item.id === editData.id ? data : item));
        } else {
          setExperiences(prev => [...prev, data]);
        }
        break;
      case 'education':
        if (editData) {
          setEducation(prev => prev.map(item => item.id === editData.id ? data : item));
        } else {
          setEducation(prev => [...prev, data]);
        }
        break;
      case 'project':
        if (editData) {
          setProjects(prev => prev.map(item => item.id === editData.id ? data : item));
        } else {
          setProjects(prev => [...prev, data]);
        }
        break;
      case 'certification':
        if (editData) {
          setCertifications(prev => prev.map(item => item.id === editData.id ? data : item));
        } else {
          setCertifications(prev => [...prev, data]);
        }
        break;
      case 'skill':
        if (data.skillName) {
          const skillToAdd = `${data.skillName}${data.proficiency ? ` (${data.proficiency})` : ''}`;
          setSkills(prev => [...prev, skillToAdd]);
        }
        break;
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAIAction = (action, field) => {
    toast({
      title: "AI Feature",
      description: `${action} functionality coming soon!`,
    });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setExperiences(prev => [...prev, newExp]);
    setOpenSections(prev => ({ ...prev, experience: true }));
    toast({
      title: "Experience Added",
      description: "New work experience section added successfully!",
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      startYear: "",
      endYear: ""
    };
    setEducation(prev => [...prev, newEdu]);
    setOpenSections(prev => ({ ...prev, education: true }));
    toast({
      title: "Education Added",
      description: "New education section added successfully!",
    });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      projectName: "",
      projectDescription: "",
      technologies: "",
      startDate: "",
      endDate: ""
    };
    setProjects(prev => [...prev, newProject]);
    setOpenSections(prev => ({ ...prev, projects: true }));
    toast({
      title: "Project Added",
      description: "New project section added successfully!",
    });
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      certName: "",
      issuingOrg: "",
      issueDate: ""
    };
    setCertifications(prev => [...prev, newCert]);
    setOpenSections(prev => ({ ...prev, certifications: true }));
    toast({
      title: "Certification Added",
      description: "New certification section added successfully!",
    });
  };

  const removeItem = (id, type) => {
    switch (type) {
      case 'experience':
        setExperiences(prev => prev.filter(item => item.id !== id));
        break;
      case 'education':
        setEducation(prev => prev.filter(item => item.id !== id));
        break;
      case 'project':
        setProjects(prev => prev.filter(item => item.id !== id));
        break;
      case 'certification':
        setCertifications(prev => prev.filter(item => item.id !== id));
        break;
    }
    toast({
      title: "Item Removed",
      description: "Section removed successfully!",
    });
  };

  const sections = [
    {
      key: "personal",
      title: "Personal Information",
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="field-group">
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input
                id="fullName"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="dummy naanthan"
                className="h-8 text-sm"
              />
            </div>
            <div className="field-group">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="naanthardummy@gmail.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
              <div className="field-group">
                <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="h-8 text-sm"
                />
              </div>
              <div className="field-group">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="New York, NY"
                  className="h-8 text-sm"
                />
              </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="field-group">
              <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="linkedin.com/in/johndoe"
                className="h-8 text-sm"
              />
            </div>
            <div className="field-group">
              <Label htmlFor="website" className="text-xs">Portfolio/Website</Label>
              <Input
                id="website"
                value={personalInfo.website}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, website: e.target.value }))}
                placeholder="johndoe.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      key: "summary",
      title: "Professional Summary",
      icon: FileText,
      content: (
        <div className="space-y-3">
          <div className="field-group">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="summary" className="text-xs">Summary</Label>
              <div className="flex gap-1">
                <AIButton onClick={() => handleAIAction("enhance", "summary")}>
                  Enhance
                </AIButton>
              </div>
            </div>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Professional summary highlighting key achievements..."
              rows={4}
              className="resize-none text-sm"
            />
          </div>
        </div>
      )
    },
    {
      key: "experience",
      title: "Work Experience",
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Add your work experience</p>
            <Button size="sm" variant="outline" onClick={() => openAddModal("experience")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </div>
          
          {experiences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No work experience added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <Card key={exp.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Experience Entry</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal("experience", exp)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(exp.id, 'experience')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium">Job Title:</span> {exp.jobTitle || "Not specified"}</p>
                    <p><span className="font-medium">Company:</span> {exp.company || "Not specified"}</p>
                    <p><span className="font-medium">Duration:</span> {exp.startDate || "Not specified"} - {exp.endDate || "Present"}</p>
                    {exp.description && <p><span className="font-medium">Description:</span> {exp.description}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: "education",
      title: "Education",
      icon: GraduationCap,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Add your education</p>
            <Button size="sm" variant="outline" onClick={() => openAddModal("education")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </div>
          
          {education.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No education added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <Card key={edu.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Education Entry</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal("education", edu)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(edu.id, 'education')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium">Degree:</span> {edu.degree || "Not specified"}</p>
                    <p><span className="font-medium">School:</span> {edu.institution || "Not specified"}</p>
                    <p><span className="font-medium">Years:</span> {edu.startYear || "Not specified"} - {edu.endYear || "Not specified"}</p>
                    {edu.gpa && <p><span className="font-medium">GPA:</span> {edu.gpa}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: "skills",
      title: "Skills",
      icon: Code,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Add your skills</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openAddModal("skill")} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
              <AIButton onClick={() => handleAIAction("suggest-skills")}>
                AI Suggest
              </AIButton>
            </div>
          </div>
          
          {skills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No skills added yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                  {skill}
                  <button 
                    onClick={() => setSkills(prev => prev.filter((_, i) => i !== index))}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: "projects",
      title: "Projects",
      icon: FolderOpen,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Add your projects</p>
            <Button size="sm" variant="outline" onClick={() => openAddModal("project")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No projects added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Project Entry</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal("project", project)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(project.id, 'project')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium">Project:</span> {project.projectName || "Not specified"}</p>
                    <p><span className="font-medium">Technologies:</span> {project.technologies || "Not specified"}</p>
                    <p><span className="font-medium">Duration:</span> {project.startDate || "Not specified"} - {project.endDate || "Not specified"}</p>
                    {project.projectDescription && <p><span className="font-medium">Description:</span> {project.projectDescription}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      key: "certifications",
      title: "Certifications",
      icon: Award,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Add your certifications</p>
            <Button size="sm" variant="outline" onClick={() => openAddModal("certification")} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </div>
          
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No certifications added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <Card key={cert.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Certification Entry</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal("certification", cert)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(cert.id, 'certification')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium">Certification:</span> {cert.certName || "Not specified"}</p>
                    <p><span className="font-medium">Issuer:</span> {cert.issuingOrg || "Not specified"}</p>
                    <p><span className="font-medium">Date:</span> {cert.issueDate || "Not specified"}</p>
                    {cert.credentialId && <p><span className="font-medium">Credential ID:</span> {cert.credentialId}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Basics</h2>
          <Button
            onClick={() => handleAIAction("optimize-all")}
            className="ai-button gap-1 text-xs"
            size="sm"
          >
            <Sparkles className="w-3 h-3" />
            Optimize
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sections.map((section) => (
          <Collapsible
            key={section.key}
            open={openSections[section.key]}
            onOpenChange={() => toggleSection(section.key)}
          >
            <Card className="bg-card border border-border/30 hover:border-border/60 transition-all">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-left">{section.title}</h3>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                      openSections[section.key] ? 'rotate-180' : ''
                    }`} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="p-3 pt-0 space-y-3">
                  {section.content}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}

        <AddEditModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={handleModalSave}
          type={modalType}
          editData={editData}
        />
      </div>
    </div>
  );
};