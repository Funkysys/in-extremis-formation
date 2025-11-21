"use client";
import { PerformanceDebugger } from "@/components/debug/PerformanceDebugger";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
    <ThemeProvider>
      <button
        className="px-4 py-2 transition-colors duration-300 border rounded"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "var(--color-button-bg-stage)",
          color: "var(--color-button-text-stage)",
          borderColor: "var(--color-border-stage)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--color-button-hover-bg-stage)";
          e.currentTarget.style.color = "var(--color-button-hover-text-stage)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "var(--color-button-bg-stage)";
          e.currentTarget.style.color = "var(--color-button-text-stage)";
        }}
        onClick={toggleStageTheme}
      >
        {stageTheme === "dark-stage" ? "☀️ Stage Clair" : "🌙 Stage Sombre"}
      </button>
      {children}
      <PerformanceDebugger />
    </ThemeProvider>
  );
}
