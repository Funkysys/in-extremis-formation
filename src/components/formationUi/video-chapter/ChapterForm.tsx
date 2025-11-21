// Formulaire d'édition/création de chapitre

import { VideoMarker } from "./types";
import { formatTime } from "./utils";

interface ChapterFormProps {
  marker: Partial<VideoMarker>;
  videoDuration: number;
  currentTime: number;
  onMarkerChange: (marker: Partial<VideoMarker>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ChapterForm({
  marker,
  videoDuration,
  currentTime,
  onMarkerChange,
  onSubmit,
  onCancel,
}: ChapterFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 p-4 border rounded-md bg-gray-50"
    >
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre du chapitre
        </label>
        <input
          type="text"
          id="title"
          value={marker.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onMarkerChange({ ...marker, title: e.target.value })
          }
          placeholder="Ex: Introduction"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temps
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max={videoDuration}
            value={marker.timestamp || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onMarkerChange({
                ...marker,
                timestamp: parseFloat(e.target.value),
              })
            }
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <span>secondes</span>
          <button
            type="button"
            className="px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() =>
              onMarkerChange({ ...marker, timestamp: currentTime })
            }
          >
            Utiliser le temps actuel
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Position actuelle: {formatTime(currentTime)}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (optionnel)
        </label>
        <textarea
          id="description"
          value={marker.description || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onMarkerChange({
              ...marker,
              description: e.target.value,
            })
          }
          placeholder="Description du chapitre"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[100px]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {marker.id ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
