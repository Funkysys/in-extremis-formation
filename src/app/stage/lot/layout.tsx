"use client";
import { useEffect, useState } from "react";

export default function StageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stageTheme, setStageTheme] = useState<"dark-lot" | "light-lot">(
    "dark-lot",
  );

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const savedStageTheme = localStorage.getItem("lot-theme") as
      | "dark-lot"
      | "light-lot"
      | null;

    const initialTheme =
      savedStageTheme || (prefersDark ? "dark-lot" : "dark-lot");
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
      "theme-dark-lot",
      "theme-light-lot",
    );
    document.body.classList.add(`theme-${stageTheme}`);
    localStorage.setItem("lot-theme", stageTheme);

    return () => {
      document.body.classList.remove("theme-dark-lot", "theme-light-lot");
      document.body.classList.add("theme-dark");
    };
  }, [stageTheme]);

  const toggleStageTheme = () => {
    setStageTheme(stageTheme === "dark-lot" ? "light-lot" : "dark-lot");
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
          backgroundColor: stageTheme === "dark-lot" ? "#70b8ff" : "#113264",
        }}
        onClick={toggleStageTheme}
      >
        {stageTheme === "dark-lot" ? "☀️ Stage Clair" : "🌙 Stage Sombre"}
      </button>
      {children}
    </>
  );
}
