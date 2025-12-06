"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { CourseForm } from "@/features/courses/create/CourseForm";

export default function CreerFormationPage() {
  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Créer une nouvelle formation
        </h1>
        <CourseForm />
      </div>
    </RequireAuth>
  );
}
