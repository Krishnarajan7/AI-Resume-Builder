import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Code2 } from "lucide-react";


const colorOptions = [
  // Row 1 - Blues and Grays
  "#64748b", "#374151", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d", "#16a34a", "#059669",
  // Row 2 - More vibrant colors
  "#0891b2", "#0284c7", "#2563eb", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c026d3", "#db2777"
];

export const ThemePanel = ({
  primaryColor = "#2563eb",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  lineHeight = 1.5,
  onPrimaryColorChange,
  onBackgroundColorChange,
  onTextColorChange,
  onLineHeightChange
}) => {
  const [borderRadius, setBorderRadius] = useState(8);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [customCSS, setCustomCSS] = useState("* {\n  outline: 1px solid #000;\n  outline-offset: 4px;\n}");
  const [applyCustomCSS, setApplyCustomCSS] = useState(false);

  return (
    <div className="h-full flex flex-col border-t border-border/50">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-3 z-10">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">Theme</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Color Palette */}
        <div>
          <div className="grid grid-cols-9 gap-1.5 mb-4">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  primaryColor === color ? "border-foreground shadow-sm" : "border-border/30"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onPrimaryColorChange?.(color)}
              />
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Primary Color</Label>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: primaryColor }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange?.(e.target.value)}
              className="flex-1 bg-transparent text-xs font-mono outline-none"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Background Color</Label>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: backgroundColor }}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange?.(e.target.value)}
              className="flex-1 bg-transparent text-xs font-mono outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Text Color</Label>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: textColor }}
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => onTextColorChange?.(e.target.value)}
              className="flex-1 bg-transparent text-xs font-mono outline-none"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Line Height */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Line Height</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{lineHeight}</span>
            <Slider
              value={[lineHeight]}
              min={1.0}
              max={2.5}
              step={0.1}
              className="flex-1"
              onValueChange={(v) => onLineHeightChange?.(v[0] ?? 1.5)}
            />
          </div>
        </div>

        {/* Letter Spacing */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Letter Spacing</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{letterSpacing}px</span>
            <Slider
              value={[letterSpacing]}
              min={-2}
              max={5}
              step={0.1}
              className="flex-1"
              onValueChange={(v) => setLetterSpacing(v[0] ?? 0)}
            />
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <Label className="text-xs font-medium mb-2 block text-foreground">Border Radius</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{borderRadius}px</span>
            <Slider
              value={[borderRadius]}
              min={0}
              max={20}
              step={1}
              className="flex-1"
              onValueChange={(v) => setBorderRadius(v[0] ?? 8)}
            />
          </div>
        </div>

        {/* Custom CSS */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-3 h-3 text-muted-foreground" />
            <Label className="text-xs font-medium text-foreground">Custom CSS</Label>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Apply Custom CSS</span>
            <Switch
              checked={applyCustomCSS}
              onCheckedChange={setApplyCustomCSS}
            />
          </div>
          
          <Textarea
            value={customCSS}
            onChange={(e) => setCustomCSS(e.target.value)}
            className="min-h-[80px] text-xs font-mono bg-muted/50 border"
            placeholder="Enter custom CSS..."
          />
        </div>

        {/* Page Settings */}
        <div className="border-t pt-4">
          <Label className="text-xs font-medium mb-3 block text-foreground">Page</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Show Page Margins</span>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Show Grid</span>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">A4 Page Size</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};