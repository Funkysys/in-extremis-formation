interface DeleteConfirmModalProps {
  isOpen: boolean;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 text-slate-800">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-red-700">
          Confirmer la suppression
        </h2>
        <p className="mb-6">
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est{" "}
          <span className="font-bold text-red-600">irréversible</span>.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={deleting}
          >
            Annuler
          </button>
          <button
            className="btn btn-error font-semibold"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Suppression..." : "Oui, supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
