"use client";
import { useState, useEffect } from "react";
import HorizontalMenu from "./HorizontalMenu";
import Login from "../auth/Login";
import { useToaster } from "@/providers/ToasterProvider";

interface HeaderProps {
  title?: string;
  forceLoggedOut?: boolean;
}

import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/graphql/queries/user-queries";

const Header = ({ title, forceLoggedOut }: HeaderProps) => {
  const { addToast } = useToaster();
  const [loggedIn, setLoggedIn] = useState(false);
  const { data } = useQuery(ME_QUERY, { skip: !loggedIn });
  const roles = data?.me?.roles?.map((r: any) => r.name) || [];
  const rolePriority = ["superadmin", "admin", "formateur", "staff", "user"];
  const role = roles.find((r: string) => rolePriority.includes(r)) || null;

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    const onLogin = () => setLoggedIn(true);
    window.addEventListener("login-success", onLogin);
    return () => window.removeEventListener("login-success", onLogin);
  }, []);

  const showLoggedIn = forceLoggedOut ? false : loggedIn;

  return (
    <div className="w-full p-6 border-b border-slate-200 flex justify-between">

      <h1 className="text-4xl font-roboto text-slate-100">{title ?? "Découvrez toutes nos formations"}</h1>
      {loggedIn ? (
        <HorizontalMenu role={role} />
      ) : (
        <Login onSuccess={() => {
          setLoggedIn(true);
          addToast("Connexion réussie !", "success");
        }} />
      )}
    </div>
  );
};

export default Header;
