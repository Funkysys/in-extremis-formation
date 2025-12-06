interface ErrorStateProps {
  error: Error | { message?: string } | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-red-500 text-center p-4">
      Une erreur est survenue lors du chargement des formations.
      {error?.message && <p className="text-sm mt-2">{error.message}</p>}
    </div>
  );
}
