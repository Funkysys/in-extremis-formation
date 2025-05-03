"use client";
import temp_formation_data from "@/data/temp_formation";
import Link from "next/link";
import { useEffect, useState } from "react";

const FormationMenu = () => {
  const [formation, setFormation] = useState<string>("");
  const [formationList, setFormationList] = useState(temp_formation_data);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
      className={`fixed ${isScrolled ? "top-2" : "top-24"} md:top-none z-500 transition-all duration-300 ml-2 `}
    >
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          <label
            htmlFor="my-drawer"
            className="btn btn-warning drawer-button shadow-none text-slate-800"
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
                className="btn btn-warning drawer-button text-slate-800"
              >
                Fermer le menu
              </label>
            </div>
            {formationList.map((formation) => (
              <li key={formation.id}>
                <Link
                  href="#"
                  className="text-slate-900 hover:bg-slate-300 border-b-2 border-slate-400"
                  onClick={() => {
                    setSelectedFormation(formation.title);
                    setOpen(!open);
                  }}
                >
                  {formation.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormationMenu;
