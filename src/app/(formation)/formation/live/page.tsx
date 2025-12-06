"use client";
import FormationMenu from "@/components/formationUi/FormationMenu";
import {
  ActiveLivesSection,
  EmptyLivesMessage,
  PastLivesSection,
} from "@/components/live/LiveSections";
import { useCreateLive, useLiveStreams } from "./useLiveStreams";

export default function LiveListPage() {
  const { lives, activeLives, pastLives, isLoading, isFormateur } =
    useLiveStreams();
  const { handleCreateLive } = useCreateLive();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-900">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-sky-900">
      <FormationMenu />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              📹 Lives Streaming
            </h1>
            <p className="mt-2 text-gray-400">
              Rejoignez les sessions en direct ou regardez les replays
            </p>
          </div>
          {isFormateur && (
            <button
              onClick={handleCreateLive}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <span className="text-xl">➕</span>
              Nouveau Live
            </button>
          )}
        </div>
        <ActiveLivesSection activeLives={activeLives} />
        <EmptyLivesMessage lives={lives} />
        <PastLivesSection pastLives={pastLives} />
      </div>
    </div>
  );
}
