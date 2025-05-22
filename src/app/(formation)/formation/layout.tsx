import Header from "@/components/formationUi/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formation | In-Extremis",
  description: "Formation section of In-Extremis",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function FormationLayout({ children }: LayoutProps) {
  return <>
          <Header title="Découvrez toutes nos formations" />
          {children}</>;
}
