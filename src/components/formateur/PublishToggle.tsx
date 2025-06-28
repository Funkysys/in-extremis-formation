import { Switch } from "@/components/ui/switch";

interface PublishToggleProps {
  isPublished: boolean;
  onToggle: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const PublishToggle = ({
  isPublished,
  onToggle,
  className,
  disabled = false,
}: PublishToggleProps) => {
  return (
    <div className={className}>
      <Switch
        checked={isPublished}
        onCheckedChange={onToggle}
        variant={isPublished ? "primary" : "default"}
        label={isPublished ? "Published" : "Draft"}
        disabled={disabled}
      />
    </div>
  );
};
