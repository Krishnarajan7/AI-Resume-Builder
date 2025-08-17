import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Edit3, Eye, Palette, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MobileNavigation = ({ activePanel, onPanelChange }) => {
  const { toast } = useToast();
  
  const panels = [
    { id: "editor", label: "Editor", icon: Edit3 },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "templates", label: "Templates", icon: Palette },
  ];

  const handleShare = () => {
    toast({
      title: "Share Resume",
      description: "Share functionality will be available soon!",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export functionality will be available soon!",
    });
  };

  const handleExportDOCX = () => {
    toast({
      title: "Export DOCX", 
      description: "DOCX export functionality will be available soon!",
    });
  };

  return (
    <>
      {/* Bottom Navigation Bar - Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          {panels.map((panel) => {
            const Icon = panel.icon;
            const isActive = activePanel === panel.id;
            
            return (
              <Button
                key={panel.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`flex-1 mx-0.5 gap-1 h-12 flex-col py-1 ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
                onClick={() => onPanelChange(panel.id)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{panel.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <div className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share Resume
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3" onClick={handleExportPDF}>
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3" onClick={handleExportDOCX}>
                  <Download className="w-4 h-4" />
                  Export DOCX
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <div className="space-y-2">
                {panels.map((panel) => {
                  const Icon = panel.icon;
                  const isActive = activePanel === panel.id;
                  
                  return (
                    <Button
                      key={panel.id}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => onPanelChange(panel.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {panel.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};