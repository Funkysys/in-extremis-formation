import React from 'react';

interface CourseTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CourseTitleInput: React.FC<CourseTitleInputProps> = ({
  value,
  onChange,
  className = ''
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Titre du cours
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded bg-gray-700 text-white"
      required
    />
  </div>
);
