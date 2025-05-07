import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Formation | In-Extremis",
  description: "Formation section of In-Extremis",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function FormationLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
