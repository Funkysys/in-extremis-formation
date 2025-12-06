interface FormActionsProps {
  isSubmitting: boolean;
  isPublished: boolean;
  isValid: boolean;
  onPublishToggle: (checked: boolean) => void;
  onCancel: () => void;
}

export function FormActions({
  isSubmitting,
  isPublished,
  isValid,
  onPublishToggle,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="publish"
          checked={isPublished}
          onChange={(e) => onPublishToggle(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="publish">Publish immediately</label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`px-6 py-2 rounded text-white ${
            isSubmitting || !isValid
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Course"}
        </button>
      </div>
    </div>
  );
}
