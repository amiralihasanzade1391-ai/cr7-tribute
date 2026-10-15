"use client";
import { useState } from "react";
import { GripVertical } from "lucide-react";

interface SortableListProps {
  items: string[];
  onReorder: (newItems: string[]) => void;
  renderItem: (item: string, index: number) => React.ReactNode;
}

export function SortableList({ items, onReorder, renderItem }: SortableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setOverIndex(null);
      return;
    }
    const newItems = [...items];
    const [moved] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, moved);
    onReorder(newItems);
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-2 transition-all ${
            draggedIndex === index ? "opacity-30" : ""
          } ${overIndex === index && draggedIndex !== index ? "border-t-2 border-yellow-500" : ""}`}
        >
          <div className="cursor-grab active:cursor-grabbing p-2 text-zinc-500 hover:text-yellow-400">
            <GripVertical size={16} />
          </div>
          <div className="flex-1">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
