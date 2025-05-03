"use client";
import Link from "next/link";
import { useState } from "react";
import Cart from "./Cart";

const HorizontalMenu = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="relative">
      <ul className="menu md:menu-horizontal rounded-box text-slate-900 bg-sky-200 ">
        <li className="border-b-2 border-sky-900 hover:border-sky-600">
          <Link href="/" className="tooltip" data-tip="Accueil">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </li>
        <li className="border-b-2 border-sky-900 hover:border-sky-600">
          <Link
            href="/my-formation"
            className="tooltip"
            data-tip="Ma Formation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5"
              />
            </svg>
          </Link>
        </li>
        <li className="border-b-2 border-sky-900 hover:border-sky-600">
          <Link href="/profile" className="tooltip" data-tip="Profil">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </li>
        <li className="border-b-2 border-sky-900 hover:border-sky-600">
          <button
            onClick={handleCartOpen}
            className="tooltip"
            data-tip="Panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12l-2-5M9 21h6M9 21a2 2 0 11-4 0M15 21a2 2 0 104 0"
              />
            </svg>
          </button>
        </li>
      </ul>
      {isCartOpen && <Cart onClose={handleCartClose} />}
    </div>
  );
};

export default HorizontalMenu;
