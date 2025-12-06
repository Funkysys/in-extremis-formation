import Link from "next/link";
import { ActiveLiveCard, PastLiveCard } from "./LiveCards";

interface LiveStream {
  streamId: string;
  title?: string;
  description?: string;
  streamerUsername?: string;
  streamerId?: number;
  isActive: boolean;
  viewerCount: number;
  startedAt?: string;
}

interface LiveSectionsProps {
  activeLives: LiveStream[];
  pastLives: LiveStream[];
  lives: LiveStream[];
}

export function ActiveLivesSection({
  activeLives,
}: {
  activeLives: LiveStream[];
}) {
  if (activeLives.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold text-white">En Direct Maintenant</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeLives.map((live) => (
          <Link key={live.streamId} href={`/formation/live/${live.streamId}`}>
            <ActiveLiveCard live={live} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PastLivesSection({ pastLives }: { pastLives: LiveStream[] }) {
  if (pastLives.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-white">📼 Replays</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pastLives.map((live) => (
          <Link key={live.streamId} href={`/formation/live/${live.streamId}`}>
            <PastLiveCard live={live} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function EmptyLivesMessage({ lives }: { lives: LiveStream[] }) {
  if (lives.length > 0) return null;

  return (
    <div className="p-12 mb-12 text-center bg-gray-800 border border-gray-700 rounded-lg">
      <div className="mb-4 text-6xl">📺</div>
      <h3 className="mb-2 text-xl font-bold text-white">
        Aucun live disponible
      </h3>
      <p className="text-gray-400">Les lives apparaîtront ici</p>
    </div>
  );
}
