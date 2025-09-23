"use client";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Détecte la préférence du navigateur au premier chargement
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    // Utilise le thème sauvegardé, sinon la préférence du navigateur, sinon dark par défaut
    const initialTheme = savedTheme || (prefersDark ? "dark" : "dark");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(
      theme === "dark" ? "theme-dark" : "theme-light"
    );
    // Sauvegarde le thème dans localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="px-4 py-2 text-gray-800 bg-gray-200 border rounded dark:bg-gray-800 dark:text-gray-200"
      style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
    </button>
  );
};

export default ThemeSwitch;
