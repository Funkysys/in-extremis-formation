"use client";
import { useEffect, useState } from "react";

export default function StageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stageTheme, setStageTheme] = useState<"dark-stage" | "light-stage">(
    "dark-stage"
  );

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedStageTheme = localStorage.getItem("stage-theme") as
      | "dark-stage"
      | "light-stage"
      | null;

    const initialTheme =
      savedStageTheme || (prefersDark ? "dark-stage" : "dark-stage");
    setStageTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.body.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-dark-stage",
      "theme-light-stage"
    );
    document.body.classList.add(`theme-${stageTheme}`);
    localStorage.setItem("stage-theme", stageTheme);

    return () => {
      document.body.classList.remove("theme-dark-stage", "theme-light-stage");
      document.body.classList.add("theme-dark");
    };
  }, [stageTheme]);

  const toggleStageTheme = () => {
    setStageTheme(stageTheme === "dark-stage" ? "light-stage" : "dark-stage");
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
          backgroundColor: stageTheme === "dark-stage" ? "#70b8ff" : "#113264",
        }}
        onClick={toggleStageTheme}
      >
        {stageTheme === "dark-stage" ? "☀️ Stage Clair" : "🌙 Stage Sombre"}
      </button>
      {children}
    </>
  );
}
