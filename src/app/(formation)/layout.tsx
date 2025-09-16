import { ToastProvider } from "@/providers/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-sky-900 min-h-screen">
      <ToastProvider>{children}</ToastProvider>
    </main>
  );
}
