"use client";
import { useState, useEffect } from "react";
import HorizontalMenu from "./HorizontalMenu";
import Login from "../auth/Login";
import { useToaster } from "@/providers/ToasterProvider";
import { useQuery, useApolloClient } from "@apollo/client";
import { ME_QUERY } from "@/graphql/queries/user-queries";

interface HeaderProps {
  title?: string;
}
type Role = { name: string };

const Header = ({ title }: HeaderProps) => {
  const client = useApolloClient();
  const { addToast } = useToaster();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const { data, loading } = useQuery(ME_QUERY, { skip: !hasToken });

  useEffect(() => {
    setHasToken(typeof window !== "undefined" && !!localStorage.getItem("token"));
  }, []);

  useEffect(() => {

    if (!hasToken) {
      setTokenChecked(true);
      return;
    }
    if (!loading) {
      if (!data?.me) {
        localStorage.removeItem("token");
      }
      setTokenChecked(true);
    }
  }, [hasToken, data, loading]);

  if (!tokenChecked || (hasToken && loading && !data?.me)) {
    return <div>Chargement...</div>;
  }

  const roles = data?.me?.roles?.map((r: Role) => r.name) || [];
  const rolePriority = ["superadmin", "admin", "formateur", "staff", "user"];
  const role = roles.find((r: string) => rolePriority.includes(r)) || null;
  return (
    <div className="w-full p-6 border-b border-slate-200 flex justify-between">
      <h1 className="text-4xl font-roboto text-slate-100">{title ?? "Découvrez toutes nos formations"}</h1>
      {data?.me ? (
        <HorizontalMenu role={role} />
      ) : (
        <Login onSuccess={async () => {
          addToast("Connexion réussie !", "success");
          setHasToken(true);
          await client.refetchQueries({ include: [ME_QUERY] });
        }} />
      )}
    </div>
  );
};

export default Header;
