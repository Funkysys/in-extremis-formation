// Item de la liste des chapitres avec drag & drop

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { VideoMarker } from "./types";
import { formatTime } from "./utils";

interface ChapterListItemProps {
  marker: VideoMarker;
  onEdit: (marker: VideoMarker) => void;
  onDelete: (id: string) => void;
}

export function ChapterListItem({
  marker,
  onEdit,
  onDelete,
}: ChapterListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: marker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded-md bg-white hover:bg-gray-50"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing flex flex-col justify-center"
      >
        <span className="block w-4 h-0.5 bg-gray-400 my-0.5"></span>
        <span className="block w-4 h-0.5 bg-gray-400 my-0.5"></span>
      </button>

      <div className="flex-1 cursor-pointer" onClick={() => onEdit(marker)}>
        <div className="font-medium">{marker.title}</div>
        <div className="text-sm text-gray-500">
          {formatTime(marker.timestamp)}
          {marker.description && ` • ${marker.description}`}
        </div>
      </div>

      <button
        type="button"
        className="p-1 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(marker.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
