"use client";
import { COURSES_QUERY } from "@/graphql/queries/course-queries";
import { Course } from "@/types/course";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const FormationMenu = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const { data, loading, error } = useQuery(COURSES_QUERY, {
    variables: { publishedOnly: true },
  });

  const formations = data?.courses || [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed ${
        isScrolled ? "top-2" : "top-24"
      } md:top-none z-500 transition-all duration-300 ml-2 `}
    >
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          <label
            htmlFor="my-drawer"
            className="btn bg-amber-300 hover:bg-amber-400 drawer-button shadow-none text-slate-900 border-none"
          >
            Menu des formations
          </label>
        </div>
        <div className="drawer-side ">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu text-base-content min-h-full md:w-80 w-full p-4 bg-sky-100">
            <div className="drawer-content mb-6">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="btn bg-amber-300 hover:bg-amber-400 drawer-button shadow-none text-slate-900 border-none"
              >
                Fermer le menu
              </label>
            </div>
            {loading ? (
              <div>Chargement des formations...</div>
            ) : error ? (
              <div>Erreur lors du chargement des formations</div>
            ) : (
              formations.map((formation: Course) => (
                <li key={formation.id}>
                  <Link
                    href={`#${formation.id}`}
                    className="text-slate-900 hover:bg-slate-300 border-b-2 border-slate-400"
                    // ...existing code...
                  >
                    {formation.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormationMenu;
