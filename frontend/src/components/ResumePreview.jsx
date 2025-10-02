import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Undo, Redo, RotateCcw, Hand } from "lucide-react";
import { useState } from "react";


const ModernTemplate = ({ data, primaryColor, backgroundColor, textColor }) => (
  <div className="p-8 max-w-4xl mx-auto shadow-lg rounded-lg" style={{ backgroundColor: backgroundColor || undefined, color: textColor || undefined }}>
    {/* Header */}
    <div className="border-b-2 border-gray-200 pb-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {data?.personalInfo?.fullName || "John Doe"}
      </h1>
      <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>{data?.personalInfo?.email || "john@example.com"}</span>
        {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
        {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
      </div>
    </div>

    {/* Professional Summary */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 pl-3" style={{ borderLeftColor: primaryColor }}>
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {data?.summary || "Experienced software engineer with 8+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact projects that improve user experience and drive business growth. Expertise in React, Node.js, and cloud technologies."}
      </p>
    </div>

    {/* Experience */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 pl-3" style={{ borderLeftColor: primaryColor }}>
        Work Experience
      </h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
              <p className="font-medium" style={{ color: primaryColor }}>TechCorp Inc.</p>
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
              <p className="font-medium" style={{ color: primaryColor }}>StartupXYZ</p>
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
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 pl-3" style={{ borderLeftColor: primaryColor }}>
        Education
      </h2>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h3>
          <p className="font-medium" style={{ color: primaryColor }}>University of Technology</p>
        </div>
        <span className="text-gray-600 text-sm">2015 - 2019</span>
      </div>
    </div>

    {/* Skills */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-l-4 pl-3" style={{ borderLeftColor: primaryColor }}>
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

const MinimalTemplate = ({ data, backgroundColor, textColor, primaryColor }) => (
  <div className="p-8 max-w-4xl mx-auto" style={{ backgroundColor: backgroundColor || undefined, color: textColor || undefined }}>
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

export const ResumePreview = ({ 
  template, 
  resumeData, 
  fontFamily, 
  fontSize, 
  primaryColor, 
  backgroundColor, 
  textColor, 
  lineHeight,
  letterSpacing,
  hideIcons,
  underlineLinks,
  onUndo, 
  onRedo, 
  canUndo = false, 
  canRedo = false 
}) => {
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, parseFloat((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, parseFloat((z - 0.1).toFixed(2))));
  const handleResetZoom = () => setZoom(1);
  
  const handleUndo = () => {
    onUndo?.();
  };
  
  const handleRedo = () => {
    onRedo?.();
  };

  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate data={resumeData} backgroundColor={backgroundColor} textColor={textColor} primaryColor={primaryColor} />;
      case "modern":
      default:
        return <ModernTemplate data={resumeData} primaryColor={primaryColor} backgroundColor={backgroundColor} textColor={textColor} />;
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo} 
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRedo} 
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="outline" size="sm" onClick={handleZoomOut} aria-label="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} aria-label="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom} aria-label="Reset zoom">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button 
              variant={isPanning ? "default" : "outline"} 
              size="sm" 
              onClick={() => setIsPanning(!isPanning)} 
              aria-label="Toggle scroll to pan"
            >
              <Hand className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div 
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-4 overflow-auto h-[calc(100vh-160px)] sm:h-[calc(100vh-200px)] ${isPanning ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="flex justify-center min-w-0">
          <Card className="shadow-2xl w-full max-w-4xl overflow-hidden">
            <div
              className="origin-top transition-transform"
              style={{ 
                transform: `scale(${zoom})`, 
                fontFamily: fontFamily, 
                fontSize: fontSize ? `${fontSize}px` : undefined, 
                lineHeight: lineHeight ? `${lineHeight}` : undefined, 
                letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
                color: textColor 
              }}
            >
              {renderTemplate()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};