interface FormStatusProps {
  error: string | null;
  uploadStep: string;
  isSubmitting: boolean;
}

export function FormStatus({
  error,
  uploadStep,
  isSubmitting,
}: FormStatusProps) {
  return (
    <>
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      {uploadStep && (
        <div className="bg-blue-900/50 border border-blue-500 text-white p-4 rounded mb-6">
          <div className="flex items-center">
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-3"></div>
            )}
            <p>{uploadStep}</p>
          </div>
        </div>
      )}
    </>
  );
}
