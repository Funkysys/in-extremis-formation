import Header from "@/components/formationUi/Header";
import ToasterProvider from "@/providers/ToasterProvider";

function getTitle(path: string) {
  if (path.startsWith("/formation")) return "Découvrez toutes nos formations";
  if (path.startsWith("/profile")) return "Bienvenue sur votre profil";
  return "Bienvenue";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-sky-900 min-h-screen">
      <ToasterProvider>
        <Header title="Découvrez toutes nos formations" />
        {children}
      </ToasterProvider>
    </main>
  );
}
