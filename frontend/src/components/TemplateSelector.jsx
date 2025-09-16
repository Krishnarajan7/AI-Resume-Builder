import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const templates = {
  minimal: [
    {
      id: "minimal-clean",
      name: "Clean Minimal",
      preview: "minimal-clean.png",
      description: "Simple, clean design perfect for any industry"
    },
    {
      id: "minimal-elegant",
      name: "Elegant Minimal",
      preview: "minimal-elegant.png", 
      description: "Sophisticated minimal design with subtle accents"
    }
  ],
  professional: [
    {
      id: "modern",
      name: "Modern Professional",
      preview: "modern-professional.png",
      description: "Contemporary design with blue accents"
    },
    {
      id: "corporate",
      name: "Corporate Classic",
      preview: "corporate-classic.png",
      description: "Traditional professional layout"
    }
  ],
  modern: [
    {
      id: "modern-creative",
      name: "Modern Creative",
      preview: "modern-creative.png",
      description: "Bold design with creative elements"
    },
    {
      id: "modern-tech",
      name: "Tech Modern",
      preview: "modern-tech.png",
      description: "Perfect for tech professionals"
    }
  ],
  creative: [
    {
      id: "creative-bold",
      name: "Bold Creative",
      preview: "creative-bold.png",
      description: "Eye-catching design for creative roles"
    },
    {
      id: "creative-artistic",
      name: "Artistic Creative",
      preview: "creative-artistic.png",
      description: "Unique layout for artists and designers"
    }
  ]
};

const TemplatePreview = ({ template, isSelected, onClick }) => (
  <Card 
    className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/30'
    }`}
    onClick={onClick}
  >
    <CardContent className="p-2">
      <div className="aspect-[3/4] bg-muted/50 rounded-md mb-2 overflow-hidden relative">
        <div className="absolute inset-2 bg-card rounded shadow-sm">
          <div className="p-2 space-y-1">
            <div className="h-1 bg-foreground rounded w-1/2"></div>
            <div className="h-0.5 bg-muted-foreground rounded w-1/3"></div>
            <div className="space-y-0.5 mt-2">
              <div className="h-0.5 bg-muted-foreground/60 rounded"></div>
              <div className="h-0.5 bg-muted-foreground/60 rounded w-4/5"></div>
              <div className="h-0.5 bg-muted-foreground/60 rounded w-3/4"></div>
            </div>
            <div className="mt-2 space-y-0.5">
              <div className="h-0.5 bg-foreground/80 rounded w-1/4"></div>
              <div className="h-0.5 bg-muted-foreground/60 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <Badge className="bg-primary text-primary-foreground text-xs">✓</Badge>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-xs text-center text-foreground">{template.name}</h3>
    </CardContent>
  </Card>
);

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground">Templates</h2>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <Tabs defaultValue="professional" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="professional" className="text-xs">Pro</TabsTrigger>
            <TabsTrigger value="modern" className="text-xs">Modern</TabsTrigger>
            <TabsTrigger value="creative" className="text-xs">Creative</TabsTrigger>
          </TabsList>

          {Object.entries(templates).slice(1).map(([category, categoryTemplates]) => (
            <TabsContent key={category} value={category} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {categoryTemplates.map((template) => (
                  <TemplatePreview
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => onTemplateSelect(template.id)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2 text-foreground text-sm">Features</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• ATS-friendly</li>
            <li>• Professional design</li>
            <li>• Export ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
};