// Composant pour afficher la liste des chapitres avec drag & drop

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChapterListItem } from "../ChapterListItem";
import { useDragAndDrop } from "../hooks";
import { VideoMarker } from "../types";
import { sortMarkers } from "../utils";

interface ChapterListProps {
  markers: VideoMarker[];
  onMarkersReorder: (markers: VideoMarker[]) => void;
  onEdit: (marker: VideoMarker) => void;
  onDelete: (id: string) => void;
}

export function ChapterList({
  markers,
  onMarkersReorder,
  onEdit,
  onDelete,
}: ChapterListProps) {
  const { sensors } = useDragAndDrop();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = markers.findIndex((m: VideoMarker) => m.id === active.id);
    const newIndex = markers.findIndex((m: VideoMarker) => m.id === over.id);
    const newMarkers = arrayMove([...markers], oldIndex, newIndex);

    onMarkersReorder(newMarkers as VideoMarker[]);
  };

  if (markers.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed rounded-md text-gray-500">
        Aucun chapitre défini pour le moment.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={markers} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {markers.sort(sortMarkers).map((marker) => (
            <ChapterListItem
              key={marker.id}
              marker={marker}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
