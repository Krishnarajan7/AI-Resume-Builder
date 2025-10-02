import { StickyNote, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const NotesPanel = () => {
  return (
    <div className="border-t border-border/50">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border p-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-medium text-foreground">Notes</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This section is reserved for your personal notes specific to this resume. 
          The content here remains private and is not shared with anyone else.
        </p>
        
        <Textarea
          placeholder="Add your notes here..."
          className="min-h-[120px] text-sm resize-none"
        />

        {/* Information Section */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <h3 className="text-sm font-medium text-foreground">Information</h3>
          </div>
          
          <div className="bg-primary/10 rounded-lg p-4 space-y-2">
            <p className="text-xs text-foreground/90 leading-relaxed">
              Licensed under MIT
            </p>
            <p className="text-xs text-foreground/90 leading-relaxed">
              By the community, for the community.
            </p>
            <p className="text-xs text-foreground/90 leading-relaxed">
              A passion project by Krishnarajan
            </p>
            <p className="text-xs font-semibold text-foreground">
              HireAI Resume v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
