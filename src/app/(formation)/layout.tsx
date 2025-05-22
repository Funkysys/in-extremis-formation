import Header from "@/components/formationUi/Header";
import ToasterProvider from "@/providers/ToasterProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-sky-900 min-h-screen">
      <ToasterProvider>
        {children}
      </ToasterProvider>
    </main>
  );
}
