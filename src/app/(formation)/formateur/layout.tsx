import Sidebar from "@/components/formateur/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espace Formateur | In-Extremis",
  description: "Espace dédié aux formateurs In-Extremis",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function FormateurLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="w-full p-6 border-b border-slate-200 flex justify-between pl-20">
        <h1 className="text-4xl font-roboto text-slate-100">
          {"Bienvenue sur votre espace formateur"}
        </h1>
      </div>
      <Sidebar />
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 py-10 px-4 md:px-8 lg:px-12 w-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
