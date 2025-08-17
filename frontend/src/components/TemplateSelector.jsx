import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    className={`template-card cursor-pointer transition-all duration-200 ${
      isSelected ? 'active' : ''
    }`}
    onClick={onClick}
  >
    <CardContent className="p-0">
      {/* Template Preview Image Placeholder */}
      <div className="aspect-[8.5/11] bg-gradient-to-b from-gray-50 to-gray-100 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-4 bg-white rounded shadow-sm">
          <div className="p-3 space-y-2">
            <div className="h-2 bg-gray-800 rounded w-1/2"></div>
            <div className="h-1 bg-gray-400 rounded w-1/3"></div>
            <div className="space-y-1 mt-3">
              <div className="h-1 bg-gray-300 rounded"></div>
              <div className="h-1 bg-gray-300 rounded w-4/5"></div>
              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="h-1 bg-gray-600 rounded w-1/4"></div>
              <div className="h-1 bg-gray-300 rounded w-2/3"></div>
              <div className="h-1 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <Badge className="bg-primary text-primary-foreground">Selected</Badge>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1">{template.name}</h3>
        <p className="text-xs text-muted-foreground">{template.description}</p>
      </div>
    </CardContent>
  </Card>
);

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Templates</h2>
        <p className="text-muted-foreground">Choose a professional template for your resume</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2">
            1-Column
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            2-Column
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="profile-pic" className="rounded" />
          <label htmlFor="profile-pic" className="text-sm text-muted-foreground">
            Include profile picture
          </label>
        </div>
      </div>

      <Tabs defaultValue="professional" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="minimal" className="text-xs">Minimal</TabsTrigger>
          <TabsTrigger value="professional" className="text-xs">Professional</TabsTrigger>
          <TabsTrigger value="modern" className="text-xs">Modern</TabsTrigger>
          <TabsTrigger value="creative" className="text-xs">Creative</TabsTrigger>
        </TabsList>

        {Object.entries(templates).map(([category, categoryTemplates]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 gap-4">
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

      <div className="pt-4 border-t border-border">
        <h3 className="font-medium mb-3">Template Features</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            ATS-Friendly Format
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Print-Optimized Layout
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Professional Typography
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Mobile Responsive
          </li>
        </ul>
      </div>
    </div>
  ); 
};