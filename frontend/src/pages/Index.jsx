import { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState<ActivePanel>("editor");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({});

  const handleShare = () => {
    toast({
      title: "Share Resume",
      description: "Share functionality will be available soon!",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Resume",
      description: "Export functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">AI Resume Builder</h1>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <FileDown className="w-4 h-4" />
              Export
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileNavigation 
              activePanel={activePanel} 
              onPanelChange={setActivePanel} 
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Editor Panel - Left */}
          <div className="w-80 xl:w-96 editor-panel border-r border-border overflow-y-auto flex-shrink-0">
            <ResumeEditor onDataChange={setResumeData} />
          </div>

          {/* Preview Panel - Center */}
          <div className="flex-1 preview-panel overflow-y-auto">
            <ResumePreview template={selectedTemplate} resumeData={resumeData} />
          </div>

          {/* Templates Panel - Right */}
          <div className="w-80 templates-panel border-l border-border overflow-y-auto flex-shrink-0">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full pb-16 overflow-x-hidden"> {/* Added padding bottom for mobile nav and prevent horizontal scroll */}
          {activePanel === "editor" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumeEditor onDataChange={setResumeData} />
            </div>
          )}

          {activePanel === "preview" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumePreview template={selectedTemplate} resumeData={resumeData} />
            </div>
          )}

          {activePanel === "templates" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;