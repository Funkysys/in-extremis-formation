// Composant: DeleteConfirmation - Confirmation de suppression

interface DeleteConfirmationProps {
  show: boolean;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation = ({
  show,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) => {
  if (!show) return null;

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <p>
        Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
        irréversible.
      </p>
      <div className="flex gap-4 mt-2">
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={onConfirm}
          disabled={deleting}
        >
          Oui, supprimer
        </button>
        <button className="bg-gray-300 px-3 py-1 rounded" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
};
