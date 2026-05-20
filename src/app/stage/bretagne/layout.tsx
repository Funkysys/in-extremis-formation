"use client";
import { useEffect, useState } from "react";

export default function StageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stageTheme, setStageTheme] = useState<
    "dark-bretagne" | "light-bretagne"
  >("dark-bretagne");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const savedStageTheme = localStorage.getItem("bretagne-theme") as
      | "dark-bretagne"
      | "light-bretagne"
      | null;

    const initialTheme =
      savedStageTheme || (prefersDark ? "dark-bretagne" : "dark-bretagne");
    setStageTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.body.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-dark-stage",
      "theme-light-stage",
      "theme-dark-bretagne",
      "theme-light-bretagne",
    );
    document.body.classList.add(`theme-${stageTheme}`);
    localStorage.setItem("bretagne-theme", stageTheme);

    return () => {
      document.body.classList.remove(
        "theme-dark-bretagne",
        "theme-light-bretagne",
      );
      document.body.classList.add("theme-dark");
    };
  }, [stageTheme]);

  const toggleStageTheme = () => {
    setStageTheme(
      stageTheme === "dark-bretagne" ? "light-bretagne" : "dark-bretagne",
    );
  };

  return (
    <>
      <button
        className="px-4 py-2 text-white transition-colors duration-300 border rounded"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor:
            stageTheme === "dark-bretagne" ? "#5eb3ff" : "#0369a1",
        }}
        onClick={toggleStageTheme}
      >
        {stageTheme === "dark-bretagne" ? "☀️ Stage Clair" : "🌙 Stage Sombre"}
      </button>
      {children}
    </>
  );
}
