import { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { TypographyPanel } from "@/components/TypographyPanel";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState("editor");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({});
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(14);

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
      <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/e26cc102-9c09-48d0-b9a8-c240143f8ef9.png" 
              alt="Hire AI Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2 hover-scale" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover-scale" onClick={handleExport}>
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

      <div className="flex h-[calc(100vh-81px)]"> {/* Adjusted for new header height */}
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Editor Panel - Left */}
          <div className="w-72 2xl:w-80 editor-panel border-r border-border overflow-y-auto flex-shrink-0 bg-card/30">
            <ResumeEditor onDataChange={setResumeData} />
          </div>

          {/* Preview Panel - Center */}
          <div className="flex-1 preview-panel overflow-y-auto bg-muted/20">
            <ResumePreview template={selectedTemplate} resumeData={resumeData} fontFamily={fontFamily} fontSize={fontSize} />
          </div>

          {/* Templates Panel - Right */}
          <div className="w-80 2xl:w-96 templates-panel border-l border-border overflow-y-auto flex-shrink-0 bg-card/30">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
            <TypographyPanel 
              fontFamily={fontFamily}
              onFontFamilyChange={setFontFamily}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full pb-16 overflow-x-hidden">
          {activePanel === "editor" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumeEditor onDataChange={setResumeData} />
            </div>
          )}

          {activePanel === "preview" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumePreview template={selectedTemplate} resumeData={resumeData} fontFamily={fontFamily} fontSize={fontSize} />
            </div>
          )}

          {activePanel === "templates" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
              <TypographyPanel 
                fontFamily={fontFamily}
                onFontFamilyChange={setFontFamily}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;