import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


export const AddEditModal = ({ type, isOpen, onClose, editData, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(editData || {});

  const handleSave = () => {
    if (!formData || Object.keys(formData).length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one field before saving.",
        variant: "destructive",
      });
      return;
    }

    const dataToSave = {
      ...formData,
      id: editData?.id || Date.now().toString(),
    };

    onSave(dataToSave);
    
    toast({
      title: `${editData ? 'Updated' : 'Added'} ${type}`,
      description: `${type} has been ${editData ? 'updated' : 'added'} successfully!`,
    });
    
    onClose();
    setFormData({});
  };

  const handleCancel = () => {
    setFormData({});
    onClose();
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    switch (type) {
      case "experience":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle || ""}
                  onChange={(e) => updateField("jobTitle", e.target.value)}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => updateField("company", e.target.value)}
                  placeholder="e.g., TechCorp Inc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate || ""}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ""}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  placeholder="Leave empty if current"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g., New York, NY"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your role and achievements..."
                rows={4}
              />
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={formData.degree || ""}
                onChange={(e) => updateField("degree", e.target.value)}
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>
            
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution || ""}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="e.g., University of Technology"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={formData.startYear || ""}
                  onChange={(e) => updateField("startYear", e.target.value)}
                  placeholder="2015"
                />
              </div>
              <div>
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={formData.endYear || ""}
                  onChange={(e) => updateField("endYear", e.target.value)}
                  placeholder="2019"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="gpa">GPA (optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa || ""}
                onChange={(e) => updateField("gpa", e.target.value)}
                placeholder="3.8"
              />
            </div>
          </div>
        );

      case "project":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName || ""}
                onChange={(e) => updateField("projectName", e.target.value)}
                placeholder="e.g., E-commerce Platform"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate || ""}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate || ""}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input
                id="technologies"
                value={formData.technologies || ""}
                onChange={(e) => updateField("technologies", e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription || ""}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                placeholder="Describe your project and your role..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="projectUrl">Project URL (optional)</Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl || ""}
                onChange={(e) => updateField("projectUrl", e.target.value)}
                placeholder="https://github.com/yourproject"
              />
            </div>
          </div>
        );

      case "certification":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="certName">Certification Name</Label>
              <Input
                id="certName"
                value={formData.certName || ""}
                onChange={(e) => updateField("certName", e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>
            
            <div>
              <Label htmlFor="issuingOrg">Issuing Organization</Label>
              <Input
                id="issuingOrg"
                value={formData.issuingOrg || ""}
                onChange={(e) => updateField("issuingOrg", e.target.value)}
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="month"
                  value={formData.issueDate || ""}
                  onChange={(e) => updateField("issueDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={formData.expiryDate || ""}
                  onChange={(e) => updateField("expiryDate", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="credentialId">Credential ID (optional)</Label>
              <Input
                id="credentialId"
                value={formData.credentialId || ""}
                onChange={(e) => updateField("credentialId", e.target.value)}
                placeholder="Certificate ID or badge number"
              />
            </div>
          </div>
        );

      case "skill":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={formData.skillName || ""}
                onChange={(e) => updateField("skillName", e.target.value)}
                placeholder="e.g., React, Python, Project Management"
              />
            </div>
            
            <div>
              <Label htmlFor="proficiency">Proficiency Level</Label>
              <select
                id="proficiency"
                value={formData.proficiency || ""}
                onChange={(e) => updateField("proficiency", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language || ""}
                onChange={(e) => updateField("language", e.target.value)}
                placeholder="e.g., Spanish, French, Mandarin"
              />
            </div>
            
            <div>
              <Label htmlFor="fluency">Fluency Level</Label>
              <select
                id="fluency"
                value={formData.fluency || ""}
                onChange={(e) => updateField("fluency", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Select fluency</option>
                <option value="basic">Basic</option>
                <option value="conversational">Conversational</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    if (!type) return "";
    const action = editData ? "Edit" : "Add";
    const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
    return `${action} ${typeTitle}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderFields()}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editData ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};