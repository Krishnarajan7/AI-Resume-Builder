import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GripVertical, User, FileText, Briefcase, GraduationCap, Code, FolderOpen, Award, Globe } from "lucide-react";

const initialItems = [
  { id: "personal", name: "Personal Info", icon: User, enabled: true },
  { id: "summary", name: "Summary", icon: FileText, enabled: true },
  { id: "experience", name: "Experience", icon: Briefcase, enabled: true },
  { id: "education", name: "Education", icon: GraduationCap, enabled: true },
  { id: "skills", name: "Skills", icon: Code, enabled: true },
  { id: "projects", name: "Projects", icon: FolderOpen, enabled: true },
  { id: "certifications", name: "Certifications", icon: Award, enabled: true },
  { id: "languages", name: "Languages", icon: Globe, enabled: false },
];

const SortableItem = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-card border rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-sm"
      }`}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
      <IconComponent className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium flex-1">{item.name}</span>
      <div className={`w-2 h-2 rounded-full ${item.enabled ? "bg-green-500" : "bg-gray-300"}`} />
    </div>
  );
};

export const LayoutPanel = ({ onLayoutChange }) => {
  const [items, setItems] = useState(initialItems);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onLayoutChange?.(newItems);
        return newItems;
      });
    }
  };

  return (
    <div className="h-full flex flex-col border-t border-border/50">
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <h2 className="text-lg font-semibold text-foreground">Layout</h2>
        <p className="text-xs text-muted-foreground mt-1">Drag to reorder sections</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <Label className="text-xs mb-3 block">Section Order</Label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <h3 className="font-medium mb-2 text-foreground text-sm">Tips</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag sections to reorder them</li>
            <li>• Green dot = section is active</li>
            <li>• Most important sections should be at the top</li>
          </ul>
        </div>
      </div>
    </div>
  );
};