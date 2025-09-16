import { useState } from "react";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { TypographyPanel } from "@/components/TypographyPanel";
import { LayoutPanel } from "@/components/LayoutPanel";
import { ThemePanel } from "@/components/ThemePanel";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Share2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState("editor");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState({});
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(14);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [lineHeight, setLineHeight] = useState(1.5);
  
  // History for undo/redo
  const [history, setHistory] = useState([resumeData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleDataChange = (newData) => {
    setResumeData(newData);
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setResumeData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setResumeData(history[historyIndex + 1]);
    }
  };

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
            <ResumeEditor onDataChange={handleDataChange} />
          </div>

          {/* Preview Panel - Center */}
          <div className="flex-1 preview-panel overflow-y-auto bg-muted/20">
            <ResumePreview 
              template={selectedTemplate} 
              resumeData={resumeData} 
              fontFamily={fontFamily} 
              fontSize={fontSize}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
          </div>

          {/* Right Panel - Templates & Design */}
          <div className="w-80 2xl:w-96 templates-panel border-l border-border overflow-y-auto flex-shrink-0 bg-card/30">
            <Tabs defaultValue="templates" className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                  <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="templates" className="h-full m-0">
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
                </TabsContent>
                
                <TabsContent value="layout" className="h-full m-0">
                  <LayoutPanel />
                </TabsContent>
                
                <TabsContent value="design" className="h-full m-0 space-y-0">
                  <TypographyPanel 
                    fontFamily={fontFamily}
                    onFontFamilyChange={setFontFamily}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                  />
                  <ThemePanel 
                    primaryColor={primaryColor}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    lineHeight={lineHeight}
                    onPrimaryColorChange={setPrimaryColor}
                    onBackgroundColorChange={setBackgroundColor}
                    onTextColorChange={setTextColor}
                    onLineHeightChange={setLineHeight}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full pb-16 overflow-x-hidden">
          {activePanel === "editor" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumeEditor onDataChange={handleDataChange} />
            </div>
          )}

          {activePanel === "preview" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <ResumePreview 
                template={selectedTemplate} 
                resumeData={resumeData} 
                fontFamily={fontFamily} 
                fontSize={fontSize}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />
            </div>
          )}

          {activePanel === "templates" && (
            <div className="h-[calc(100vh-73px-64px)] overflow-y-auto">
              <Tabs defaultValue="templates" className="h-full">
                <div className="p-4 border-b border-border">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
                    <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                    <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="templates">
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
                </TabsContent>
                
                <TabsContent value="layout">
                  <LayoutPanel />
                </TabsContent>
                
                <TabsContent value="design">
                  <TypographyPanel 
                    fontFamily={fontFamily}
                    onFontFamilyChange={setFontFamily}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                  />
                  <ThemePanel 
                    primaryColor={primaryColor}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    lineHeight={lineHeight}
                    onPrimaryColorChange={setPrimaryColor}
                    onBackgroundColorChange={setBackgroundColor}
                    onTextColorChange={setTextColor}
                    onLineHeightChange={setLineHeight}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;