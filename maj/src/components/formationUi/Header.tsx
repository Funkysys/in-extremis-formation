"use client";
import { useState, useEffect } from "react";
import HorizontalMenu from "./HorizontalMenu";
import Login from "../auth/Login";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {    setLoggedIn(!!localStorage.getItem("token"));
    const onLogin = () => setLoggedIn(true);
    window.addEventListener("login-success", onLogin);
    return () => window.removeEventListener("login-success", onLogin);
  }, []);

  return (
    <div className="w-full p-6 border-b border-slate-200 flex justify-between">
        <h1 className="text-4xl font-roboto">{`Découvrez toutes nos formations`}</h1>
        {loggedIn ? <HorizontalMenu /> : <Login onSuccess={() => setLoggedIn(true)} />}
      </div>
  );
};

export default Header;
