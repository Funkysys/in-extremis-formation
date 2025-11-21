// Composant d'état de chargement

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
