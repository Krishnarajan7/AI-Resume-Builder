import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


const fonts = [
  { id: "Inter", label: "Inter", stack: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" },
  { id: "IBM Plex Sans", label: "IBM Plex Sans", stack: "'IBM Plex Sans', Inter, Arial, sans-serif" },
  { id: "IBM Plex Serif", label: "IBM Plex Serif", stack: "'IBM Plex Serif', Georgia, serif" },
  { id: "Lato", label: "Lato", stack: "Lato, Inter, Arial, sans-serif" },
  { id: "Merriweather", label: "Merriweather", stack: "Merriweather, Georgia, serif" },
  { id: "Playfair Display", label: "Playfair Display", stack: "'Playfair Display', Georgia, serif" },
  { id: "Roboto Condensed", label: "Roboto Condensed", stack: "'Roboto Condensed', Roboto, Arial, sans-serif" },
  { id: "Open Sans", label: "Open Sans", stack: "'Open Sans', Inter, Arial, sans-serif" },
  { id: "PT Serif", label: "PT Serif", stack: "'PT Serif', Georgia, serif" },
  { id: "Lora", label: "Lora", stack: "Lora, Georgia, serif" },
];

export const TypographyPanel = ({ 
  fontFamily, 
  onFontFamilyChange, 
  fontSize, 
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  letterSpacing,
  onLetterSpacingChange,
  hideIcons,
  onHideIconsChange,
  underlineLinks,
  onUnderlineLinksChange
}) => {
  return (
    <div className="h-full flex flex-col border-t border-border/50">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground">Typography</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-5">
        <div>
          <Label className="text-xs mb-2 block">Font Family</Label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((f) => {
              const isActive = fontFamily === f.id;
              return (
                <Button
                  key={f.id}
                  variant={isActive ? "default" : "outline"}
                  className={`justify-start h-10 text-sm ${isActive ? "" : "bg-card"}`}
                  style={{ fontFamily: f.stack }}
                  onClick={() => onFontFamilyChange(f.id)}
                >
                  {f.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Base Font Size</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{fontSize}px</span>
            <Slider
              value={[fontSize]}
              min={12}
              max={20}
              step={1}
              className="flex-1"
              onValueChange={(v) => onFontSizeChange(v[0] ?? 14)}
            />
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Line Height</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{lineHeight}</span>
            <Slider
              value={[lineHeight]}
              min={1.0}
              max={2.5}
              step={0.1}
              className="flex-1"
              onValueChange={(v) => onLineHeightChange(v[0] ?? 1.5)}
            />
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Letter Spacing</Label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">{letterSpacing}px</span>
            <Slider
              value={[letterSpacing]}
              min={-2}
              max={5}
              step={0.1}
              className="flex-1"
              onValueChange={(v) => onLetterSpacingChange(v[0] ?? 0)}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Hide Icons</Label>
            <Switch
              checked={hideIcons}
              onCheckedChange={onHideIconsChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs">Underline Links</Label>
            <Switch
              checked={underlineLinks}
              onCheckedChange={onUnderlineLinksChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyPanel;