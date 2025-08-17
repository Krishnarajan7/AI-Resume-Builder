import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ModernTemplate = () => (
  <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg rounded-lg">
    {/* Header */}
    <div className="border-b-2 border-gray-200 pb-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
      <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>john@example.com</span>
        <span>+1 (555) 123-4567</span>
        <span>New York, NY</span>
        <span>linkedin.com/in/johndoe</span>
      </div>
    </div>

    {/* Professional Summary */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-blue-500 pl-3">
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Experienced software engineer with 8+ years developing scalable web applications. 
        Proven track record of leading cross-functional teams and delivering high-impact projects 
        that improve user experience and drive business growth. Expertise in React, Node.js, 
        and cloud technologies.
      </p>
    </div>

    {/* Experience */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
        Work Experience
      </h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
              <p className="text-blue-600 font-medium">TechCorp Inc.</p>
            </div>
            <span className="text-gray-600 text-sm">Jan 2021 - Present</span>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Led development of microservices architecture, reducing system latency by 40%</li>
            <li>Mentored 5 junior developers, improving team productivity by 25%</li>
            <li>Implemented CI/CD pipelines, reducing deployment time from 2 hours to 15 minutes</li>
          </ul>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Software Engineer</h3>
              <p className="text-blue-600 font-medium">StartupXYZ</p>
            </div>
            <span className="text-gray-600 text-sm">Jun 2019 - Dec 2020</span>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>Developed full-stack web applications using React and Node.js</li>
            <li>Collaborated with design team to implement responsive UI components</li>
            <li>Optimized database queries, improving application performance by 30%</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Education */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
        Education
      </h2>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h3>
          <p className="text-blue-600 font-medium">University of Technology</p>
        </div>
        <span className="text-gray-600 text-sm">2015 - 2019</span>
      </div>
    </div>

    {/* Skills */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
        Technical Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB'].map((skill) => (
          <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

const MinimalTemplate = () => (
  <div className="bg-white p-8 max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-light text-gray-900 mb-2">John Doe</h1>
      <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
      <div className="flex justify-center gap-6 text-sm text-gray-600">
        <span>john@example.com</span>
        <span>+1 (555) 123-4567</span>
        <span>New York, NY</span>
      </div>
    </div>

    <hr className="border-gray-300 mb-8" />

    {/* Content sections with minimal styling */}
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wider">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Experienced software engineer with 8+ years developing scalable web applications. 
          Proven track record of leading cross-functional teams and delivering high-impact projects.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4 uppercase tracking-wider">
          Experience
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="font-medium text-gray-900">Senior Software Engineer, TechCorp Inc.</h3>
              <span className="text-gray-600 text-sm">2021 - Present</span>
            </div>
            <p className="text-gray-700 text-sm">Led development of microservices architecture, reducing system latency by 40%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ResumePreview = ({ template }) => {
  const { toast } = useToast();

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

  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate />;
      case "modern":
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="p-4 sm:p-6 h-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Live Preview</h2>
          <p className="text-sm sm:text-base text-muted-foreground">See your resume as you edit</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2">100%</span>
            <Button variant="outline" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm" onClick={handleExportPDF}>
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export </span>PDF
            </Button>
            <Button size="sm" variant="outline" className="gap-1 sm:gap-2 text-xs sm:text-sm" onClick={handleExportDOCX}>
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              DOCX
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-4 overflow-auto h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)]">
        <div className="flex justify-center min-w-0">
          <Card className="shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="scale-75 sm:scale-90 lg:scale-100 origin-top transition-transform">
              {renderTemplate()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};