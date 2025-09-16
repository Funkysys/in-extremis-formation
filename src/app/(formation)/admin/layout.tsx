import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-6 border-b border-slate-200 flex justify-between pl-20">
        <h1 className="text-4xl font-roboto text-slate-100">
          {"Bienvenue sur l'espace Admin"}
        </h1>
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 py-10 px-4 md:px-8 lg:px-12 w-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
