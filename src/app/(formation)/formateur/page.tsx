import Header from '@/components/formationUi/Header';
import Link from 'next/link';

export default function FormateurHome() {
  return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-slate-800 rounded-xl shadow-lg p-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Bienvenue sur votre espace formateur</h2>
          <Link href="/formateur/mes-formations" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-colors">
            🎬 Mes formations
          </Link>
        </div>
      </div>
  );
}
