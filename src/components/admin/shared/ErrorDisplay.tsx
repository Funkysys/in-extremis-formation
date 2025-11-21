// Composant: ErrorDisplay - Affichage d'erreur

import Link from "next/link";

interface GraphQLError {
  message: string;
}

interface ErrorDisplayProps {
  error: {
    message?: string;
    networkError?: { message: string };
    graphQLErrors?: GraphQLError[];
  };
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  let errorMsg = "Erreur lors du chargement du profil.";

  if (error.networkError) {
    errorMsg = `Erreur réseau : ${error.networkError.message}`;
  } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    errorMsg = error.graphQLErrors.map((e) => e.message).join(" | ");
  } else if (error.message) {
    errorMsg = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-slate-100 mx-2 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-red-600 font-roboto text-center">
          Erreur
        </h1>
        <div className="mb-6 text-base md:text-lg text-red-700 text-center">
          {errorMsg}
        </div>
        <Link
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold text-center"
        >
          {`Retour à l'accueil`}
        </Link>
      </div>
    </div>
  );
};
