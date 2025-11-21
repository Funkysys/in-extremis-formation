// Composant d'état d'erreur

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="p-4 text-red-600 bg-red-50 rounded-md">
      Erreur lors du chargement des marqueurs: {message}
    </div>
  );
}
