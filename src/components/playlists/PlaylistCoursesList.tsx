"use client";

import CourseCard from "@/components/formationUi/CourseCard";
import { useState } from "react";

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  position: number;
  [key: string]: unknown;
}

interface PlaylistCoursesListProps {
  courses: Course[];
  playlistId: string;
  onReorder: (courseIds: string[]) => Promise<void>;
  onRemove: (courseId: string) => Promise<void>;
  isEditable?: boolean;
}

export default function PlaylistCoursesList({
  courses,
  onReorder,
  onRemove,
  isEditable = true,
}: PlaylistCoursesListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [orderedCourses, setOrderedCourses] = useState(courses);

  // Update when courses prop changes
  if (courses !== orderedCourses && draggedIndex === null) {
    setOrderedCourses(courses);
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditable) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!isEditable || draggedIndex === null || draggedIndex === index) return;

    const newCourses = [...orderedCourses];
    const draggedCourse = newCourses[draggedIndex];

    // Remove from old position
    newCourses.splice(draggedIndex, 1);
    // Insert at new position
    newCourses.splice(index, 0, draggedCourse);

    setOrderedCourses(newCourses);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (!isEditable || draggedIndex === null) return;

    const courseIds = orderedCourses.map((c) => c.id);
    await onReorder(courseIds);
    setDraggedIndex(null);
  };

  const handleRemove = async (courseId: string) => {
    if (!isEditable) return;
    if (confirm("Retirer ce cours de la playlist ?")) {
      await onRemove(courseId);
    }
  };

  if (orderedCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">📚</span>
        <p className="text-slate-600 dark:text-slate-400">
          Cette playlist est vide
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Ajoutez des cours pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orderedCourses.map((course, index) => (
        <div
          key={course.id}
          draggable={isEditable}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            relative group
            ${isEditable ? "cursor-move" : ""}
            ${draggedIndex === index ? "opacity-50" : ""}
            transition-opacity
          `}
        >
          <div className="flex items-start gap-4">
            {isEditable && (
              <div className="flex-shrink-0 pt-4">
                <div className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-600">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="9" cy="5" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="9" cy="19" r="1.5" />
                    <circle cx="15" cy="5" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="15" cy="19" r="1.5" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex-1">
              <CourseCard formation={course as never} />
            </div>

            {isEditable && (
              <div className="flex-shrink-0 pt-4">
                <button
                  onClick={() => handleRemove(course.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Retirer de la playlist"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
