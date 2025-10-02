import { FileJson, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ExportPanel = () => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: "Export Resume",
      description: `Exporting as ${format}...`,
    });
  };

  return (
    <div className="border-t border-border/50">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Export</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* JSON Card */}
        <div
          onClick={() => handleExport("JSON")}
          className="cursor-pointer rounded-md border border-border bg-muted/10 hover:bg-muted/20 transition p-4 flex gap-3"
        >
          <FileJson className="w-6 h-6 text-foreground" />
          <div className="flex-1">
            <div className="font-medium text-sm">JSON</div>
            <div className="text-xs text-muted-foreground">
              Download a JSON file of your resume data. This file can be used to import your resume into other applications or for backup purposes.
            </div>
          </div>
        </div>

        {/* PDF Card */}
        <div
          onClick={() => handleExport("PDF")}
          className="cursor-pointer rounded-md border border-border bg-muted/10 hover:bg-muted/20 transition p-4 flex gap-3"
        >
          <FileText className="w-6 h-6 text-foreground" />
          <div className="flex-1">
            <div className="font-medium text-sm">PDF</div>
            <div className="text-xs text-muted-foreground">
              Download a professionally formatted PDF version of your resume, ready to be shared with potential employers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
