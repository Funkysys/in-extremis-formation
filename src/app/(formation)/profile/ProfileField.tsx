interface ProfileFieldProps {
  label: string;
  value: string | undefined | null;
  defaultText?: string;
}

export function ProfileField({
  label,
  value,
  defaultText = "Non renseigné",
}: ProfileFieldProps) {
  return (
    <p>
      <strong>{label}:</strong> {value || defaultText}
    </p>
  );
}
