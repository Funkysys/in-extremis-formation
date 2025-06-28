import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PublishToggle } from './PublishToggle';

interface CourseFormActionsProps {
  isSubmitting: boolean;
  isPublished: boolean;
  onPublishToggle: (checked: boolean) => void;
  isValid: boolean;
  className?: string;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  isSubmitting,
  isPublished,
  onPublishToggle,
  isValid,
  className = ''
}) => {
  const router = useRouter();

  return (
    <div className={`pt-6 flex items-center justify-between ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      
      <div className="flex items-center space-x-6">
        <PublishToggle
          isPublished={isPublished}
          onToggle={onPublishToggle}
          className="text-gray-300"
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
