"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { MY_COURSES_QUERY } from "@/graphql/queries/course-queries";
import CourseCard from "@/components/formationUi/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MesCoursList() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { data, loading, error } = useQuery(MY_COURSES_QUERY);
  console.log(error);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur lors du chargement des cours</div>;

  const courses = (data?.myCourses || []);

  
  if (courses.length === 0) {
    return <div className="text-slate-500">Aucun cours créé pour le moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((formation: Course) => (
        <CourseCard key={formation.id} formation={formation} />
      ))}
    </div>
  );
}
